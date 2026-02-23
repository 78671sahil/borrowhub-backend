 import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
 


 // ---------------- START CONVERSATION ----------------  
 export const startConversation = async (req, res) => {
  const { itemId, otherUserId } = req.body;

  const participants = [req.user._id.toString(), otherUserId.toString()].sort();

  const existing = await Conversation.findOne({
    item: itemId,
    participants: { $all: participants },
  });

  if (existing) return res.json(existing);

  const convo = await Conversation.create({
    item: itemId,
    participants,
  });

  res.json(convo);
};


// ---------------- GET MESSAGES ----------------
// export const getMessages = async (req, res) => {
//   const { conversationId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(conversationId)) {
//     return res.status(400).json({ message: "Invalid id" });
//   }

//   const messages = await Message.find({
//     conversation: conversationId,
//   }).sort({ createdAt: 1 });

//   res.json(messages);
// };

 // ---------------- GET CONVERSATIONS ----------------
//  export const getConversations = async (req, res) => {
//   const conversations = await Conversation.find({
//     participants: req.user._id,
//   })
//     .populate("participants", "_id name")
//     .populate("item", "title images")
//     .sort({ updatedAt: -1 });

//   res.json(conversations);
// };
 export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id }) //
      .populate("participants", "_id name")
      .populate("item", "title images")
      .sort({ updatedAt: -1 });

    const convosWithUnread = await Promise.all(conversations.map(async (convo) => {
      const unreadCount = await Message.countDocuments({
        conversation: convo._id,
        sender: { $ne: req.user._id },
        seen: false //
      });
      return { ...convo.toObject(), unreadCount };
    }));

    res.json(convosWithUnread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 

// ---------------- GET CONVERSATION BY ID ----------------
 export const getConversationById = async (req, res) => {
  const convo = await Conversation.findById(req.params.id)
    .populate("participants", "_id");

  if (!convo) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  res.json(convo);
};




export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const convo = await Conversation.findById(id);

    if (!convo) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // 🔒 security: user is participant?
    const isParticipant = convo.participants
      .map((p) => p.toString())
      .includes(userId);

    if (!isParticipant) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 1️⃣ delete all messages
    await Message.deleteMany({ conversation: id });

    // 2️⃣ delete conversation
    await Conversation.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



