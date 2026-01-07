import { Server } from "socket.io";

const socketServer = (server) => {
  const s = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  console.log("Socket.io connected.");
  return s;
};

export default socketServer;