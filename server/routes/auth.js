import express from "express";
import { login, register, confirmEmail, forgotPassword, resetPassword } from "../controllers/auth.js";
import { googleCallback, loginWithGoogle, facebookCallback } from "../controllers/oauth.js";
import passport from 'passport';
import cors from "cors";
const router = express.Router();
router.post("/login", login);
router.post('/confirm/:id', confirmEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// Log in with Google
router.get('/oauth/google', loginWithGoogle);
router.get('/oauth/google/callback', googleCallback);
router.post('/oauth/facebook/callback', facebookCallback);
router.post('/oauth/google/callback', googleCallback);


export default router;
