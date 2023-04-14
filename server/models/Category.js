import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        min: 10,
        max: 80,
    },
    name: {
        type: String,
        required: true,
        min: 10,
        max: 80,
    },
    description: {
        type: String,
        min: 5,
        max: 300,
    },
    CatPicture: {
        type: String,
        default: "",
    },
}, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema);
export default Category;