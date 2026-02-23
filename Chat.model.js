import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    isGroup:{
        type: Boolean,
        default: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }],
    name:{
        type: String,
        required: true
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true
    }
},{timestamps: true});

export default mongoose.model("Chat", ChatSchema)