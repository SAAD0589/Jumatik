import { OAuth2Client } from 'google-auth-library';
import  ClientOAuth2  from 'client-oauth2';
import { Capacitor } from '@capacitor/core';
import { Plugins } from '@capacitor/core';

const { GoogleAuth } = Plugins;
import fetch from 'node-fetch';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from 'axios';
import crypto from "crypto";
const client = new OAuth2Client(
    "157748997984-fbpdo0bkfvv8t0cs9so42s1ghp35k6qs.apps.googleusercontent.com",
    "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",
    "postmessage"
);
const clientmobile = new OAuth2Client(
    "764637492527-i6nkvftt30q205ea50c8uo83okegjjok.apps.googleusercontent.com",
);
const facebookClient = new ClientOAuth2({
    clientId: '599879425305048',
    clientSecret: 'f1e92136ee7c56f2b44858e36a74cd6c',
    redirectUri: Capacitor.isNativePlatform() ? 'ma.jumatik://authorize' : 'http://localhost:3000/api/auth/facebook/callback',
  });

const generatePassword = () => {
    const length = 8;
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString("hex")
        .slice(0, length);
};
export const facebookCallback = async (req, res) => {
    const { code } = req.body;

  
    try {
      // Retrieve the access token using the authorization code
    
  
      // Retrieve the user's profile information using the access token
      const data = await axios
        .get(`https://graph.facebook.com/v12.0/me?fields=email,first_name,last_name,picture&access_token=${code}`)
        .then((res) => res.data);
  
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email: data.email });
  
      // If user already exists, update profile picture and return user
      if (existingUser) {
        existingUser.profilePicture = data.picture.data.url;
        existingUser.isVerified = true; // Facebook email is always verified
  
        await existingUser.save();
  
        // Create and sign a JWT token
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
  
        // Set the token and user data in the response
        res.status(200).json({ user: existingUser, token });
      } else {
        const password = generatePassword();
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
  
        // Otherwise, create new user
        const newUser = new User({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: '060000000',
          password: passwordHash,
          passwordVerification: passwordHash,
          address: 'Veuillez rentre votre adresse',
          isAdmin: false,
          ProPart: 'part',
          UserType: 'Vendre',
          profilePicture: data.picture.data.url,
          isVerified: true,
        });
  
        const savedUser = await newUser.save();
  
        // Create and sign a JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
  
        // Set the token and user data in the response
        res.status(200).json({ user: savedUser, token });
      }
    } catch (error) {
      console.error(error);
      res.redirect(`${process.env.APP_URL}#/auth/sign-in`);
    }
  };
export const loginWithGoogle = (req, res) => {
    const url = client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
        prompt: "consent",
    });

    res.redirect(url);
};

export const googleCallback = async (req, res) => {
  const { code, token } = req.body;

  try {
    let access_token, id_token, data;
    
    if (code) { // for web flow
      // Retrieve the access token using the authorization code
      const { tokens } = await client.getToken(code);
      const { access_token, id_token } = tokens;

      // Retrieve the user's profile information using the access token
      data = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      }).then(res => res.data);
    } else if (token) { // for mobile flow
      // Retrieve the user's profile information using the id token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '157748997984-fbpdo0bkfvv8t0cs9so42s1ghp35k6qs.apps.googleusercontent.com'
      });
      const payload = ticket.getPayload();
      access_token = token;
      id_token = token;
      data = {
        given_name: payload.given_name,
        family_name: payload.family_name,
        email: payload.email,
        picture: payload.picture,
        email_verified: payload.email_verified
      };
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: data.email });

    // If user already exists, update profile picture and return user
    if (existingUser) {
      existingUser.isVerified = data.email_verified;

      await existingUser.save();

      // Create and sign a JWT token
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

      // Set the token and user data in the response
      res.status(200).json({ user: existingUser, token });
    } else {
      const password = generatePassword();
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      // Otherwise, create new user
      const newUser = new User({
        firstName: data.given_name,
        lastName: data.family_name,
        email: data.email,
        phone: "060000000",
        password: passwordHash,
        passwordVerification: passwordHash,
        address: "Veuillez rentre votre adresse",
        isAdmin: false,
        ProPart: "part",
        UserType: "Vendre",
        profilePicture: data.picture,
        isVerified: true,
      });

      const savedUser = await newUser.save();

      // Create and sign a JWT token
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

      // Set the token and user data in the response
      res.status(200).json({ user: savedUser, token });
    }
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.APP_URL}#/auth/sign-in`);
  }
};

