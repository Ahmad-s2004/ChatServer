import express from "express";
import http from "http"; // 1. HTTP module import karein
import dotenv from 'dotenv';
import dbconnection from "./config/db.js";
import authRouter from "./routers/authRoute.js"; 
import userRouter from "./routers/userRoute.js";
import messageRouter from "./routers/messageRoute.js";
import cookieParser from "cookie-parser";
import { init } from "./utils/socket.js";

dotenv.config();
dbconnection();

const app = express();
const server = http.createServer(app);
const io = init(server);

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(userId);
        console.log(`User Connected: ${userId}`);
    }

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 4550;
server.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
});