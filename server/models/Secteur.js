import mongoose from "mongoose";
const SecteurSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
       
    },

    city: {
        type: String,
       
    },
},);

const Secteur = mongoose.model("Secteur", SecteurSchema);
export default Secteur;