import express from "express";
import { getUserRooms, getUserSessions,  } from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/sessions", protect, getUserSessions);
router.get("/rooms", protect, getUserRooms);

export default router;