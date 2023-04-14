import express from "express";
import {
    NewConv,
    getUsrConv,
    get2UsrsConv
} from "../controllers/conversations.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// MEW CONV

router.post("/", verifyToken, NewConv);

//get conv of a user

router.get("/:userId",verifyToken, function(req, res) {
    getUsrConv(req, res); // <-- sending both req and res to the function
} );
  
  // get conv includes two userId
  
router.get("/find/:firstUserId/:secondUserId", verifyToken, get2UsrsConv);
export default router;