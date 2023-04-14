import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
    },
    conversationId: {
        type: String,
    },
    text: {
        type: String,
    },
    
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
export default Message;