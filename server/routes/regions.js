import express from "express";
import {
    getRegions,
    
} from "../controllers/regions.js";

const router = express.Router();

// READ

router.get("/", getRegions);

export default router;