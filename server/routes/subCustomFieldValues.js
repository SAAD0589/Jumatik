import express from "express";
import {
    createSubCustomFieldValue,
    getAllSubCustomFieldValues,
    getSubCustomFieldValue,
    deleteSubCustomFieldValue,
    updateSubCustomFieldValue,
    getSubCustomFieldValueByAd
    
} from "../controllers/subCustomFieldValues.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/get/all", getAllSubCustomFieldValues);
router.get("/get/:id", getSubCustomFieldValue);
router.get("/get/ad/:adId", getSubCustomFieldValueByAd);
router.post("/add/new", verifyToken, createSubCustomFieldValue);
router.delete('/delete/:id',verifyToken, deleteSubCustomFieldValue);
router.put('/update/:id',verifyToken, updateSubCustomFieldValue);



export default router;