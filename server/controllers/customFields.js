import CustomField from "../models/CustomField.js";

// READ
export const getAllCustomFields = async (req, res) => {
  try {
    const searchQuery = req.query.name;

    // Define the query object
    const query = {};

    if (searchQuery) {
      // Use a regular expression to perform a case-insensitive search
      query.name = { $regex: new RegExp(searchQuery, 'i') };
    }

    // Perform the search query and return the filtered subcategories
    const customFields = await CustomField.find(query);
    res.json(customFields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getCustomField = async (req, res) => {
  const { id } = req.params;

  try {
    const customField = await CustomField.findById(id);
    if (!customField) {
      return res.status(404).json({ message: "customField not found" });
    }
    res.json(customField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCustomFieldByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const customField = await CustomField.find({category: category, subcategory: ''});
    if (!customField) {
      return res.status(404).json({ message: "customField not found" });
    }
    res.json(customField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCustomFieldBySubCategory = async (req, res) => {
  const { subcategory } = req.params;

  try {
    const customField = await CustomField.find({subcategory: subcategory});
    if (!customField) {
      return res.status(404).json({ message: "customField not found" });
    }
    res.json(customField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD
export const createCustomField = async (req, res) => {
  try {
    const { name, category,subcategory, type, options } = req.body;
    const data = {
      name,
      category,
      subcategory,
      type,
      options,
    };
    const customField = new CustomField(data);
    await customField.save();
    res.status(201).json(customField);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
// DELETE
export const deleteCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const customField = await CustomField.findByIdAndDelete(id);
    if (!customField) {
      return res.status(404).json({ message: "customField not found" });
    }
    res.json(customField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE
export const updateCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, type, options,subcategory } = req.body;
    const customField = await CustomField.findById(id);
    if (!customField) {
      return res.status(404).json({ message: "customField not found" });
    }
    if (name) customField.name = name;
    if (category) customField.category = category;
    if (subcategory) customField.subcategory = subcategory;
    if (type) customField.type = type;
    if (options) customField.options = options;
    const savedCustomField = await customField.save();
    res.json(savedCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
