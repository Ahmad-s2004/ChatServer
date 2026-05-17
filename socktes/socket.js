import { Server } from "socket.io";

let io;

export const init = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173", 
                "https://chat-client-alpha-nine.vercel.app"
            ],
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        },
        pingTimeout: 60000, 
    });
    
    console.log("Socket.io initialized successfully.");
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized! Call init(server) first.");
    }
    return io;
};