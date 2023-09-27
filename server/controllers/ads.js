import Ad from "../models/Ad.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import jwt from "jsonwebtoken";
import CustomFieldValue from "../models/CustomFieldValue.js";
import SubCustomFieldValue from "../models/SubCustomFieldValue.js";


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
          ProPart: user.ProPart,
        });
 
  
      await ad.save();
      
      res.status(201).json(ad);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };
export const updateDraft = async (req, res) => {
    try {
      const { secteur, region, name, description, price, categoryName,subcategoryName,subcategoryLabel, adPictures, city, categoryLabel,  } = req.body;
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
          ProPart: user.ProPart
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
        const ads = await Ad.find({status:'En cours de Validation'}).sort({ createdAt: -1 });
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
    // Retrieve query parameters
    const category = req.query.category || "";
    const subcategory = req.query.subcategory || "";
    const cities = req.query.cities || "";
    const text = req.query.text || "";
    const minPrice = req.query.minValue || ""; 
    const maxPrice = req.query.maxValue || ""; 
    const customFields = req.query.customFields || [];
    const subCustomFields = req.query.subCustomFields || [];

    // Build the query
    const query = { status: "Validée" };
    const options = {};

    if (category !== "") {
      query.categoryName = category;
    }

    if (subcategory !== "" && subcategory !== "null") {
      query.subcategoryName = subcategory;
    }

    if (cities !== "") {
      query.city = cities;
    }

    if (text !== "") {
      query.$text = { $search: text };
      options.score = { $meta: "textScore" };
    }
    if (minPrice !== "" && maxPrice !== "") {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
    // Handle custom fields
    if (customFields.length > 0) {
      const customFieldConditions = customFields.map((field) => ({
        field_name: field.field_name,
        value: field.value
      }));

      const customFieldAdIds = await CustomFieldValue.aggregate([
        { $match: { $or: customFieldConditions } },
        {
          $group: {
            _id: "$ad_id",
            count: { $sum: 1 }
          }
        },
        {
          $match: { count: { $gte: customFieldConditions.length } }
        },
        {
          $project: {
            _id: 1
          }
        }
      ]).exec();

      const customFieldAdIdArray = customFieldAdIds.map((ad) => ad._id);

      query._id = { $in: customFieldAdIdArray };
    }

    // Handle sub custom fields
    if (subCustomFields.length > 0) {
      const subCustomFieldConditions = subCustomFields.map((field) => ({
        field_name: field.field_name,
        value: field.value
      }));

      const subCustomFieldAdIds = await SubCustomFieldValue.aggregate([
        { $match: { $or: subCustomFieldConditions } },
        {
          $group: {
            _id: "$ad_id",
            count: { $sum: 1 }
          }
        },
        {
          $match: { count: { $gte: subCustomFieldConditions.length } }
        },
        {
          $project: {
            _id: 1
          }
        }
      ]).exec();

      const subCustomFieldAdIdArray = subCustomFieldAdIds.map((ad) => ad._id);

      if (query._id) {
        query._id.$in = subCustomFieldAdIdArray;
      } else {
        query._id = { $in: subCustomFieldAdIdArray };
      }
    }

    // Fetch ads
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