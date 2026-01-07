import { getOrCreateRoom, getSnapshot } from "../sockets/roomStore.js";
import Room from "../models/room.js";

// Get a snapshot of all active rooms (memory-only).
export const getActiveRooms = (req, res) => {
  try {
    const snapshot = getSnapshot({ includeParticipants: false });
    return res.status(200).json(snapshot);
  } catch (err) {
    console.error("getActiveRooms error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a room in server memory.
export const createRoom = (req, res) => {
  try {
    const { roomId, roomName } = req.body;

    if (!roomId || !roomName) {
      return res.status(400).json({ message: "roomId and roomName required" });
    }

    getOrCreateRoom(roomId, roomName);

    return res.status(201).json({
      message: "Room created in memory",
      roomId,
    });
  } catch (err) {
    console.error("createRoom error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};