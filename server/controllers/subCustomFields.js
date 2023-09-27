import SubCustomField from "../models/SubCustomField.js";

// READ
export const getAllSubCustomFields = async (req, res) => {

  try {
    const searchQuery = req.query.name;

    // Define the query object
    const query = {};

    if (searchQuery) {
      // Use a regular expression to perform a case-insensitive search
      query.name = { $regex: new RegExp(searchQuery, 'i') };
    }

    // Perform the search query and return the filtered subcategories
    const customFields = await SubCustomField.find(query);
    res.json(customFields);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getSubCustomField = async (req, res) => {
  const { id } = req.params;

  try {
    const subCustomField = await SubCustomField.findById(id);
    if (!subCustomField) {
      return res.status(404).json({ message: "subCustomField not found" });
    }
    res.json(subCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSubCustomFieldByFieldId = async (req, res) => {
  const { customFieldId } = req.params;

  try {
    const subCustomField = await SubCustomField.find({customFieldId: customFieldId});
    if (!subCustomField) {
      return res.status(404).json({ message: "subCustomField not found" });
    }
    res.json(subCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSubCustomFieldByFieldValue = async (req, res) => {
  const { customFieldValue, subcategory } = req.params;

  try {
    const subCustomField = await SubCustomField.find({customFieldValue: customFieldValue, subcategory: subcategory });
    if (!subCustomField) {
      return res.status(404).json({ message: "subCustomField not found" });
    }
    res.json(subCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD
export const createSubCustomField = async (req, res) => {
  try {
    const { name, customFieldId,customFieldValue, category,subcategory, type, options } = req.body;
    const data = {
      name,
      customFieldId,
      customFieldValue,
      category,
      subcategory,
      type,
      options,
    };
    const subCustomField = new SubCustomField(data);
    await subCustomField.save();
    res.status(201).json(subCustomField);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
// DELETE
export const deleteSubCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const subCustomField = await SubCustomField.findByIdAndDelete(id);
    if (!subCustomField) {
      return res.status(404).json({ message: "subCustomField not found" });
    }
    res.json(subCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE
export const updateSubCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, type, options,subcategory,customFieldId,customFieldValue } = req.body;
    const subCustomField = await SubCustomField.findById(id);
    if (!subCustomField) {
      return res.status(404).json({ message: "subCustomField not found" });
    }
    if (name) subCustomField.name = name;
    if (customFieldId) subCustomField.customFieldId = customFieldId;
    if (customFieldValue) subCustomField.customFieldValue = customFieldValue;
    if (category) subCustomField.category = category;
    if (subcategory) subCustomField.subcategory = subcategory;
    if (type) subCustomField.type = type;
    if (options) subCustomField.options = options;
    const savedSubCustomField = await subCustomField.save();
    res.json(savedSubCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
