import Category from "../models/Category.js";


export const getCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getCategoryById = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({_id : id});
        res.status(200).json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
