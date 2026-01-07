import Session from "../models/session.js";
import Room from "../models/room.js";

// Shared in-memory store for rooms with userId-keyed participants.

const rooms = new Map();
const users = new Map();

/**
 * Room structure (internal):
 * {
 *    roomName,
 *    participants: Map<userId, { name: string, sockets: socketId }>,
 *    isSessionActive: boolean,
 *    sessionStart: number | null,
 *    duration: number | null,
 *    ownerId: string | null,
 *    roomStatus: waiting | active | ended,
 * }
 */
// MARK: getOrCreateRoom

export function getOrCreateRoom(roomId, roomName) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      roomName: roomName ?? "My room",
      participants: new Map(),
      isSessionActive: false,
      sessionStart: null,
      duration: null,
      owner: { ownerId: null, tempOwner: true },
      roomStatus: "waiting",
      ownerGracePeriod: { oldOwner: null, timeRef: null, },
    });
  }
  return rooms.get(roomId);
}

export function getRoomIfExists(roomId) {
  return rooms.get(roomId) || null;
}

/***
 [
  [userId, 
    {
      name: ...,
      roomId: ...,
      socketId: ...,
      connectedAt: number,
    }
  ]
  ] 
*/
//MARK: getOrCreateUser

export function getOrCreateUser(userId, userName = "User Name", roomId = "My Room", socketId = "default") {
  if (!users.has(userId)) {
    users.set(userId, {
      userName,
      roomId,
      socketId,
      connectedAt: new Date(),
    });
  }

  return users.get(userId);
}

export function getUserIfExists(userId) {
  return users.get(userId) || null;
}

/**
 * Add a user to a room's participant list in memory.
 * Enforces one-room-per-user and one-socket-per-user (last tab wins).
 * Automatically removes the user from any previous room and
 * assigns room ownership if the room is empty.
 *
 * @param {string} roomId - Room to join.
 * @param {string} userId - Authenticated user identifier.
 * @param {string} userName - Display name of the user.
 * @param {string} socketId - Active socket connection.
 * @returns {object} Updated room object.
 */
// MARK: addParticipantToRoom

export async function addParticipantToRoom(io, roomId, userId, userName, socketId) {

  const roomInDb = await Room.findOne({_id: roomId}).select('roomName');

  const room = getOrCreateRoom(roomId, roomInDb?.roomName);
  if (!room) {
    throw new Error("ROOM_NOT_FOUND");
  }

  const user = getUserIfExists(userId);

  // LAST TAB WINS — disconnect old socket
  if (user && user.socketId !== socketId) {
    const oldSocket = io.sockets.sockets.get(user.socketId);
    oldSocket?.disconnect(true);
  }

  // Remove user from previous room
  if (user && user.roomId && user.roomId !== roomId) {
    const oldRoom = getRoomIfExists(user.roomId);
    oldRoom?.participants.delete(userId);
  }

  // update user
  const updatedUser = getOrCreateUser(userId);
  updatedUser.userName = userName;
  updatedUser.roomId = roomId;
  updatedUser.socketId = socketId;

  room.participants.set(userId, {
    userName,
    socketId,
    joinedAt: updatedUser.connectedAt,
  });

  // Assign owner if first participant
  if (!room.owner.ownerId) {
    room.owner.ownerId = userId;
    room.owner.tempOwner = false;
  }

  if (room.owner.tempOwner && userId === room.ownerGracePeriod.oldOwner) {
    clearTimeout(room.ownerGracePeriod.timeRef);
    room.owner.ownerId = userId;
    room.owner.tempOwner = false;
    room.ownerGracePeriod.oldOwner = null;
    room.ownerGracePeriod.timeRef = null;
  }

  return room;
}

/**
 * Remove a user from their current room and clean up memory state.
 * Reassigns room ownership if the owner leaves and deletes the room
 * from memory if no participants remain.
 *
 * @param {string} userId - Authenticated user identifier.
 * @returns {object|null} Removed user object or null if user did not exist.
 */
// MARK:removeUserfromRoom

export function removeUserFromRoom(io, userId, source) {
  const user = getUserIfExists(userId);
  if (!user) return null;

  // delete userId from rooms-> participants
  const room = getRoomIfExists(user.roomId);
  if (room) {
    room.participants.delete(userId);

    // reassign owner
    const assignNextOwner = () => {
      const next = room.participants.keys().next();
      return (next.done ? null : next.value);
    };

    if (room.owner.ownerId === userId) {
      if (source === 'leave-room') {
        // Ownership transfer
        room.owner.ownerId = assignNextOwner();
      } else {
        room.ownerGracePeriod.oldOwner = userId;
        room.owner.tempOwner = true;
        room.owner.ownerId = assignNextOwner();

        room.ownerGracePeriod.timeRef = setTimeout(() => {
          room.owner.tempOwner = false;
          room.ownerGracePeriod.oldOwner = null;
          room.ownerGracePeriod.timeRef = null;

          const participants = Array.from(room.participants.entries()).map(
            ([uid, p]) => ({
              userId: uid,
              name: p.userName,
            })
          );

          io.to(room.roomId).emit("presence-update", {
            users: participants,
            ownerId: room.owner.ownerId,
            isOwnerTemp: room.owner.tempOwner,
            userUpdate: {
              userName: users.get(room.owner.ownerId)?.userName || "Unknown Host",
              userId: room.owner.ownerId,
              state: "ownerChanged",
            },
          });

        }, 8000);
      }
    }

    // delete room if empty
    if (room.participants.size === 0) {
      rooms.delete(user.roomId);
    }
  }

  users.delete(userId);

  return user;
}


