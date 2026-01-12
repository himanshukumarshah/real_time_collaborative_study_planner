import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {

    const { isAuthenticated } = useAuth();
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    // helper to create socket using latest token
    const getOrConnectSocket = () => {
        if (socketRef.current) return socketRef.current;

        const token = localStorage.getItem("token");
        if (!token) return;

        const socket = io(import.meta.env.VITE_API_URL, {
            auth: { token },
            autoConnect: true,
            transports: ["websocket"],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            console.log("Socket connected: ", socket.id);
        });

        socket.on("disconnect", (reason) => {
            setConnected(false);
            console.log("Socket disconnected: ", socket.id, reason);
        });

        // for debugging
        socket.on("connect_error", (err) => {
            console.warn("Socket connect error: ", err.message);
        });

        return socket;
    };

    // Socket connection
    useEffect(() => {
        if (!isAuthenticated) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        // authenticated → ensure socket exists
        getOrConnectSocket();

    }, [isAuthenticated]);


    // expose helper methods for components
    const joinRoom = (roomId, name, cb) => {
        const socket = socketRef.current;
        if (!socket) return cb?.({ status: 401, message: "No socket" });
        socket.emit("join-room", { roomId, name }, cb);
    };

    const leaveRoom = (roomId, cb) => {
        const socket = socketRef.current;
        if (!socket) return cb?.({ status: 401 });
        socket.emit("leave-room", { roomId }, cb);
    };

    const startSession = (roomId, durationSeconds, cb) => {
        const socket = socketRef.current;
        if (!socket) return cb?.({ status: 401 });
        socket.emit("start-session", { roomId, durationSeconds }, cb);
    };

    const endSession = (roomId, endTime, cb) => {
        const socket = socketRef.current;
        if (!socket) return cb?.({ status: 401 });
        socket.emit("end-session", { roomId, endTime }, cb);
    };

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, connected, joinRoom, leaveRoom, startSession, endSession }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);