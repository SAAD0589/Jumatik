import Region from "../models/Region.js";


export const getRegions = async(req, res) => {
    try {
        const region = await Region.find();
        res.status(200).json(region);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
