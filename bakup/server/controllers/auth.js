import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/email.js";
import passport from "passport";
import FacebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth20";
import crypto from "crypto";

// REGISTER USER
export const register = async(req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            passwordVerification,
            address,
            friends,
            isAdmin,
            ProPart,
            UserType,
            profilePicture,
        } = req.body;
        if (password !== passwordVerification) {
            return res
                .status(400)
                .json({ msg: "Les mots de passe ne correspondent pas" }); // return error message if passwords do not match
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.findOne({ email });
        if (user)
            return res
                .status(400)
                .json({ msg: "Cette adresse email existe veuillez vous connectez" });
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: passwordHash,
            passwordVerification: passwordHash,
            address,
            friends,
            isAdmin: false,
            ProPart,
            UserType,
            profilePicture,
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const confirmationUrl = `${process.env.APP_URL}/#/register/confirm/${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: savedUser.email,
            subject: `Confirmation de l'adresse email`,
            html: `
      <p>Bonjour,</p>
      <p>Merci de cliquer sur le lien ci-dessous pour confirmer votre adresse email :</p>
      <p><a href="${confirmationUrl}" style="border-radius:15px;background-color:#008CBA;color:#ffffff;display:inline-block;font-size:16px;padding:10px 20px;text-decoration:none;">Confirmer</a></p>
      <p>Cordialement,</p>
      <p>L'équipe de support</p>
      `,
        };

        const result = await sendEmail(mailOptions);



        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const confirmEmail = async(req, res) => {
    try {
        const token = req.params.id;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await User.findById(userId);


        if (!user) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({ message: "Email confirmed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// LOGGING IN
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ msg: "Utilisateur introuvable. " });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Mot de passe incorrecte" });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                msg: "Confirmez votre adresse mail pour continuer",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "Utilisateur introuvable" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure

        await user.save();

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Réinitialiser votre mot de passe",
            html: `
          <p>Bonjour ${user.firstName},</p>
          <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
          <a href="${process.env.APP_URL}/#/register/reset-password/${token}" style="background-color:#008CBA;color:#ffffff;display:inline-block;font-size:16px;padding:10px 20px;text-decoration:none;">Réinitialiser</a>
          <p>Si vous n'avez pas fait cette demande, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.</p>
        `,
        };

        await sendEmail(mailOptions);

        res.status(200).json({ msg: "E-mail envoyé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur");
    }
};

export const resetPassword = async(req, res) => {
    const { password } = req.body;
    const { token } = req.params;


    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Password Reset Confirmation",
            html: `
        <p>Bonjour ${user.firstName},</p>
<p>Votre mot de passe a été réinitialisé avec succès.</p>
<p> Support JUMATIK </p>
      `,
        };

        await sendEmail(mailOptions);

        res.status(200).json({ msg: "Password reset successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};