import express from "express";
import {
    getCities,
    getAllCities,
    getCityById
    
} from "../controllers/cities.js";

const router = express.Router();

// READ

router.get("/:regionId", getCities);
router.get("/", getAllCities);
router.get("/get/:id", getCityById);


export default router;