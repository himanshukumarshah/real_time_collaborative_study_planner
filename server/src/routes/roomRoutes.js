import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getActiveRooms, createRoom } from "../controllers/roomControllers.js";

const router = express.Router();

router.get("/active", protect, getActiveRooms);
router.post("/create", protect, createRoom);

export default router;