import express from "express";
import {
    createSubCustomField,
    getAllSubCustomFields,
    getSubCustomField,
    deleteSubCustomField,
    updateSubCustomField,
    getSubCustomFieldByFieldId,
    getSubCustomFieldByFieldValue
    
    
} from "../controllers/subCustomFields.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/get/all", getAllSubCustomFields);
router.get("/get/:id", getSubCustomField);
router.get("/get/customField/:customFieldId", getSubCustomFieldByFieldId);
router.get("/get/customField/value/:customFieldValue/:subcategory", getSubCustomFieldByFieldValue);
router.post("/add/new", verifyToken, createSubCustomField);
router.delete('/delete/:id',verifyToken, deleteSubCustomField);
router.put('/update/:id',verifyToken, updateSubCustomField);



export default router;