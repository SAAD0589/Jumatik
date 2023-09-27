import mongoose from "mongoose";
const RegionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        
    },
    region: {
        type: String,
       
    },
},);

const Region = mongoose.model("Region", RegionSchema);
export default Region;