import { Server } from "socket.io";

let io;

export const init = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            //  Wildcard "*" ko hata kar exact domains de diye
            origin: ["http://localhost:5173", "https://chat-client-alpha-nine.vercel.app"],
            methods: ["GET", "POST"],
            credentials: true // 👈 Yeh sab se zaroori line hai jo missing thi!
        }
    });
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};