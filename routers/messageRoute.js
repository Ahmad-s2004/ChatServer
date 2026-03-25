import express from "express";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import auth from "../middlewares/auth.js"

const messageRouter = express.Router();

messageRouter.post("/send", auth, sendMessage);
messageRouter.get("/:chatId", auth, getMessage);

export default messageRouter;