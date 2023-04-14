import mongoose from "mongoose";
const CitySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        
    },
    name: {
        type: String,
        required: true,
       
    },
    region: {
        type: String,
       
    },
},);

const City = mongoose.model("City", CitySchema);
export default City;