import express from "express";
import {
    createCustomFieldValue,
    getAllCustomFieldValues,
    getCustomFieldValue,
    deleteCustomFieldValue,
    updateCustomFieldValue,
    getCustomFieldValueByAd
    
} from "../controllers/customFieldValues.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/get/all", getAllCustomFieldValues);
router.get("/get/:id", getCustomFieldValue);
router.get("/get/ad/:adId", getCustomFieldValueByAd);
router.post("/add/new", verifyToken, createCustomFieldValue);
router.delete('/delete/:id',verifyToken, deleteCustomFieldValue);
router.put('/update/:id',verifyToken, updateCustomFieldValue);



export default router;