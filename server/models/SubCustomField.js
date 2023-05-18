import mongoose from "mongoose";
const SubCustomFieldSchema = new mongoose.Schema({
    name: {
        type: String,
       
    },
    customFieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomField",
        required: true,
      },
    customFieldValue: {
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

const SubCustomField = mongoose.model("SubCustomField", SubCustomFieldSchema);
export default SubCustomField;