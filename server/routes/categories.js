import express from "express";
import {
    getCategories,
    getCategoryById
    
} from "../controllers/categories.js";

const router = express.Router();

// READ

router.get("/", getCategories);
router.get("/category/:id", getCategoryById);

export default router;