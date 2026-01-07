import dotenv from 'dotenv'
import {createServer} from "http";

import app from "./app.js";
import connectDB from './config/db.js';
import roomSocketHandler from "./sockets/roomSocket.js";
import socketServer from './config/socket.js';

dotenv.config();

const port = process.env.port || 5000;  

connectDB();

const server = app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

const io = socketServer(server);

roomSocketHandler(io);