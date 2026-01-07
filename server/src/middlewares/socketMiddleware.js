import jwt from "jsonwebtoken";

export const socketMiddelware = (socket, next) => {
    // Handshake auth middleware (expects token in handshake.auth.token)
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = { id: decoded.userId }; 

        return next();
    } catch (err) {
        return next(new Error("Unauthorized"));
    }
}