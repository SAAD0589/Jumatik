import Subcategory from "../models/Subcategory.js";

export const getSubcategories = async (req, res) => {
  const { categoryId } = req.params; 

  try {
    const subcategories = await Subcategory.find({ categoryId: categoryId }); 
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllSubcategories = async (req, res) => {

  try {
    const searchQuery = req.query.name;

    // Define the query object
    const query = {};

    if (searchQuery) {
      // Use a regular expression to perform a case-insensitive search
      query.name = { $regex: new RegExp(searchQuery, 'i') };
    }

    // Perform the search query and return the filtered subcategories
    const subcategories = await Subcategory.find(query);
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const createSubcategory = async (req, res) => {
  try {
    const { name, label, categoryId } = req.body;
    const data = {
      name,
      categoryId,
      label
    };
    const subcategory = new Subcategory(data);
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}
export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

