import City from "../models/City.js";


export const getCities = async (req, res) => {

  try {
    const searchQuery = req.query.name;

    // Define the query object
    const query = {};

    if (searchQuery) {
      // Use a regular expression to perform a case-insensitive search
      query.name = { $regex: new RegExp(searchQuery, 'i') };
    }

    // Perform the search query and return the filtered subcategories
    const cities = await City.find(query);
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const getAllCities = async (req, res) => {
  try {
    const searchQuery = req.query.name;

    // Define the query object
    const query = {};

    if (searchQuery) {
      // Use a regular expression to perform a case-insensitive search
      query.name = { $regex: new RegExp(searchQuery, 'i') };
    }

    // Perform the search query and return the filtered subcategories
    const cities = await City.find(query);
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
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
