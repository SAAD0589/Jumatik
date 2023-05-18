import mongoose from "mongoose";
const SubCustomFieldValueSchema = new mongoose.Schema({
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

const SubCustomFieldValue = mongoose.model("SubCustomFieldValue", SubCustomFieldValueSchema);
export default SubCustomFieldValue;