import SubCustomFieldValue from "../models/SubCustomFieldValue.js";

// READ
export const getAllSubCustomFieldValues = async (req, res) => {
  try {
    const subCustomFieldValues = await SubCustomFieldValue.find();
    res.status(200).json(subCustomFieldValues);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getSubCustomFieldValue = async (req, res) => {
  const { id } = req.params;

  try {
    const subCustomFieldValue = await SubCustomFieldValue.findById(id);
    if (!subCustomFieldValue) {
      return res.status(404).json({ message: "subCustomFieldValue not found" });
    }
    res.json(subCustomFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSubCustomFieldValueByAd = async (req, res) => {
  const { adId } = req.params;

  try {
    const subCustomFieldValue = await SubCustomFieldValue.find({ad_id: adId});
    if (!subCustomFieldValue) {
      return res.status(404).json({ message: "subCustomFieldValue not found" });
    }
    res.json(subCustomFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD
export const createSubCustomFieldValue = async (req, res) => {
  try {
    const { ad_id, field_id, field_name, value } = req.body;
    const data = {
        ad_id: ad_id,
        field_id: field_id ,
        field_name: field_name,
        value: value,
      
    };
    console.log('req.body:', req.body);

    const subCustomFieldValue = new SubCustomFieldValue(data);
    await subCustomFieldValue.save();
    res.status(201).json(subCustomFieldValue);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
// DELETE
export const deleteSubCustomFieldValue = async (req, res) => {
  try {
    const { id } = req.params;
    const subCustomFieldValue = await SubCustomFieldValue.findByIdAndDelete(id);
    if (!subCustomFieldValue) {
      return res.status(404).json({ message: "subCustomFieldValue not found" });
    }
    res.json(subCustomFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE
export const updateSubCustomFieldValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { ad_id, field_id,field_name, type } = req.body;
    const subCustomFieldValue = await SubCustomFieldValue.findById(id);
    if (!subCustomFieldValue) {
      return res.status(404).json({ message: "subCustomFieldValue not found" });
    }
    if ( ad_id) subCustomFieldValue.ad_id = ad_id;
    if (field_id) subCustomFieldValue.field_id = field_id;
    if (field_name) subCustomFieldValue.field_name = field_name;
    if (type) subCustomFieldValue.type = type;
    const savedSubCustomFieldValue = await subCustomFieldValue.save();
    res.json(savedSubCustomFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
