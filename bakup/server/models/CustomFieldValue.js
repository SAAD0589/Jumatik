import mongoose from "mongoose";
const CustomFieldValueSchema = new mongoose.Schema({
    ad_id: {
        type: String,
       
    },
    field_id: {
        type: String,
       
    },
    field_name: {
        type: String,
       
    },

    value: {
        type: String,
       
    },

}, { timestamps: true });

const CustomFieldValue = mongoose.model("CustomFieldValue", CustomFieldValueSchema);
export default CustomFieldValue;