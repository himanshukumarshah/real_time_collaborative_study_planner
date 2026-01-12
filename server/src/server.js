import 'dotenv/config';

import app from "./app.js";
import connectDB from './config/db.js';
import roomSocketHandler from "./sockets/roomSocket.js";
import socketServer from './config/socket.js';

const port = process.env.port || 5000;  

connectDB();

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const io = socketServer(server);

// server health
app.get("/health", (req, res) => {
    res.send("OK");
});

roomSocketHandler(io);