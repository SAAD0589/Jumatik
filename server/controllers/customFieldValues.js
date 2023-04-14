import CustomFieldValue from "../models/CustomFieldValue.js";

// READ
export const getAllCustomFieldValues = async (req, res) => {
  try {
    const customFieldValues = await CustomFieldValue.find();
    res.status(200).json(customFieldValues);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getCustomFieldValue = async (req, res) => {
  const { id } = req.params;

  try {
    const customFieldValue = await CustomFieldValue.findById(id);
    if (!customFieldValue) {
      return res.status(404).json({ message: "customFieldValue not found" });
    }
    res.json(customFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCustomFieldValueByAd = async (req, res) => {
  const { adId } = req.params;

  try {
    const customFieldValue = await CustomFieldValue.find({ad_id: adId});
    if (!customFieldValue) {
      return res.status(404).json({ message: "customFieldValue not found" });
    }
    res.json(customFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ADD
export const createCustomFieldValue = async (req, res) => {
  try {
    const { ad_id, field_id, field_name, valeure } = req.body;
    const data = {
        ad_id: ad_id,
        field_id: field_id ,
        field_name: field_name,
        valeure: valeure,
      
    };
    console.log('req.body:', req.body);

    const customFieldValue = new CustomFieldValue(data);
    await customFieldValue.save();
    res.status(201).json(customFieldValue);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
// DELETE
export const deleteCustomFieldValue = async (req, res) => {
  try {
    const { id } = req.params;
    const customFieldValue = await CustomFieldValue.findByIdAndDelete(id);
    if (!customFieldValue) {
      return res.status(404).json({ message: "customFieldValue not found" });
    }
    res.json(customFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE
export const updateCustomFieldValue = async (req, res) => {
  try {
    const { id } = req.params;
    const { ad_id, field_id,field_name, type } = req.body;
    const customFieldValue = await CustomFieldValue.findById(id);
    if (!customFieldValue) {
      return res.status(404).json({ message: "customFieldValue not found" });
    }
    if ( ad_id) customFieldValue.ad_id = ad_id;
    if (field_id) customFieldValue.field_id = field_id;
    if (field_name) customFieldValue.field_name = field_name;
    if (type) customFieldValue.type = type;
    const savedCustomFieldValue = await customFieldValue.save();
    res.json(savedCustomFieldValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
