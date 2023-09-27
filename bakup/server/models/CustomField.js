import mongoose from "mongoose";
const CustomFieldSchema = new mongoose.Schema({
    name: {
        type: String,
       
    },
    category: {
        type: String,
       
    },
    subcategory: {
        type: String,
       
    },

    type: {
        type: String,
       
    },
    options: {
        type: Array,
        default: [],
       
    },
}, { timestamps: true });

const CustomField = mongoose.model("CustomField", CustomFieldSchema);
export default CustomField;