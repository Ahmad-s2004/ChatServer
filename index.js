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
import path from 'path'

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
    "https://chat-client-alpha-nine.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

export const onlineUsers = new Map(); 

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        socket.join(userId);
        onlineUsers.set(userId, socket.id);
        console.log(`User Connected: ${userId} with Socket: ${socket.id}`);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }

    socket.on("send_message", (data) => {
        const { receiverId, content, senderId, chatId, _id, createdAt } = data;

        console.log(`Message from ${senderId} id ${_id} chat.id ${chatId}  to ${receiverId}: ${content}`);

        if (receiverId) {
            io.to(receiverId).emit("receive_message", {
                _id,
                chatId,
                senderId,
                content,
                createdAt
            });
        }
    });

    socket.on("disconnect", () => {
        if (userId) {
            onlineUsers.delete(userId);
            console.log(`User Disconnected: ${userId}`);
            io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
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