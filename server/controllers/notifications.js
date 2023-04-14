
import Notification from "../models/Notification.js";

// Create a new notification
export const createNotification = async (req, res) => {
    const notif = new Notification(req.body);
    try {
      const newNotification = await notif.save();
      res.status(200).json(newNotification);
    } catch (err) {
      res.status(500).json(err);
    }

  };
  
  // Retrieve all notifications for a user
  export const getNotificationsForUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { type } = req.query;
  
      // build the query object based on the filter criteria
      const query = { recipient: userId };
      if (type) {
        query.type = type;
      }
  
      // execute the query and populate the sender field
      const notifications = await Notification.find(query)
       
        .sort('-createdAt')
        ;
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  export const getNotificationsForUserCount = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // get the count of new_follow notifications for the user
      const followCount = await Notification.countDocuments({
        recipient: userId,
        type: 'new_follower',
        read: false,
      });
  
      // get the count of new_ad notifications for the user
      const adCount = await Notification.countDocuments({
        recipient: userId,
        type: 'new_ad',
        read: false,
      });
  const count = followCount + adCount; 
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json(error);
    }
  };
  export const getMessagesForUserCount = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // get the count of new_follow notifications for the user
      const messageCount = await Notification.countDocuments({
        recipient: userId,
        type: 'new_message',
        read: false,
      });
  
    
 
      res.status(200).json({ messageCount });
    } catch (error) {
      res.status(500).json(error);
    }
  };
  export const markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findByIdAndUpdate(notificationId, { read: true },  { new: true });
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
  // // Mark a notification as read
  // const markNotificationAsRead = async (notificationId) => {
  //   const notification = await Notification.findByIdAndUpdate(
  //     notificationId,
  //     { read: true },
  //     { new: true },
  //   );
  //   return notification;
  // };
  
  // Delete a notification
  export const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
  };
