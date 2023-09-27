import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 10,
    max: 80,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  label: {
    type: String,
    required: true,
    min: 10,
    max: 80,
  },



}, { timestamps: true });

const Subcategory = mongoose.model("Subcategory", SubcategorySchema);

export default Subcategory;
