import express from "express";
import {
    getSecteurs,
    createSecteur,
    getAllSecteurs,
    deleteSecteur
    
} from "../controllers/secteurs.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ

router.get("/:cityId", getSecteurs);
router.get("/get/all", getAllSecteurs);
router.post("/add/new", verifyToken, createSecteur);
router.delete('/delete/:id',verifyToken, deleteSecteur);



export default router;