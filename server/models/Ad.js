import mongoose from "mongoose";
const AdSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: false,
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    phone: {
        type: String,
        required: true,
        max: 12,
    },
    categoryName: {
        type: String,
        required: false,
    },
    categoryLabel: {
        type: String,
    },
    subcategoryName: {
        type: String,
        required: false,
    },
    subcategoryLabel: {
        type: String,
    },
    region: {
        type: String,
        required: false,        
    },
    city: {
        type: String,
        required: false,        
    },
    secteur: {
        type: String,
        required: false,        
    },

    name: {
        type: String,
        text: true,
        required: false,
        min: 10,
        max: 80,
    },
    price: {
        type: String,
        required: true,
        min: 10,
        max: 80,
    },

    description: {
        type: String,
        text: true,
        required: false,
        min: 5,
        max: 300,
    },
    adPictures: {
        type: Array,
        default: [{}],
    },
    userProfilePicture: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "en cours de validation",
    },
    likes: {
        type: Map,
        of: Boolean,
    },
}, { timestamps: true });

const Ad = mongoose.model("Ad", AdSchema);
export default Ad;