import express from "express";
import {
    getSubcategories,
    createSubcategory,
    getAllSubcategories,
    deleteSubcategory
    
} from "../controllers/subcategories.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

// READ

router.get("/:categoryId", getSubcategories);
router.get("/",verifyToken, getAllSubcategories);
router.post("/add/new", verifyToken, createSubcategory);
router.delete('/delete/:id',verifyToken, deleteSubcategory);


export default router;