import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js"

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/room", roomRoutes);
app.use("/user", userRoutes);

export default app;
