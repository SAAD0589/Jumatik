import express from "express";
import {
    NewMessage,
    GetMessage
} from "../controllers/messages.js";
import { verifyToken } from "../middleware/auth.js";    

const router = express.Router();

// New message

router.post("/", verifyToken, NewMessage);

//get messages

router.get("/:conversationId",verifyToken, GetMessage );
  
  // get conv includes two userId
  
export default router; 