import City from "../models/City.js";

export const getCities = async (req, res) => {
  const { regionId } = req.params; // Get the region id from the request parameters

  try {
    const cities = await City.find({ region: regionId }); // Filter cities by region id
    res.status(200).json(cities);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find(); // Filter cities by region id
    res.status(200).json(cities);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getCityById = async (req, res) => {
  const { id } = req.params; // Get the region id from the request parameters

  try {
    const city = await City.find({ id: id }); // Filter cities by region id
    res.status(200).json(city);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
