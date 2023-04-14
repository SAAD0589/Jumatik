import express from "express";
import {
    createCustomField,
    getAllCustomFields,
    getCustomField,
    deleteCustomField,
    updateCustomField,
    getCustomFieldByCategory
    
} from "../controllers/customFields.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/get/all", getAllCustomFields);
router.get("/get/:id", getCustomField);
router.get("/get/category/:category", getCustomFieldByCategory);
router.post("/add/new", verifyToken, createCustomField);
router.delete('/delete/:id',verifyToken, deleteCustomField);
router.put('/update/:id',verifyToken, updateCustomField);



export default router;