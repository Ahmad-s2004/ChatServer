import express from "express";
import http from "http";
import dotenv from 'dotenv';
import dbconnection from "./config/db.js";
import authRouter from "./routers/authRoute.js";
import userRouter from "./routers/userRoute.js";
import messageRouter from "./routers/messageRoute.js";
import cookieParser from "cookie-parser";
import { init } from "./utils/socket.js";
import cors from "cors";
import path from 'path';

dotenv.config({
    path: path.resolve("./config/.env"),
});
dbconnection();

const app = express();
const server = http.createServer(app);

const io = init(server);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://chat-app-your-frontend-vercel-url.vercel.app" 
];
  
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            if(origin.includes("localhost")) return callback(null, true);
            return callback(new Error('CORS Policy violation'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

export const onlineUsers = new Map(); 

io.on("connection", (socket) => {
    let userId = socket.handshake.query.userId;
    
    const registerUserRoom = (id) => {
        if (id && id !== "undefined") {
            const cleanId = id.toString().trim();
            socket.join(cleanId);
            onlineUsers.set(cleanId, socket.id);
            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
        }
    };

    if (userId) {
        registerUserRoom(userId);
    }

    socket.on("join_room", (id) => {
        registerUserRoom(id);
    });

    socket.on("send_message", (data) => {
        const { receiverId, content, senderId, chatId, _id, createdAt } = data;

        if (!receiverId || !senderId) return;

        const cleanReceiverId = receiverId.toString().trim();
        const cleanSenderId = senderId.toString().trim();
        const messagePacket = {
            _id: _id || new Date().getTime().toString(),
            chatId: chatId,
            senderId: cleanSenderId,
            content: content,
            createdAt: createdAt || new Date().toISOString()
        };

        io.to(cleanReceiverId).emit("receive_message", messagePacket);
    });

    socket.on("disconnect", () => {
        for (let [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
                break;
            }
        }
    });
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 4550;
server.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
});

export { io };