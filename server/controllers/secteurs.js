import Secteur from "../models/Secteur.js";

export const getSecteurs = async (req, res) => {
  const { cityId } = req.params; 

  try {
    const secteurs = await Secteur.find({ city: cityId }); 
    res.status(200).json(secteurs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllSecteurs = async (req, res) => {

  try {
    const searchQuery = req.query.name;

    // Define the query object
    const query = {};

    if (searchQuery) {
      // Use a regular expression to perform a case-insensitive search
      query.name = { $regex: new RegExp(searchQuery, 'i') };
    }

    // Perform the search query and return the filtered subcategories
    const secteurs = await Secteur.find(query);
    res.json(secteurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export const createSecteur = async (req, res) => {
    try {
      const { name,  city } = req.body;
      const data = {
        name,
        city
      };
      const secteur = new Secteur(data);
      await secteur.save();
      res.status(201).json(secteur);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  }
  export const deleteSecteur = async (req, res) => {
    try {
      const { id } = req.params;
      const secteur = await Secteur.findByIdAndDelete(id);
      if (!secteur) {
        return res.status(404).json({ message: 'secteur not found' });
      }
      res.json(secteur);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  