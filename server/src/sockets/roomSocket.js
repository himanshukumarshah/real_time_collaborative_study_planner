import {
    getRoomIfExists,
    getUserIfExists,
    addParticipantToRoom,
    removeUserFromRoom,
    startSession,
    endSession,
} from "./roomStore.js";
import { socketMiddelware } from "../middlewares/socketMiddleware.js";

/**
 * Room socket handler
 *
 * Responsibilities:
 *  - Authenticate socket handshake using JWT
 *  - Handle: join-room, leave-room, start-session, end-session
 *  - Maintain timers on the room object returned by getOrCreateRoom()
 *  - Broadcast presence-update to room participants
 *  - Broadcast room-updated / room-closed globally (for JoinRoom list)
 *  - Persist Session documents when a session ends
 */

export default function roomSocketHandler(io) {

    io.use(socketMiddelware); // Handshake auth middleware

    io.on("connection", (socket) => {

        const userId = socket.user?.id;
        let userName;
        if (!userId) {
            socket.disconnect(true);
            return;
        }

        // Helper to broadcast a room-updated event (summary) to all clients
        const broadcastRoomUpdated = (roomId) => {
            const room = getRoomIfExists(roomId);
            if (!room) {
                io.emit("room-closed", { roomId });
                return;
            }
            const participantsCount = room.participants ? room.participants.size : 0;

            io.emit("room-updated", {
                roomId,
                roomName: room.roomName,
                participantsCount,
                isSessionActive: !!room.isSessionActive,
                sessionStart: room.sessionStart ?? null,
                duration: Math.floor(room.duration / 1000) ?? null,
                ownerId: room.owner.ownerId ?? null,
            });
        };

        // MARK: JOIN ROOM
        socket.on("join-room", async (payload, ack) => {
            try {
                const { roomId, name } = payload || {};
                if (!roomId) return ack?.({ status: 400, message: "roomId required" });

                userName = name;
                socket.join(roomId);

                let room;
                try {
                    room = await addParticipantToRoom(io, roomId, userId, name, socket.id);
                } catch (e) {
                    return ack?.({ status: 404, message: "Room does not exist" });
                }

                const users = Array.from(room.participants.entries()).map(
                    ([uid, p]) => ({
                        userId: uid,
                        name: p.userName,
                    })
                );

                io.to(roomId).emit("presence-update", {
                    users, 
                    ownerId: room.owner.ownerId, 
                    isOwnerTemp: room.owner.tempOwner, 
                    userUpdate: { userName, userId, state: 'join'},
                });
                
                broadcastRoomUpdated(roomId);

                // sync running session to joining client
                if (room.isSessionActive) {
                    socket.emit("session-sync", {
                        startTime: room.sessionStart,
                        duration: Math.floor(room.duration / 1000),
                    });
                }

                return ack?.({ status: 200, message: "joined", roomName: room.roomName });
            } catch (err) {
                console.error("join-room error", err);
                return ack?.({ status: 500 });
            }
        });


        // MARK: LEAVE ROOM
        socket.on("leave-room", (payload, ack) => {
            try {
                const { roomId } = payload || {};
                if (!roomId) return ack?.({ status: 400 });

                removeUserFromRoom(io, userId, 'leave-room');
                socket.leave(roomId);

                const room = getRoomIfExists(roomId);
                if (room) {
                    const users = Array.from(room.participants.entries()).map(
                        ([uid, p]) => ({
                            userId: uid,
                            name: p.userName,
                        })
                    );

                    io.to(roomId).emit("presence-update", { 
                        users, 
                        ownerId: room.owner.ownerId, 
                        isOwnerTemp: room.owner.tempOwner,
                        userUpdate: { userName, userId, state: 'left'},
                    });
                    broadcastRoomUpdated(roomId);
                } else {
                    io.emit("room-closed", { roomId });
                }

                return ack?.({ status: 200 });
            } catch (err) {
                console.error("leave-room error", err);
                return ack?.({ status: 500 });
            }
        });

        // MARK: DISCONNECT
        socket.on("disconnect", () => {
            try {
                const user = getUserIfExists(userId);
                if (!user) return;

                const roomId = user.roomId;
                removeUserFromRoom(io, userId, 'disconnect');

                const room = getRoomIfExists(roomId);
                if (!room) {
                    io.emit("room-closed", { roomId });
                    return;
                }

                const users = Array.from(room.participants.entries()).map(
                    ([uid, p]) => ({
                        userId: uid,
                        name: p.userName,
                    })
                );

                io.to(roomId).emit("presence-update", { 
                    users, 
                    ownerId: room.owner.ownerId, 
                    isOwnerTemp: room.owner.tempOwner, 
                    userUpdate: { userName, userId, state: 'left'},
                });

                broadcastRoomUpdated(roomId);

            } catch (err) {
                console.error("disconnect cleanup error", err);
            }
        });

        // MARK: START SESSION
        socket.on("start-session", async (payload, ack) => {
            try {
                const { roomId, durationSeconds } = payload || {};
                if (!roomId || !durationSeconds) {
                    return ack?.({ status: 400 });
                }

                const startTime = Date.now();

                const result = await startSession(
                    roomId,
                    startTime,
                    durationSeconds * 1000
                );

                if (!result.isNewSession) {
                    return ack?.({ status: 409, message: "Session already running" });
                }

                const room = getRoomIfExists(roomId);
                room.isSessionActive = true;
                room.sessionStart = result.sessionStart;
                room.duration = result.duration;
                room.roomStatus = "active";


                io.to(roomId).emit("session-started", {
                    startTime: result.sessionStart,
                    duration: Math.floor(result.duration / 1000),
                });

                broadcastRoomUpdated(roomId);
                return ack?.({ status: 200 });

            } catch (err) {
                console.error("start-session error", err);
                return ack?.({ status: 500 });
            }
        });

        // MARK: END SESSION
        socket.on("end-session", async (payload, ack) => {
            try {
                const { roomId, endTime } = payload || {};
                if (!roomId) return ack?.({ status: 400 });

                const room = getRoomIfExists(roomId);
                if (!room || !room.isSessionActive) {
                    return ack?.({ status: 400, message: "No active session" });
                }

                room.isSessionActive = false;
                room.roomStatus = "ended";

                const duration = endTime - room.sessionStart;

                await endSession(roomId, endTime);

                io.to(roomId).emit("session-ended", {
                    startTime: room.sessionStart,
                    endTime,
                    duration: Math.floor(duration / 1000),
                });

                broadcastRoomUpdated(roomId);

                return ack?.({ status: 200 });

            } catch (err) {
                console.error("end-session error", err);
                return ack?.({ status: 500 });
            }
        });
    });
}