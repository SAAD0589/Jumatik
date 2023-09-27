import express from "express";
import {
    getUser,
    getFollowings,
    getFollowers,
    follow,
    getUserIdEmail,
    updateUser,
    getUsers,
    deleteFollowings,
    deleteFollowers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/:id", function(req, res) {
    getUser(req, res); // <-- sending both req and res to the function
});
router.get("/admin/all", verifyToken,function(req, res) {
    getUsers(req, res); // <-- sending both req and res to the function
});

router.get("/", function(req, res) {
    getUserIdEmail(req, res); // <-- sending both req and res to the function
});
router.get("/:id/followers" , getFollowers);
router.get("/:id/following", getFollowings);

// UPDATE
// router.patch("/:id/:friendsId", verifyToken, addRemoveFriends);
router.patch("/follow/:id/:followedId", verifyToken, follow);
router.put("/delete/follower/:id/:followerId", verifyToken, deleteFollowers);
router.put("/delete/following/:id/:followingId", verifyToken, deleteFollowings);



export default router;