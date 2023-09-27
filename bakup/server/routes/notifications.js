import express from "express";
import {
    createNotification,
    getNotificationsForUser,
    markNotificationAsRead,
    deleteNotification,
    getNotificationsForUserCount,
    getMessagesForUserCount
} from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// MEW CONV

router.post("/", verifyToken, createNotification);

//get conv of a user

router.get("/:userId", verifyToken, getNotificationsForUser);
router.get("/count/:userId", verifyToken, getNotificationsForUserCount);
router.get("/messages/:userId", verifyToken, getMessagesForUserCount);
router.put("/:notificationId", verifyToken, markNotificationAsRead);
router.put("/delete/:notificationId", verifyToken, deleteNotification);

// get conv includes two userId

export default router;