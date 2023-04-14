import express from "express";
import {
    getFeedValideAds,
    getUserAds,
    likeAd,
    getUserAdsCount,
    getAd,
    getLike,
    searchAds,
    getAdsByCategory,
    getAdsCountByCategory,
    getAdsCount,
    getUserAllAds,
    getAllAds,
    validerAd,
    annulerAd,
    deleteAd
} from "../controllers/ads.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/:id/like", verifyToken, function(req, res) {
    getLike(req, res); // <-- sending both req and res to the function
});
router.get("/category/:id", getAdsByCategory);
router.get("/category/count/:id", getAdsCountByCategory);
router.get("/count/ads", getAdsCount);
router.get('/search', searchAds);
router.get("/", getFeedValideAds);
router.get("/ad/:id", function(req, res) {
    getAd(req, res); // <-- sending both req and res to the function
});
router.get("/:userId", function(req, res) {
    getUserAds(req, res); // <-- sending both req and res to the function
});
router.get("/all/:userId", verifyToken, function(req, res) {
    getUserAllAds(req, res); // <-- sending both req and res to the function
});
router.get("/admin/allAds", verifyToken, function(req, res) {
    getAllAds(req, res); // <-- sending both req and res to the function
});
router.get("/:userId/count", function(req, res) {
    getUserAdsCount(req, res);
});
// UPDATE

router.patch("/:id/like", verifyToken, function(req, res) {
    likeAd(req, res); // <-- sending both req and res to the function
});
router.patch("/:id/valider", verifyToken, function(req, res) {
    validerAd(req, res); // <-- sending both req and res to the function
});
router.patch("/:id/annuler", verifyToken, function(req, res) {
    annulerAd(req, res); // <-- sending both req and res to the function
});

//DELETE

router.delete("/ad/delete/:id",verifyToken, deleteAd);



export default router;