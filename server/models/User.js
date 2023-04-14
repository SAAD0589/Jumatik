import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        max: 12,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    passwordVerification: {
        type: String,
        required: true,
        min: 5,
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    favorites: {
        type: Array,
        default: [],
    },
    address: {
        type: String,
        required: true,
        min: 5,
        max: 300,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    ProPart: {
        type: String,
        required: true,
    },
   
    UserType: {
        type: Array,
        default: "",
        required: true,
    },
    
    profilePicture: {
        type: String,
        default: "",
    },
    
    isVerified: {
        type: Boolean,
        default: false,
      },
      resetPasswordToken : {
        type: String,
      },
      resetPasswordExpires : {
        type: Date,
      },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;