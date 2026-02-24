import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

const findExistingChat = async (userId1, userId2) => {
  return await Chat.findOne({
    isGroup: false,
    members: { $all: [userId1, userId2] }
  }).populate("members", "-password");
};

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId required" });

    let chat = await findExistingChat(req.user._id, userId);

    if (chat) {
      return res.status(200).json({ success: true, data: chat });
    }

    chat = await Chat.create({
      chatName: "sender",
      isGroup: false,
      members: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(chat._id).populate("members", "-password");
    res.status(201).json({ success: true, data: fullChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: { $in: [req.user._id] } })
      .populate("members", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name || !members || members.length < 2)
      return res.status(400).json({ message: "Name and at least 2 members required" });

    const allMembers = [...members, req.user._id];

    const groupChat = await Chat.create({
      chatName: name,
      isGroup: true,
      members: allMembers,
      groupAdmin: req.user._id,
    });

    const fullGroup = await Chat.findById(groupChat._id).populate("members", "-password");
    res.status(201).json({ success: true, data: fullGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { chatId, newName } = req.body;
    if (!chatId || !newName) return res.status(400).json({ message: "Invalid data" });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: newName },
      { new: true }
    ).populate("members", "-password");

    if (!updatedChat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) return res.status(400).json({ message: "Invalid data" });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { members: userId } },
      { new: true }
    ).populate("members", "-password");

    if (!updatedChat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) return res.status(400).json({ message: "Invalid data" });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { members: userId } },
      { new: true }
    ).populate("members", "-password");

    if (!updatedChat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};