/**
 * Start a new session for a room or reuse the currently active session.
 * Persists session timing in the database to support refresh and crash recovery.
 * Ensures only one active session exists per room at any time.
 *
 * @param {string} roomId - Unique room identifier.
 * @param {number} startTime - Session start timestamp (milliseconds since epoch).
 * @param {number} duration - Fixed session duration in milliseconds.
 * @returns {{
 *   isNewSession: boolean,
 *   sessionStart: number,
 *   duration: number,
 *   roomStatus: string
 * }} Session state information.
 */

// MARK: startSession
export async function startSession(roomId, startTime, duration) {

  let room = await Room.findOne({ _id: roomId });

  // If room exists AND session already active → reuse
  if (room && room.isSessionActive) {
    return {
      isNewSession: false,
      sessionStart: room.recentSessionStart,
      duration: room.duration,
      roomStatus: room.roomStatus,
    };
  }

  // If room does NOT exist → create one
  if (!room) {
    const rm = getRoomIfExists(roomId);

    // getting the participant as object
    const users = Array.from(rm.participants.entries()).map(
      ([uid, p]) => ({
        userId: uid,
        userName: p.userName,
        joinedAt: p.joinedAt,
      })
    );

    room = new Room({
      _id: roomId,
      roomName: rm.roomName,
      ownerId: rm.owner.ownerId,
      sessionIds: [],
      participants: users,
    });
  }

  // Start new session
  room.isSessionActive = true;
  room.recentSessionStart = startTime;
  room.duration = duration;
  room.roomStatus = "active";

  await room.save();

  return {
    isNewSession: true,
    sessionStart: room.recentSessionStart,
    duration: room.duration,
    roomStatus: room.roomStatus,
  };
}

/**
 * End the currently active session for a room.
 * Persists completed session records for all participants and
 * updates the room lifecycle state in the database.
 *
 * @param {string} roomId - Unique room identifier.
 * @returns {Promise<void>}
 * @throws {Error} If no active session exists for the room.
 */

// MARK: endSession
export async function endSession(roomId, endTime) {

  // Find active room session
  const room = await Room.findOne({
    _id: roomId,
    isSessionActive: true,
  });

  if (!room) throw new Error("No active session found for this room");

  const rm = getRoomIfExists(roomId);
  if (!rm) throw new Error("Room not in memory");

  // Persist session per participant
  for (const [userId] of rm.participants) {

    const startTime = Math.max(new Date(room.recentSessionStart).getTime(), new Date(rm.participants.get(userId).joinedAt).getTime());

    const actualDuration = Math.floor(
      (endTime - startTime) / 1000
    );

    const session = await Session.create({
      userId,
      roomId,
      startTime,
      endTime,
      duration: actualDuration,
      status: "completed",
    });

    room.sessionIds.push(session._id);
  }
  room.isSessionActive = false;
  room.roomStatus = "ended";
  room.participants = Array.from(rm.participants.entries()).map(
    ([uid, p]) => ({
      userId: uid,
      userName: p.userName,
      joinedAt: p.joinedAt,
    })
  );

  await room.save();
}

/**
 * Generate a plain-serializable snapshot of all active rooms.
 * Used to synchronize clients on join, refresh, or reconnect.
 * Snapshot reflects identity-level state (users, sessions),
 * not socket-level implementation details.
 *
 * @param {Object} [options]
 * @param {boolean} [options.includeParticipants=false] -
 *   Whether to include full participant identity details.
 * @returns {Array<[string, Object]>} Snapshot of rooms keyed by roomId.
 */

// MARK: getSnapShot
export function getSnapshot({ includeParticipants = false } = {}) {
  const out = [];

  for (const [roomId, room] of rooms.entries()) {
    let participants;

    if (includeParticipants) {
      // full participant list
      participants = Array.from(room.participants.entries()).map(
        ([userId, p]) => ({
          userId,
          userName: p.userName,
        })
      );
    } else {
      // minimal snapshot
      participants = {
        count: room.participants.size,
      };
    }

    out.push([
      roomId,
      {
        roomName: room.roomName,
        participants,
        participantsCount: room.participants.size,

        // session state
        isSessionActive: !!room.isSessionActive,
        sessionStart: room.sessionStart ?? null,
        duration: room.duration ?? null,

        // ownership / lifecycle
        ownerId: room.owner.ownerId ?? null,
        roomStatus: room.roomStatus,
      },
    ]);
  }

  return out;
}
