import CustomField from "../models/CustomField.js";

// READ
export const getAllCustomFields = async (req, res) => {
  try {
    const customFields = await CustomField.find();
    res.status(200).json(customFields);
  } catch (error) {
    res.status(404).json({ message: error.message });
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
    const customField = await CustomField.find({category: category});
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
    const { name, category, type, options } = req.body;
    const data = {
      name,
      category,
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
    const { name, category, type, options } = req.body;
    const customField = await CustomField.findById(id);
    if (!customField) {
      return res.status(404).json({ message: "customField not found" });
    }
    if (name) customField.name = name;
    if (category) customField.category = category;
    if (type) customField.type = type;
    if (options) customField.options = options;
    const savedCustomField = await customField.save();
    res.json(savedCustomField);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
