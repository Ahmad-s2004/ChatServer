import { Message } from "../models/index.js" 
import { getIO } from "../utils/socket.js"  

let sendMessage = async (req, res) => {
    try {
        const { content, chatId, receiverId } = req.body  
        
        if (!content || !chatId) {
            return res.status(400).json({ success: false, message: "All fields required" }) 
        }
        const senderId = req.user._id 
        let newMessage = await Message.create({
            chatId,
            senderId,
            content
        }) 

        newMessage = await newMessage.populate("senderId", "name") 
        if (!newMessage) {
            return res.status(500).json({ success: false, message: "Internal server error" }) 
        }
        const io = getIO() 
        io.to(chatId).emit("receive_message", newMessage) 
        return res.status(201).json({ success: true, message: "Message sent", newMessage }) 

    } catch (error) {
        console.log(error) 
        return res.status(500).json({ success: false, message: "Internal server error" }) 
    }
} 

let getMessage = async (req, res) => {
    try {
        const { chatId } = req.params 
        if (!chatId) {
            return res.status(400).json({ success: false, message: "Chat ID is required " }) 
        }
        const messages = await Message.find({ chatId })
            .populate("senderId", "name")
            .sort({ createdAt: 1 }) 
        return res.status(200).json({
            success: true,
            messages
        }) 

    } catch (error) {
        console.log(error) 
        return res.status(500).json({ success: false, message: "Internal server error" }) 
    }
} 

export {
    sendMessage,
    getMessage
} 