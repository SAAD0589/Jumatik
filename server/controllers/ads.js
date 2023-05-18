import Ad from "../models/Ad.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import jwt from "jsonwebtoken";
import sharp from "sharp";


//CREATE

export const createDraft = async (req, res) => {
    try {
      const {  userId, region, name, description, price, categoryName,subcategoryName,subcategoryLabel, adPictures, city, categoryLabel, secteur } = req.body;
        // If no draft exists, create a new one
        const user = await User.findById(userId);
        const ad = new Ad({
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          categoryName,
          categoryLabel,
          subcategoryName,
          subcategoryLabel,
          name,
          city,
          region,
          secteur,
          description,
          userProfilePicture: user.profilePicture,
          adPictures,
          price,
          status: "Brouillon",
          likes: {},
        });
 
  
      await ad.save();
      
      res.status(201).json(ad);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
export const updateDraft = async (req, res) => {
    try {
      const { secteur, region, name, description, price, categoryName,subcategoryName,subcategoryLabel, adPictures, city, categoryLabel } = req.body;
      const id = req.params;
      // Check if a draft already exists for the user
      let ad = await Ad.findById(id);

        // If a draft already exists, update it with the new data
        ad.categoryName = categoryName;
        ad.categoryLabel = categoryLabel;
        ad.name = name;
        ad.city = city;
        ad.region = region;
        ad.secteur = secteur;
        ad.subcategoryName = subcategoryName;
        ad.subcategoryLabel =subcategoryLabel;
        ad.description = description;
        ad.adPictures = adPictures;
        ad.price = price;
        ad.updatedAt = new Date();
      
  
      await ad.save();
      
      res.status(201).json(ad);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
export const updateAd = async (req, res) => {
    try {
      const { secteur, name,region, description, price, categoryName,subcategoryName,subcategoryLabel, adPictures, city, categoryLabel } = req.body;
      const id = req.params;
      // Check if a draft already exists for the user
      let ad = await Ad.findById(id);

        // If a draft already exists, update it with the new data
        ad.categoryName = categoryName;
        ad.categoryLabel = categoryLabel;
        ad.subcategoryName = subcategoryName;
        ad.subcategoryLabel =subcategoryLabel;
        ad.name = name;
        ad.city = city;
        ad.region = region;
        ad.secteur = secteur;

        ad.description = description;
        ad.adPictures = adPictures;
        ad.price = price;
        ad.status = "En cours de Validation"
        ad.updatedAt = new Date();
      
  
      await ad.save();
      
      res.status(201).json(ad);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };

  export const createAd = async (req, res) => {
    try {
      const { secteur, userId, name, region, description, price, categoryName, subcategoryName, subcategoryLabel, adPictures, city, categoryLabel } = req.body;
  
      // Check if a draft already exists for the user
      let ad = await Ad.findOne({ userId: userId, name: name, description: description, status: "Brouillon" });
      if (!ad) {
        // If no draft exists, create a new one
        const user = await User.findById(userId);
        ad = new Ad({
          userId,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          categoryName,
          categoryLabel,
          subcategoryName,
          subcategoryLabel,
          name,
          city,
          region,
          secteur,
          description,
          userProfilePicture: user.profilePicture,
          adPictures,
          price,
          status: "En cours de Validation",
          likes: {},
        });
      } else {
        // If a draft already exists, update it with the new data
        ad.categoryName = categoryName;
        ad.categoryLabel = categoryLabel;
        ad.subcategoryName = subcategoryName;
        ad.subcategoryLabel = subcategoryLabel;
        ad.name = name;
        ad.city = city;
        ad.region = region;
        ad.secteur = secteur;
        ad.description = description;
        ad.adPictures = adPictures;
        ad.price = price;
        ad.status = "En cours de Validation";
        ad.updatedAt = new Date();
      }
  
      await ad.save();
  
      res.status(201).json(ad);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
  
  

// READ
export const getAd = async(req, res) => {
    try {
        const { id } = req.params;
        const ad = await Ad.findOne({ _id: id });
        res.status(200).json(ad);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getAdsByCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ _id: id })
        const ads = await Ad.find({ categoryName: category.name, status: "Validée" });
        res.status(200).json(ads);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getAdsCountByCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ _id: id })
        const adsCount = await Ad.countDocuments({ categoryName: category.name, status: "Validée" });
        res.status(200).json(adsCount);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getFeedValideAds = async(req, res) => {
    try {
        const ads = await Ad.find({ status: "Validée" }).sort({ createdAt: -1 });
        res.status(200).json(ads);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getAllAds = async(req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.status(200).json(ads);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserAds = async(req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);


        const ad = await Ad.find({ userId: currentUser._id, status: "Validée" });
        res.status(200).json(ad);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const annulerAd = async(req, res) => {
    try {
        const id = req.params.id;
        const ad = await Ad.findById(id);
        const updatedAd = await Ad.findByIdAndUpdate(
            id, { status: "Annulée" }, { new: true }
        );


        res.status(200).json(ad);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const validerAd = async(req, res) => {
    try {
        const id = req.params.id;
        const ad = await Ad.findById(id);
        const updatedAd = await Ad.findByIdAndUpdate(
            id, { status: "Validée" }, { new: true }
        );


        res.status(200).json(ad);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getUserAllAds = async(req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);


        const ad = await Ad.find({ userId: currentUser._id});
        res.status(200).json(ad);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getUserAdsCount = async(req, res) => {
    try {
        const { userId } = req.params;
        const adCount = await Ad.countDocuments({ userId, status: "Validée" });
        res.status(200).json({ adCount });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getAdsCount = async(req, res) => {
    try {

        const adCount = await Ad.countDocuments({ status: "Validée" });
        res.status(200).json(adCount);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


// UPDATE
export const likeAd = async(req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const ad = await Ad.findById(id);
        let likes = ad.likes;

        if (!likes) {
            likes = new Map();
        }

        if (likes.get(userId)) {
            likes.delete(userId);
        } else {
            likes.set(userId, true);
        }

        const updatedAd = await Ad.findByIdAndUpdate(
            id, { likes: Array.from(likes.entries()) }, { new: true }
        );
        res.status(200).json(updatedAd);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getLike = async(req, res) => {
    try {
        const { id } = req.params;
        const ad = await Ad.findById(id);
        const likes = ad.likes;

        res.status(200).json(likes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const searchAds = async (req, res) => {
    try {
      const category = req.query.category || "";
      const subcategory = req.query.subcategory || "";
      const secteur = req.query.secteur || "";
      const region = req.query.region || "";
      const city = req.query.city || "";
      const text = req.query.text || "";
  
      const query = { status: "Validée" };
      const options = {};
  
      if (category !== "") {
        query.categoryName = category;
      }
  
      if (subcategory !== "") {
        query.subcategoryName = subcategory;
      }
  
      if (secteur !== "") {
        query.secteur = secteur;
      }
  
      if (region !== "") {
        query.region = region;
      }
  
      if (city !== "") {
        query.city = city;
      }
  
      if (text !== "") {
        query.$text = { $search: text };
        options.score = { $meta: "textScore" };
      }
  
      const ads = await Ad.find(query, options).sort(options);
  
      res.json(ads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };
  
// DELETE
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findByIdAndDelete(id);
    if (!ad) {
      return res.status(404).json({ message: 'ad not found' });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};