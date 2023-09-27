import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: String ,
  sender: String,
  message: String,
  type: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;