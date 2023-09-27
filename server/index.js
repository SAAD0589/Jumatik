import express from "express";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import adsRoutes from "./routes/ads.js"
import notificationsRoutes from "./routes/notifications.js"
import categoriesRoutes from "./routes/categories.js"
import subcategoriesRoutes from "./routes/subcategories.js"
import secteursRoutes from "./routes/secteurs.js"
import citiesRoutes from "./routes/cities.js"
import customFieldsRoutes from "./routes/customFields.js";
import subCustomFieldsRoutes from "./routes/subCustomFields.js";
import customFieldsValuesRoutes from "./routes/customFieldValues.js";
import subCustomFieldsValuesRoutes from "./routes/subCustomFieldValues.js";
import regionsRoutes from "./routes/regions.js"
import conversationsRoutes from "./routes/conversations.js"
import messagesRoutes from "./routes/messages.js"
import { register } from "./controllers/auth.js";
import { updateUser } from "./controllers/users.js";
import { createAd } from "./controllers/ads.js";
import { createDraft } from "./controllers/ads.js";
import { updateDraft } from "./controllers/ads.js";
import { updateAd } from "./controllers/ads.js";
import { Console, error } from "console";
import { verifyToken } from "./middleware/auth.js";
import Category from "./models/Category.js";
import City from "./models/City.js";
import Secteur from "./models/Secteur.js";
import Region from "./models/Region.js";
import passport from "passport";
import https from 'https';
import fs from 'fs';
import CustomField from "./models/CustomField.js";
import SubCustomField from "./models/SubCustomField.js";


/* CONFIGURATION */

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
// const httpsOptions  = {
//     key: fs.readFileSync('/etc/letsencrypt/live/jumatik.ma/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/jumatik.ma/fullchain.pem')
//   };

dotenv.config();
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


/* FILE STORAGE */

app.use(express.static('public'));
app.use('/assets', express.static('assets'));
const dirname = path.resolve();
app.use('/assets', express.static(path.join(dirname, 'public/assets')));
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 25 * 1024 * 1024, // 25 MB
    }
});
// app.use(upload.array()); 
/* SESSION CONFIG */
app.use(session({
    secret: 'a1s2d3f4g5h6',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// Initialize passport middleware
app.use(passport.initialize());

// Use passport session middleware
app.use(passport.session());

// Configure passport strategies
/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("profilePicture"), register);
app.patch("/users/update/:id", verifyToken, upload.single("profilePicture"), updateUser);

app.put("/ads", verifyToken, upload.array('adPictures', 6), createAd);
app.put("/ads/:id", verifyToken, upload.array('adPictures', 6), updateAd);
app.post("/ads/draft/save", verifyToken, upload.array('adPictures', 6), createDraft);
app.put("/ads/draft/update/:_id", verifyToken, upload.array('adPictures', 6), updateDraft);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/ads", adsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/subcategories", subcategoriesRoutes);
app.use("/secteurs", secteursRoutes);
app.use("/customFields", customFieldsRoutes);
app.use("/subCustomFields", subCustomFieldsRoutes);
app.use("/customFieldsValues", customFieldsValuesRoutes);
app.use("/subCustomFieldsValues", subCustomFieldsValuesRoutes);
app.use("/cities", citiesRoutes);
app.use("/regions", regionsRoutes);
app.use("/conversations", conversationsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/messages", messagesRoutes);
const MongoDBStore = connectMongoDBSession(session);


mongoose.set('strictQuery', false);

/* MONGOOSE SETUP */
const PORT = 6001;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        https.createServer( app).listen(PORT, () => {
                // const categories = [{"_id":"6464e5dee3c4a557397f42a8","label":"J'ai besois de ...","name":"Jai-besois-de","CatPicture":"https://jumatik.ma:6001/assets/need.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42b0","label":"Véhicules Vente","name":"vehicule-vente","CatPicture":"https://jumatik.ma:6001/assets/sellCar.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42b7","label":"Véhicules Location","name":"vehicules-location","CatPicture":"https://jumatik.ma:6001/assets/rentCar.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42c3","label":"Auto - Moto","name":"Auto-Moto","CatPicture":"https://jumatik.ma:6001/assets/moto.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42cf","label":"Matériels Professionnels","name":"Materiels-Professionnels","CatPicture":"https://jumatik.ma:6001/assets/proTools.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42db","label":"Pièces de rechange et Accessoires","name":"Pieces-de-rechange-et-Accessoires","CatPicture":"https://jumatik.ma:6001/assets/parts.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42e7","label":"Immobiliers Vente","name":"Immobiliers-Vente","CatPicture":"https://jumatik.ma:6001/assets/sellHouse.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42f3","label":"Immobiliers Location","name":"Immobiliers-Location","CatPicture":"https://jumatik.ma:6001/assets/rentHouse.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f42ff","label":"Offres d'emploi et stages","name":"Offres-demploi-et-stages","CatPicture":"https://jumatik.ma:6001/assets/jobOffer.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f430b","label":"Demande d'emploi et stages","name":"Demande-demploi-et-stages","CatPicture":"https://jumatik.ma:6001/assets/jobRequest.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f4313","label":"Animaux et oiseaux","name":"Animaux-et-oiseaux","CatPicture":"https://jumatik.ma:6001/assets/animals.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f431c","label":"Téléphonie et Multimédia","name":"Telephonie-et-Multimedia","CatPicture":"https://jumatik.ma:6001/assets/phones.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f4321","label":"Espace d'affaires et Gros","name":"Espace-daffaires-et-Gros","CatPicture":"https://jumatik.ma:6001/assets/businessSpace.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f4328","label":"Prestations de services","name":"Prestations-de-services","CatPicture":"https://jumatik.ma:6001/assets/services.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f432d","label":"Jeux vidéo et Jouets","name":"Jeux-video-et-Jouets","CatPicture":"https://jumatik.ma:6001/assets/games.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f4334","label":"Loisirs/Vêtements/Vacances","name":"Loisirs-Vetements-Vacances","CatPicture":"https://jumatik.ma:6001/assets/clothing.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f4339","label":"Maison et Équipements","name":"Maison-et-Equipements","CatPicture":"https://jumatik.ma:6001/assets/houseEq.jpg"}
                // ,{"_id":"6464e5dee3c4a557397f4340","label":"Beauté et Santé","name":"Beaute-et-Sante","CatPicture":"https://jumatik.ma:6001/assets/beaute.jpeg"}
                // ,{"_id":"6464e5dee3c4a557397f4345","label":"Divers","name":"Divers","CatPicture":"https://jumatik.ma:6001/assets/need.jpg"}
                // ]
                // const result =  Category.insertMany(categories);
                // console.log('Inserted documents:', result.insertedCount);
                
                // const addCategories = async () => {
                //     for (let i = 0; i < categories.length; i++) {
                //       const category = categories[i];
                //       const existingCategory = await Category.findOne({
                //         name: category.name,
                //       });
                //       if (!existingCategory) {
                //         const newCategory = new Category(category);
                //         await newCategory.save();
                //       } else {
                //         existingCategory.CatPicture = category.CatPicture;
                //         await existingCategory.save();
                //       }
                //     }
                //   };
    
                // addCategories();
                // const customFields = [{"_id":"6466549a2f0bd33d4c207f3d","name":"Type","category":"vehicule-vente","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646654d72f0bd33d4c207f80","name":"Type","category":"vehicules-location","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646654f82f0bd33d4c207fa3","name":"Type","category":"Auto-Moto","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"6466550e2f0bd33d4c207fbc","name":"Type","category":"Materiels-Professionnels","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655262f0bd33d4c207fd9","name":"Type","category":"Pieces-de-rechange-et-Accessoires","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655382f0bd33d4c207fee","name":"Type","category":"Immobiliers-Vente","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655582f0bd33d4c20800f","name":"Type","category":"Immobiliers-Location","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655a72f0bd33d4c208067","name":"type","category":"Telephonie-et-Multimedia","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655bc2f0bd33d4c20807e","name":"Type","category":"Espace-daffaires-et-Gros","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655de2f0bd33d4c2080a4","name":"Type","category":"Jeux-video-et-Jouets","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646655f42f0bd33d4c2080bf","name":"Type","category":"Loisirs/Vetements/Vacances","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"6466560c2f0bd33d4c2080d8","name":"Type","category":"Maison-et-Equipements","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"6466561f2f0bd33d4c2080ef","name":"Type","category":"Beaute-et-Sante","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646656312f0bd33d4c208104","name":"Type","category":"Divers","subcategory":"","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646b366b2f0bd33d4c2200f3","name":"Sexe","category":"Loisirs/Vetements/Vacances","subcategory":"Vtements","type":"radio","options":["Homme","Femme","Garçon","Fille","Bébé"]}
                // ,{"_id":"646bf921a981c3b7517b92b3","name":"Type","category":"Telephonie-et-Multimedia ","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646bf940a981c3b7517b92c5","name":"Type","category":"Espace-daffaires-et-Gros","type":"radio","options":["Offre","Demande"]}
                // ,{"_id":"646cad8cbe6ec6b621a35a8a","name":"Type","category":"Animaux-et-oiseaux","subcategory":"","type":"radio","options":["Offre","Demande"]}]
                
                //                const result =  CustomField.insertMany(customFields);
//          const phones = [
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "ALCATEL",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "1 1/8GB Bluish Black (5033D-2JALUAA)",
//       "1 5033D 1/16GB Volcano Black (5033D-2LALUAF)",
//       "1 5033D 1/16GB Volcano Black (5033D-2LALUAF)",
//       "1 5033D 1/16GB Volcano Black (5033D-2LALUAF)",
//       "1B 5002H Pine Green (5002H-2BALUA12)",
//       "1B 5002H Prime Black (5002H-2AALUA12)",
//       "1SE 3/32GB Power Gray (5030D-2AALUA2)",
//       "1SE 4/128GB Agate Green (5030E-2BALUA2)",
//       "1SE 4/128GB Agate Green (5030E-2BALUA2)",
//       "2003 Dual SIM Dark Gray (2003D-2AALUA1)",
//       "2003 Dual SIM Dark Gray (2003D-2AALUA1)",
//       "2003 Dual SIM Metallic Blue (2003D-2BALUA1)",
//       "2019 Single SIM Metallic Gray (2019G-3AALUA1)",
//       "2053 Dual SIM Pure White (2053D-2BALUA1)",
//       "2053 Dual SIM Volcano Black (2053D-2AALUA1)",
//       "3X 5048Y Black (5048Y-2AALWE12)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Nokia",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "1.3 1/16GB Charcoal",
//       "105 DS 2019 Pink (16KIGP01A01)",
//       "105 Dual Sim 2019 Black (16KIGB01A01)",
//       "105 Dual Sim 2019 Black (16KIGB01A01)",
//       "105 Dual Sim New Black (A00028315)",
//       "105 Single Sim 2019 Black (16KIGB01A13)",
//       "105 Single Sim 2019 Pink (16KIGP01A13)",
//       "105 Single Sim New Black (A00028356)",
//       "105 Single Sim New Black (A00028356)",
//       "105 Single Sim New Blue (A00028372)",
//       "105 Single Sim New White (A00028371)",
//       "106 New DS Grey (16NEBD01A02)",
//       "106 New DS Grey (16NEBD01A02)",
//       "110 Dual Sim 2019 Black (16NKLB01A07)",
//       "110 Dual Sim 2019 Blue (16NKLL01A04)",
//       "125 Dual Sim Black (16GMNB01A17)",
//       "150 Black",
//       "150 Dual Sim Cyan (16GMNE01A04)",
//       "150 Dual Sim Red (16GMNR01A02)",
//       "150 White",
//       "2.2 2/16GB Black",
//       "2.3 2/32GB Green",
//       "2.4 2/32GB Charcoal",
//       "210 Dual SIM 2019 Black (16OTRB01A02)",
//       "230 Dual Blue (16PCML01A02)",
//       "230 Dual Dark Silver (A00026971)",
//       "2720 Flip Black (16BTSB01A10)",
//       "2720 Flip Red",
//       "2720 Flip Red",
//       "3.4 3/64GB Charcoal",
//       "5.3 4/64GB Charcoal",
//       "5.4 4/128GB Polar Night",
//       "5310 2020 DualSim Black/Red (16PISXO1A18)",
//       "6 64GB Black",
//       "6 64GB Silver",
//       "6.1 4/32GB Black",
//       "6.1 4/64GB Black",
//       "6.1 Plus 4/64GB Blue",
//       "7 Plus 4/64GB Black",
//       "8 Dual SIM Silver",
//       "8.3 5G 8/128GB Polar Night",
//       "800 Tough Black",
//       "800 Tough Sand",
//       "Lumia 925 (Black)",
//       "Lumia 925 (White)",
//       "Lumia 925 (White)",
//       "X7 Dual Sim 6/128GB Black",
//       "X7 Dual Sim 6/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Honor",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "10 6/64GB Black",
//       "10 Lite 3/32GB Blue",
//       "10 Lite 4/64GB Black",
//       "10 lite 3/128GB Blue",
//       "10 lite 3/64GB Black",
//       "10 lite 3/64GB Black",
//       "10 lite 3/64GB Blue",
//       "10i 4/128GB Black (51093VQV)",
//       "10i 4/128GB Blue (51093VQX)",
//       "20 6/128GB Black",
//       "7 16GB (Gold)",
//       "7 16GB (Gold)",
//       "7 16GB (Gold)",
//       "8 3/32GB Blue",
//       "8 4/64GB (Blue)",
//       "8A 2/32GB Gold",
//       "8A 3/64GB Blue",
//       "8A 3/64GB Blue",
//       "8S 2/32GB Black (51093ULM)",
//       "8S 2/32GB Black (51093ULM)",
//       "8x Max 4/64GB Black",
//       "8x Max 4/64GB Black",
//       "8x Max 4/64GB Blue",
//       "9 4/64GB Dual Blue",
//       "9 Lite 3/32GB Midnight Black",
//       "9i 3/32GB Black",
//       "9i 3/32GB Black",
//       "9i 4/64GB Blue",
//       "9i 4/64GB Blue",
//       "9x 4/128GB Black",
//       "V10 6/128GB Dual Beach Gold",
//       "V9 6/64GB Red",
//       "V9 6/64GB Red"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Meizu",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "15 4/128GB Black",
//       "15 4/64GB Black",
//       "15 4/64GB Black",
//       "15 4/64GB Black",
//       "15 Plus 6/64GB Black",
//       "15 Plus 6/64GB Gray",
//       "15 Plus 6/64GB Gray",
//       "16 6/128GB Black",
//       "16 6/64GB Black",
//       "16X 6/128GB Dual Purple",
//       "16Xs 6/128GB Pearl White",
//       "16th 6/64GB Black",
//       "C9 2/16GB Black",
//       "C9 Pro 3/32GB Black",
//       "C9 Pro 3/32GB Black",
//       "M10 2/32GB Black",
//       "M10 2/32GB Red",
//       "M10 3/32GB Black",
//       "M10 3/32GB Blue",
//       "M6 Note 3/16GB Black",
//       "M6T 2/16GB Black",
//       "M6T 3/32GB Blue",
//       "M6s 3/64GB Gold",
//       "M8 4/64GB Black",
//       "M8 4/64GB Blue",
//       "Note 9 4/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "realme",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "3 Pro 6/128GB Nitro Blue",
//       "3 Pro 6/128GB Nitro Blue",
//       "5 4/128GB Violet",
//       "5 Pro 8/128GB Green",
//       "5 Pro 8/128GB Green",
//       "5 Pro 8/128GB Green",
//       "5i 4/64GB Green",
//       "6 4/128GB Blue",
//       "6 4/64GB Blue",
//       "6 8/128GB Blue",
//       "6 Pro 8/128GB Blue",
//       "6S 4/64GB Eclipse Black",
//       "6S 4/64GB Eclipse Black",
//       "6S 6/128GB Lunar White",
//       "6i 3/64GB White",
//       "6i 4/128GB Green",
//       "7 6/64GB Mist Blue",
//       "7 Pro 8/128GB Mirror Blue",
//       "C11 2/32GB Green",
//       "C11 2/32GB Grey",
//       "C2 2/32GB Diamond Black",
//       "C3 2/32GB Blue",
//       "C3 2/32GB Red",
//       "C3 3/32GB Red",
//       "C3 3/64GB Blue",
//       "Q 6/64GB Blue",
//       "X2 Pro 8/128GB Lunar White",
//       "X50 5G 6/128GB Jungle Green",
//       "X50 Pro 5G 8/128GB Green",
//       "X50 Pro 5G 8/256GB Rust Red"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "OnePlus",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "3T 128GB (Gunmetal)",
//       "3T 128GB (Gunmetal)",
//       "3T 64GB (Gunmetal)",
//       "5 6/64GB Black",
//       "5 6/64GB Slate Grey",
//       "6T 8/256GB Midnight Black",
//       "7 8/256GB Mirror Gray",
//       "8 12/256GB Onyx Black",
//       "8 8/128GB Onyx Black",
//       "8 Pro 12/256GB Glacial Green",
//       "8 Pro 8/128GB Onyx Black",
//       "8T 12/256GB Cyberpunk 2077 Limited Edition",
//       "8T 12/256GB Lunar Silver",
//       "8T 8/128GB Aquamarine Green",
//       "Nord 12/256GB Gray Onyx",
//       "Nord 8/128GB Gray Onyx",
//       "Nord N10 5G 6/128GB Midnight Ice",
//       "Nord N100 4/64GB Midnight Frost"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Archos",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "40 Neon",
//       "40 Neon",
//       "A50 GRANITE 2/16GB Black",
//       "Core 50 16GB Red",
//       "Sense 55DC 16GB Black",
//       "Sense 55DC 16GB Gold",
//       "Sense 55DC 16GB Gold",
//       "Sense 55DC 16GB Gold",
//       "Sense 55S 16GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Ulefone",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A1 Dual Black",
//       "A1 Dual Gold",
//       "A1 Silver",
//       "Armor 10 5G 8/128GB Black",
//       "Armor 3W 6/64GB Black",
//       "Armor 3WT 6/64GB Black",
//       "Armor 7E 4/128GB Black",
//       "Armor 7E 4/128GB Black",
//       "Armor 8 4/64GB Black (6937748733744)",
//       "Armor 9 8/128GB Black (6937748733515)",
//       "Armor 9E 8/128GB Black (6937748733805)",
//       "Armor 9E 8/128GB Black (6937748733805)",
//       "Armor Mini Black",
//       "Armor Mini Red",
//       "Armor X3 2/32GB Black",
//       "Armor X5 3/32GB Red (6937748733256)",
//       "Armor X5 Pro 4/64GB Black (6937748733829)",
//       "Armor X6 2/16GB Orange",
//       "Armor X7 2/16GB Orange",
//       "Armor X7 Pro 4/32GB Black",
//       "Armor X8 4/64GB Black",
//       "Note 7P 3/32GB Twilight",
//       "Note 7P 3/32GB Twilight",
//       "Note 8P 2/16GB Black",
//       "Note 8P 2/16GB Midnight Green",
//       "Note 8P 2/16GB Midnight Green",
//       "Power 6 4/64GB Black",
//       "Power 6 4/64GB Blue",
//       "Power 6 4/64GB Red",
//       "Power 6 4/64GB Red",
//       "S1 1/8GB Black",
//       "S1 1/8GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "AGM",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A10 6/128GB Black",
//       "A8 3/32GB Black",
//       "A9 4/32GB Black",
//       "A9 4/64GB Black",
//       "M2 Gold",
//       "M3 Black",
//       "M5 Black",
//       "X3 6/64GB Black",
//       "X3 8/64GB Black",
//       "X3 8/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "OPPO",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A12 3/32GB Black",
//       "A12 4/64GB Blue",
//       "A31 4/64GB Mystery Black",
//       "A5 2020 3/64GB Black",
//       "A52 4/64GB Twilight Black",
//       "A53 4/128GB Electric Black",
//       "A53 4/64GB Black",
//       "A5s 3/32Gb Blue",
//       "A72 4/128GB Aurora Purple",
//       "A73 4/128GB Navy Blue",
//       "A9 2020 4/128GB Marine Green",
//       "A9 2020 4/128GB Space Purple",
//       "A91 8/128GB Black",
//       "Find X2 12/256GB Ocean Black",
//       "Find X2 Pro 12/512GB Orange",
//       "Reno 4 Lite 8/128GB Magic Blue",
//       "Reno 4 Pro 8/256GB Starry Night",
//       "Reno 6/256GB Ocean Green",
//       "Reno2 8/256GB Ocean Blue",
//       "Reno2 Z 8/128GB Black",
//       "Reno4 Z 5G 8/128GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Astro",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A144 Black/Red",
//       "A167 Black/Red",
//       "A167 Black/Red",
//       "A167 Black/Red",
//       "A169 Black Gray",
//       "A173 Black/Orange",
//       "A225 Black",
//       "A225 Black",
//       "B200RX (White)",
//       "B200RX (Yellow)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Rezone",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A170 Point Black",
//       "A170 Point Black",
//       "A170 Point Dark Blue",
//       "A170 Point Dark Blue",
//       "A170 Point Dark Blue",
//       "A240 Experience Red",
//       "A281 Force Black",
//       "S240 Age Black Orange",
//       "S240 Age Black Orange"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Blackview",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A30 2/16GB Black",
//       "A30 2/16GB Black",
//       "A60 1/16GB Black",
//       "A60 Plus 4/64GB Black",
//       "A60 Pro 3/16GB Black",
//       "A80 2/16GB Red",
//       "A80 Pro 4/64GB Black",
//       "BV1000 Black",
//       "BV4900 3/32GB Black",
//       "BV4900 Pro 4/64GB Orange",
//       "BV5100 4/128GB Green",
//       "BV5100 Pro 4/128GB Black",
//       "BV5500 2/16GB Black",
//       "BV5500 Plus 3/32GB Black",
//       "BV5500 Pro 3/16GB Black",
//       "BV5500 Pro 3/16GB Black",
//       "BV5800 Pro 2/16GB Black",
//       "BV5900 3/32GB Black",
//       "BV6100 3/16GB Black",
//       "BV6300 3/32GB Black",
//       "BV6300 Pro 6/128GB Black",
//       "BV6800 Pro 4/64GB Black",
//       "BV6900 4/64GB Black",
//       "BV8000 Pro Lion Gold",
//       "BV8000 Pro Lion Gold",
//       "BV9100 4/64GB Black",
//       "BV9500 Black",
//       "BV9500 Plus 4/64GB Black",
//       "BV9500 Pro 6/128GB Black",
//       "BV9600 4/64GB Silver",
//       "BV9600 4/64GB Silver",
//       "BV9600 Pro 6/128GB Black",
//       "BV9600 Pro 6/128GB Black",
//       "BV9600E 4/128GB Grey",
//       "BV9700 Pro 6/128GB Black",
//       "BV9700 Pro 6/128GB Black + Night Vision Camera",
//       "BV9800 6/128Gb Black",
//       "BV9800 6/128Gb Black",
//       "BV9800 Pro 6/128GB Orange",
//       "BV9900 8/256GB Black",
//       "BV9900 Pro 8/128GB Gray",
//       "BV9900E 6/128GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Bravis",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A512 Harmony Pro DS Black",
//       "N1-550 Cruiser Dual Sim Black",
//       "N1-550 Cruiser Dual Sim Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "NUU",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A5L+ 2/16GB Grey"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Lenovo",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A7 2/32GB L19111 Blue",
//       "K10 Note 4/64GB Black",
//       "K10 Note 6/128GB Louise Lake",
//       "K5 Pro 4/64GB Black",
//       "S5 4/64GB Pink",
//       "S5 Pro 6/64GB Black",
//       "S5 Pro 6/64Gb Blue",
//       "S5 Pro 6/64Gb Gold"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "UMIDIGI",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "A7 Pro 4/128GB Black",
//       "A7 Pro 4/128GB Black",
//       "A7 Pro 4/64GB Black",
//       "A7S 2/32GB Black",
//       "Bison 6/128GB Red"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Assistant",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "AS-201 Dual Sim Blue",
//       "AS-203 Dual Sim Black",
//       "Shine AS-5435 Blue"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Crosscall",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Action-X3 3/32GB Black",
//       "CORE-X3 2/16GB Dark Blue"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Sharp",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Aquos D10 4/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "ERGO",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "B181 DUAL SIM BLACK",
//       "B241 Black",
//       "B505 Unit 4G Dual Sim Black",
//       "F186 Solace DS Black",
//       "F186 Solace DS Silver",
//       "F188 Play DS Black",
//       "F188 Play DS Black",
//       "F243 Swift Dual Sim Black",
//       "F243 Swift Dual Sim Blue",
//       "F243 Swift Dual Sim Blue",
//       "F243 Swift Dual Sim Blue",
//       "F245 Strength Dual Sim Yellow/Black",
//       "F248 Defender Dual SIM Black",
//       "F282 Travel Dual Sim Black",
//       "F282 Travel Dual Sim Black",
//       "F284 Balance Dual Sim Black",
//       "F285 Wide DS Black",
//       "F285 Wide DS Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Tecno",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "B1P DS Champagne Gold",
//       "B1P DS Champagne Gold",
//       "Camon 12 Air CC6 Alpenglow Gold",
//       "Camon 12 CC7 Dark Jade",
//       "Camon 15 4/64GB Dark Jade (4895180755057)",
//       "Camon 15 CD7 4/128GB Fascinating Purple (4895180759550)",
//       "POP 2F B1F 1/16GB Midnight Black (4895180746659)",
//       "POP 3 BB2 1/16GB DS Sandstone Black (4895180751288)",
//       "POP 4 BC2 2/32GB DS Ice Lake Green (4895180759420)",
//       "Pop 4 Pro BC3 1/16GB Cosmic Shine",
//       "Spark 4 KC2 3/32GB Royal Purple",
//       "Spark 4 Lite 2/32GB Midnight Black (4895180754593)",
//       "Spark 5 Pro KD7 4/128GB DS Spark Orange",
//       "Spark 5 Pro KD7 4/64GB DS Spark Orange",
//       "Spark 6 Go KE5 2/32GB Aqua Blue (4895180762383)",
//       "Spark 6 Go KE5j 3/64GB Aqua Blue (4895180762918)",
//       "Spark 6 KE7 4/128GB Comet Black (4895180762079)",
//       "Spark 6 KE7 4/64GB Ocean Blue (4895180762024)",
//       "T301 Black (4895180743320)",
//       "T372 TripleSIM Black (4895180746833)",
//       "T454 Champagne Gold (4895180745980)",
//       "T474 Blue (4895180748004)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "CAT",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "B26 Black",
//       "S31 Black",
//       "S42 Dual Black",
//       "S52",
//       "S60",
//       "S61 Black",
//       "S62 Pro"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "DOOGEE",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "BL5000 Black (6924351609900)",
//       "BL5000 Black (6924351609900)",
//       "BL5500 Lite 2/16GB Dual Sim Gold",
//       "MIX 2 6/64GB Black",
//       "N10 3/32GB Purple",
//       "N20 4/64GB Black",
//       "N20 Pro 6/128GB Green",
//       "N30 4/128GB Dreamy Blue",
//       "N30 4/128GB Dreamy Blue",
//       "S40 3/32GB Black",
//       "S40 Lite 2/16GB Black",
//       "S40 Lite 2/16GB Black",
//       "S40 Lite 2/16GB Black",
//       "S40 Pro 4/64GB Black",
//       "S40 Pro 4/64GB Black",
//       "S55 4/64GB Black",
//       "S58 Pro 6/64GB Black",
//       "S60 Lite 4/32GB Black",
//       "S60 Lite 4/32GB Black",
//       "S68 Pro 6/128GB Black",
//       "S88 Pro 6/128GB Black",
//       "S90C 4/128GB Black",
//       "S90C 4/64GB Black",
//       "S90C 4/64GB Black",
//       "S90C 4/64GB Black",
//       "S90C 4/64GB GIFT Orange",
//       "S95 Pro 8/128GB Black",
//       "S95 Pro 8/256GB Mineral Black",
//       "S96 Pro 8/128GB Black",
//       "S96 Pro 8/128GB Green",
//       "S96 Pro 8/128GB Orange",
//       "X60L Matte Black (6924351653118)",
//       "X90 1/16GB Black",
//       "X90 1/16GB Blue",
//       "X90 1/16GB Gold",
//       "X90 1/16GB Gold",
//       "X90L 3/16GB Green",
//       "X90L 3/16GB Purple",
//       "X90L 3/16GB Purple",
//       "X95 2/16GB Black",
//       "X95 2/16GB Green",
//       "X95 2/16GB Green",
//       "Y9 Plus 4/64GB Black",
//       "Y9 Plus 4/64GB Blue"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Xiaomi",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Black Shark 2 Pro 8/128GB Black",
//       "Black Shark 2 Pro 8/128GB Iceberg Grey",
//       "Black Shark 3 12/256GB Black",
//       "Black Shark 3 8/128GB Black",
//       "Black Shark 8/128GB Black",
//       "Mi 10 Lite 6/128GB Cosmic Grey",
//       "Mi 10 Lite 6/64GB Cosmic Grey",
//       "Mi 10 Lite 8/256GB Dream White",
//       "Mi 10 Pro 8/256GB Gray",
//       "Mi 10T 6/128GB Cosmic Black",
//       "Mi 10T 8/128GB Cosmic Black",
//       "Mi 10T Lite 6/128GB Pearl Gray",
//       "Mi 10T Lite 6/64GB Pearl Gray",
//       "Mi 10T Pro 8/128GB Cosmic Black",
//       "Mi 10T Pro 8/256GB Cosmic Black",
//       "Mi Max 2 4/64GB Black",
//       "Mi Note 10 Lite 6/64GB Purple",
//       "Mi5 3/32GB Gold",
//       "Poco F2 Pro 6/128GB Electric Purple",
//       "Poco M3 4/128GB Black",
//       "Poco M3 4/64GB Black",
//       "Poco X3 NFC 6/128GB Cobalt Blue",
//       "Poco X3 NFC 6/64GB Cobalt Blue",
//       "Pocophone F1 6/128GB Blue",
//       "Redmi 10x 4G 4/128GB Blue",
//       "Redmi 10x 4G 6/128GB Blue",
//       "Redmi 4x 2/16GB Black",
//       "Redmi 4x 2/16GB Gold",
//       "Redmi 4x 4/64GB Black",
//       "Redmi 4x 4/64GB Gold",
//       "Redmi 5 3/32GB Black",
//       "Redmi 5 3/32GB Gold",
//       "Redmi 5 Plus 4/64GB Black",
//       "Redmi 5 Plus 4/64GB Gold",
//       "Redmi 5A 2/16GB Gold",
//       "Redmi 5A 3/32GB Gold",
//       "Redmi 5A 3/32GB Gray",
//       "Redmi 5A 3/32GB Gray",
//       "Redmi 6 3/32GB Black",
//       "Redmi 6 3/32GB Gold",
//       "Redmi 6 3/64GB Black",
//       "Redmi 6 3/64GB Gold",
//       "Redmi 6 3/64GB Gold",
//       "Redmi 6 4/64GB Black",
//       "Redmi 6 Pro 3/32GB Black",
//       "Redmi 6 Pro 4/64GB Black",
//       "Redmi 7 4/64GB Blue",
//       "Redmi 7 4/64GB Blue",
//       "Redmi 7a 2/16GB Black",
//       "Redmi 7a 3/32GB Black",
//       "Redmi 8 3/32GB Black",
//       "Redmi 8 4/64GB Blue",
//       "Redmi 8A 3/32GB Black",
//       "Redmi 8A 4/64GB Black",
//       "Redmi 9 3/32GB Grey NFC",
//       "Redmi 9 3/32GB Purple no NFC",
//       "Redmi 9 4/128GB Blue (no NFC)",
//       "Redmi 9 4/128GB Blue (no NFC)",
//       "Redmi 9 4/128GB Green (no NFC)",
//       "Redmi 9 4/128GB Green (no NFC)",
//       "Redmi 9 4/128GB Grey (no NFC)",
//       "Redmi 9 4/128GB Pink (no NFC)",
//       "Redmi 9 4/64GB Grey NFC",
//       "Redmi 9 4/64Gb Pink (no NFC)",
//       "Redmi 9 6/128GB Grey (no NFC)",
//       "Redmi 9A 2/32GB Granite Gray",
//       "Redmi 9C 2/32GB Midnight Gray",
//       "Redmi 9C 3/64GB Midnight Gray",
//       "Redmi 9C NFC 2/32GB Midnight Gray",
//       "Redmi 9C NFC 3/64GB Midnight Gray",
//       "Redmi 9T 4/128GB Twilight Blue",
//       "Redmi 9T 4/64GB Sunrise Orange",
//       "Redmi K30 6/128GB Purple",
//       "Redmi K30 8/128GB Purple",
//       "Redmi K30 8/256GB Red",
//       "Redmi K30 Pro 6/128GB White",
//       "Redmi Note 4 3/32GB (Gray)",
//       "Redmi Note 4 3/64GB (Gold)",
//       "Redmi Note 4 3/64GB (Gold)",
//       "Redmi Note 4x 3/32GB Black",
//       "Redmi Note 4x 4/64GB Black",
//       "Redmi Note 4x 4/64GB Gold",
//       "Redmi Note 5 3/32GB Black",
//       "Redmi Note 5 3/32GB Gold",
//       "Redmi Note 5 3/32GB Rose Gold",
//       "Redmi Note 5 4/64GB Gold",
//       "Redmi Note 6 Pro 3/32GB Blue",
//       "Redmi Note 6 Pro 4/64GB Blue",
//       "Redmi Note 6 Pro 4/64GB Rose Gold",
//       "Redmi Note 7 4/64GB Black",
//       "Redmi Note 8 3/32GB Blue",
//       "Redmi Note 8 4/128GB Black",
//       "Redmi Note 8 4/64GB Blue",
//       "Redmi Note 8 6/128GB Blue",
//       "Redmi Note 8 6/64GB White",
//       "Redmi Note 8 Pro 6/128GB Green",
//       "Redmi Note 8 Pro 6/64GB Green",
//       "Redmi Note 8 Pro 8/128GB White",
//       "Redmi Note 8T 3/32GB Grey",
//       "Redmi Note 8T 4/64GB Grey",
//       "Redmi Note 9 3/64GB Grey (no NFC)",
//       "Redmi Note 9 3/64GB Grey NFC",
//       "Redmi Note 9 4/128GB Grey NFC",
//       "Redmi Note 9 4/128GB White (no NFC)",
//       "Redmi Note 9 Pro 4/64GB Interstellar Grey",
//       "Redmi Note 9 Pro 6/128GB Grey",
//       "Redmi Note 9 Pro 6/64GB Green",
//       "Redmi Note 9S 4/64GB Grey",
//       "Redmi Note 9S 6/128GB Grey",
//       "Redmi Note 9T 4/128GB Nightfall Black",
//       "Redmi Note 9T 4/64GB Daybreak Purple"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "ZTE",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Blade 20 Smart 4/128GB Gradient Green",
//       "Blade A3 2020 1/32GB Blue",
//       "Blade A3 2020 1/32GB Grey",
//       "Blade A3 2020 1/32GB Red",
//       "Blade A5 2/16GB Black",
//       "Blade A5 2/16GB Blue",
//       "Blade A5 2/16GB Blue",
//       "Blade A5 2/32GB Black",
//       "Blade A5 2/32GB Blue",
//       "Blade A5 2020 2/32GB Black",
//       "Blade A7 2019 2/32GB Black",
//       "Blade A7 2020 2/32GB Gradient",
//       "Blade A7 2020 3/64GB Gradient",
//       "Blade A7S 2/64GB Blue",
//       "Blade L210 1/32GB Black",
//       "Blade L210 1/32GB Blue",
//       "Blade L210 1/32GB Blue",
//       "Blade L8 1/16GB Black",
//       "Blade L8 1/16GB Blue",
//       "Blade V2020 Smart 4/128GB Grey",
//       "Blade V2020 Smart 4/64GB Grey",
//       "Nubia Z17 8/64GB Black",
//       "Nubia Z17 8/64GB Black",
//       "nubia Red Magic 5G 8/128GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Oukitel",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "C18 Pro 4/64GB Purple",
//       "C19 2/16GB Black",
//       "C19 2/16GB Gradient Blue",
//       "C21 4/64GB Black",
//       "K12 6/64 Black",
//       "K12 6/64 Black",
//       "K13 4/64GB Black",
//       "K13 4/64GB Black",
//       "K13 4/64GB Pro Black",
//       "K13 Pro Leather Black",
//       "K9 4/64 Black",
//       "WP1 4/64GB Black",
//       "WP2 4/64GB Black",
//       "WP2 4/64GB Gold",
//       "WP5 3/32GB Black",
//       "WP5 Pro 4/64GB Black",
//       "WP6 4/128GB Black",
//       "WP6 6/128GB Black",
//       "WP7 8/128GB Black",
//       "WP8 Pro 4/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Cubot",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "C30 8/128GB Black",
//       "King Kong CS",
//       "King Kong CS",
//       "King Kong CS",
//       "Kingkong mini 3/32GB Red",
//       "Kingkong mini 3/32GB Yellow",
//       "Note 20 Pro 6/128GB Black",
//       "Note 20 Pro 8/128GB Black",
//       "P30 4/64GB Black",
//       "Quest 4/64GB Black",
//       "X19 4/64GB Black",
//       "X20 Pro 6/128GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "S-TELL",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "C552 Black",
//       "C552 Red",
//       "P760 Black",
//       "S1-07 Black",
//       "S1-07 Gold"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Sigma mobile",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Comfort 50 Elegance3 SIMO ASSISTANT Red",
//       "Comfort 50 Grand Black",
//       "Comfort 50 HIT 2020 Black",
//       "Comfort 50 SOLO Black",
//       "Comfort 50 SOLO Black",
//       "Comfort 50 Shell Duo Red (4827798212325)",
//       "X-STYLE 241 SNAP Black",
//       "X-TREME IO93",
//       "X-TREME IO93",
//       "X-TREME PQ39 ULTRA Black",
//       "X-TREME PQ39 ULTRA Black-Green",
//       "X-TREME PQ54 MAX",
//       "X-style 17 Update Black",
//       "X-style 18 TRACK Black",
//       "X-style 24 ONYX Grey",
//       "X-style 31 Power Black",
//       "X-style 31 Power Blue",
//       "X-style 31 Power Orange",
//       "X-style 31 Power Orange",
//       "X-style 31 Power Yellow",
//       "X-style 32 Boombox Black",
//       "X-style 32 Boombox Red",
//       "X-style 33 Steel Grey",
//       "X-style 33 Steel Red",
//       "X-style 34NRG Black",
//       "X-style 34NRG Blue",
//       "X-style 36 Point Black",
//       "X-style S3500 sKai Black",
//       "X-treme DT68 black",
//       "X-treme DT68 black-red",
//       "X-treme DZ68 Black",
//       "X-treme DZ68 Black-yellow",
//       "X-treme DZ68 Black-yellow",
//       "X-treme IT67m black-orange",
//       "X-treme PQ20 Black",
//       "X-treme PQ20 Black Orange",
//       "X-treme PQ20 Black Orange",
//       "X-treme PQ24 Black",
//       "X-treme PQ24 Black/Orange",
//       "X-treme PQ29 Black",
//       "X-treme PQ29 Black-Orange",
//       "X-treme PQ29 Black-Orange",
//       "X-treme PQ36 Black",
//       "X-treme PQ36 Orange",
//       "X-treme PQ39 Black",
//       "X-treme PQ52 Black-Orange",
//       "X-treme PQ53 Black",
//       "X-treme PQ54 Black (4827798865712)",
//       "X-treme PT68 Black",
//       "X-treme ST68 Black",
//       "X-treme ST68 black-yellow",
//       "x-style 35 Screen"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Coolpad",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Cool Play 6 6/64GB Black",
//       "Cool Play 6 6/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Bluboo",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "D6 Pro 2/16GB Black",
//       "D6 Pro 2/16GB Black",
//       "S1 Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "LG",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "D855 G3 32GB (Silk White)",
//       "D858 G3 Dual (Metallic Black)",
//       "G6 32GB Black (H870S.ACISBK)",
//       "G6 64GB Black (LGH870DS.ACISBK)",
//       "G6 64GB Platinum (LGH870DS.ACISPL)",
//       "G6 G600L 4/64GB Black",
//       "G6 G600L 4/64GB Black",
//       "G6 G600L 4/64GB Platinum",
//       "G6 Plus 128GB Gold",
//       "G6 Plus 128GB Gold",
//       "G7 ThinQ 4/64GB Aurora Black (LMG710EMW.ACISBK)",
//       "G7 ThinQ 4/64GB Moroccan Blue (LMG710EMW.ACISBL)",
//       "G7 ThinQ 4/64GB Platinum Gray",
//       "G7 ThinQ 4/64GB Raspberry Rose",
//       "G8 ThinQ 6/128GB Black",
//       "G8X ThinQ 6/128GB Aurora Black",
//       "G8s ThinQ 6/128GB White",
//       "H791 Nexus 5X 32GB (Mint)",
//       "H791 Nexus 5X 32GB (Mint)",
//       "H990 V20 Dual 64GB (Black)",
//       "H990 V20 Dual 64GB (Silver)",
//       "V40 ThinQ 4/64GB Aurora Black",
//       "V50 ThinQ 5G 6/128GB Single Sim Black",
//       "V50S ThinQ 5G 8/256GB Aurora Black",
//       "Velvet 5G LM-G900EM 6/128GB Aurora Gray",
//       "X Screen 16GB Single K500n White"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Motorola",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Droid Turbo 2 32GB (Ballistic Nylon Black)",
//       "Droid Turbo 2 32GB (Ballistic Nylon Black)",
//       "E6 Plus 4/64GB Polish Grey",
//       "E6 Plus XT2025-2 4/64GB Blue",
//       "E6S 4/64 GB Meteor Grey (PAJE0031RS)",
//       "E7 Plus 4/64GB Misty Blue (PAKX0008RS)",
//       "Edge 5G 6/128GB Dual Black (XT2063-3)",
//       "G7 4/64GB Ceramic Black (XT1962-6)",
//       "G8 Power 4/64GB Dual Sim Black (PAHF0007RS)",
//       "G8 Power Lite 4/64GB Royal Blue (PAJC0017RS)",
//       "G9 Play 4/64GB Sapphire Blue (PAKK0016RS)",
//       "G9 Plus 4/128GB Navy Blue (PAKM0019RS)",
//       "Moto C Plus XT1723 16GB Gold (PA800126UA)",
//       "Moto E4 (XT1762) Metallic Iron Gray (PA750058UA)",
//       "Moto E5 Plus XT1924-1 DualSim Black (PABA0014UA)",
//       "Moto E5 XT1944 16GB black",
//       "Moto G5 2/16GB Gold (PA610071UA)",
//       "Moto G5s (XT1794) Lunar Gray (PA7W0024UA)",
//       "Moto G5s (XT1794) Lunar Gray (PA7W0024UA)",
//       "Moto G5s XT1799 4/64GB Black (PA930008CN)",
//       "Moto G5s XT1799 4/64GB Black (PA930008CN)",
//       "Moto G6 Play XT1922-5 Dual Sim 32GB Indigo Blue",
//       "Moto G6 Plus XT1926 Dual Sim 64GB Indigo Blue",
//       "Moto G7 Play XT1952-2 Dual Sim 2/32GB Deep Indigo",
//       "Moto G7 Power XT1955-4 4/64GB Ceramic Black",
//       "Moto G7 Power XT1955-4 4/64GB Ceramic Black",
//       "Moto G8 4/64GB Blue (PAHL0004RS)",
//       "Moto G8 4/64GB Blue (PAHL0004RS)",
//       "Moto G8 4/64GB White (PAHL0010RS)",
//       "Moto G8 4/64GB White (PAHL0010RS)",
//       "Moto G8 Plus XT2019-1 4/64GB Dual Sim Cosmic Blue (PAGE0015RS)",
//       "Moto G9 Power 4/128GB Gray (PALR0020RS)",
//       "Moto M Grey (PA5D0075UA)",
//       "Moto X (2nd. Gen) (Black) 16GB",
//       "Moto X Force (Black)",
//       "Moto X4 3/32GB Black (PA8X0004UA)",
//       "Moto Z 32GB Black (SM4389AE7U1)",
//       "Moto Z 32GB Black (SM4389AE7U1)",
//       "Moto Z 32GB Black (SM4389AE7U1)",
//       "Moto Z 32GB White/Gold (SM4389AD1U1)",
//       "Moto Z2 Force 6/64GB Black (PA900007UA)",
//       "Moto Z2 Force SS 4/64GB Fine Gold",
//       "Moto Z2 Play Fine Gold (SM4482AJ1K7)",
//       "Moto Z2 Play Lunar Grey (SM4482AC3K7)",
//       "Moto Z3 Play 4/64GB Deep Indgo",
//       "Moto Z4 4/128GB Flash Gray",
//       "Moto Z4 4/128GB Flash Gray",
//       "Nexus 6 32GB (Cloud White)",
//       "One Action 4/128GB XT2013-2 Blue",
//       "One Action 4/128GB XT2013-2 White",
//       "One Fusion 4/64GB Deep Sapphire Blue",
//       "One Fusion+ 6/128GB Blue (PAJW0006RS)",
//       "One Hyper XT2027-1 4/128GB Deep Sea Blue",
//       "One Macro XT2016-1 4/64GB Blue",
//       "One Power XT1942-1 4/64GB Dual Sim Black",
//       "One Vision 4/128GB Bronze",
//       "One Vision 4/128GB Sapphire Blue",
//       "One XT1941-4 4/64GB Dual Sim Black",
//       "One Zoom 4/128GB Grey",
//       "One Zoom 4/128GB Purple",
//       "RAZR 2019 XT200-1 Noir Black",
//       "RAZR 2019 XT2000-2 Noir Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Philips",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "E169 Gray",
//       "E169 Red",
//       "S260 Black",
//       "S561 3/32GB Black",
//       "Xenium E106 Black",
//       "Xenium E109 Black",
//       "Xenium E182 Blue",
//       "Xenium E255 Black",
//       "Xenium E255 Blue",
//       "Xenium E255 Red",
//       "Xenium E580 Dual Sim Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "2E",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "E180 2019 Red (680576170057)",
//       "E240 Black",
//       "E240 Power DualSim Black (680576170088)",
//       "E240 Power DualSim Black (680576170088)",
//       "E280 Dual Sim Black",
//       "E450A 2018 DualSim Black",
//       "E450R DualSim Gray",
//       "E500A 2019 DualSim Black",
//       "F534L 2018 DualSim Black",
//       "F534L 2018 DualSim Gold",
//       "F572L 2018 DualSim Red",
//       "F572L 2018 DualSim Silver",
//       "R240 Dual Sim Black",
//       "S180 DualSim Red"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Fly",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "FF243 (Black)",
//       "FF249 Dual Sim Black",
//       "FF250 Black",
//       "FF281 Dual Sim (Black)",
//       "FF281 Silver"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Samsung",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "G920F Galaxy S6 32GB (White Pearl)",
//       "G925F Galaxy S6 Edge 32GB (White Pearl)",
//       "G935FD Galaxy S7 Edge 32GB Gold (SM-G935FZDU)",
//       "Galaxy A01 2/16GB Black (SM-A015FZKD)",
//       "Galaxy A01 Core 1/16GB Black (SM-A013FZKD)",
//       "Galaxy A02s 3/32GB Blue (SM-A025FZBE)",
//       "Galaxy A10s 2019 SM-A107F 2/32GB Black (SM-A107FZKD)",
//       "Galaxy A11 2/32GB Black (SM-A115FZKN)",
//       "Galaxy A12 SM-A125F 3/32GB Black (SM-A125FZKUSEK)",
//       "Galaxy A12 SM-A125F 4/64GB Black (SM-A125FZKVSEK)",
//       "Galaxy A2 Core 2019 SM-A260 1/16GB Blue",
//       "Galaxy A2 Core 2019 SM-A260 1/16GB Blue",
//       "Galaxy A20e SM-A202F 3/32GB Black SM-A202FZKD",
//       "Galaxy A20e SM-A202F 3/32GB White (SM-A202FZWD)",
//       "Galaxy A20s 2019 A207F 3/32GB Black (SM-A207FZKD)",
//       "Galaxy A21s 3/32GB Black (SM-A217FZKN)",
//       "Galaxy A30s 3/32GB Black (SM-A307FZKU)",
//       "Galaxy A30s 4/128GB White",
//       "Galaxy A30s 4/128GB White",
//       "Galaxy A30s 4/64GB Green (SM-A307FZGV)",
//       "Galaxy A31 4/128GB Black (SM-A315FZKV)",
//       "Galaxy A31 4/64GB Black (SM-A315FZKU)",
//       "Galaxy A41 4/64GB Black (SM-A415FZKD)",
//       "Galaxy A50 2019 SM-A505F 4/128GB Black",
//       "Galaxy A50 2019 SM-A505F 4/64GB Blue (SM-A505FZBU)",
//       "Galaxy A50 2019 SM-A505F 6/128GB Blue (SM-A505FZBQ)",
//       "Galaxy A50s 2019 SM-A507FD 6/128GB Black",
//       "Galaxy A50s 2019 SM-A507FD 6/128GB Black",
//       "Galaxy A50s 2019 SM-A507FD 6/128GB Black",
//       "Galaxy A50s SM-A5070 6/128GB Prism Crush Green",
//       "Galaxy A51 2020 4/64GB Black (SM-A515FZKU)",
//       "Galaxy A51 2020 6/128GB Blue (SM-A515FZBW)",
//       "Galaxy A51 SM-A515F 2020 8/128GB Blue",
//       "Galaxy A51 SM-A515F 4/128GB Black",
//       "Galaxy A51 SM-A515F 6/128GB Metallic Silver (SM-A515FMSW)",
//       "Galaxy A6+ 3/32GB Gold (SM-A605FZDN)",
//       "Galaxy A6+ 3/32GB Lavender",
//       "Galaxy A6+ 4/32GB Gold",
//       "Galaxy A7 2018 4/64GB Black (SM-A750FZKU)",
//       "Galaxy A7 2018 4/64GB Blue (SM-A750FZBU)",
//       "Galaxy A70 2019 SM-A7050 6/128GB Black",
//       "Galaxy A70 2019 SM-A7050 6/128GB Blue",
//       "Galaxy A70 2019 SM-A7050 6/128GB Blue",
//       "Galaxy A70 2019 SM-A7050 6/128GB Blue",
//       "Galaxy A70 2019 SM-A705F 6/128GB Black (SM-A705FZKU)",
//       "Galaxy A71 2020 6/128GB Black (SM-A715FZKU)",
//       "Galaxy A71 2020 SM-A715F 8/128GB Blue",
//       "Galaxy A8+ 2018 32GB Gold (SM-A730FZDD)",
//       "Galaxy A8+ 2018 32GB Orchid Gray (SM-A730FZVD)",
//       "Galaxy A8+ 2018 32GB Orchid Gray (SM-A730FZVD)",
//       "Galaxy A8+ 2018 4/64GB Orchid Gray",
//       "Galaxy A80 2019 8/128GB Black (SM-A805FZKD)",
//       "Galaxy A80 2019 A8050 8/128GB Black",
//       "Galaxy A9 2018 6/128Gb Blue (SM-A920FZBD)",
//       "Galaxy Fold 12/256GB Black",
//       "Galaxy Fold 12/512GB Black (SM-F900FZKD)",
//       "Galaxy Fold 5G SM-F907B 12/512GB Black",
//       "Galaxy Fold 5G SM-F907B 12/512GB Silver",
//       "Galaxy J6 2018 2/32GB Gold (SM-J600FZDD)",
//       "Galaxy M10 SM-M105F 2/16GB Black (SM-M105GDAG)",
//       "Galaxy M10 SM-M105F 2/16GB Black (SM-M105GDAG)",
//       "Galaxy M10 SM-M105F 2/16GB Black (SM-M105GDAG)",
//       "Galaxy M10 SM-M105F 3/32GB Black",
//       "Galaxy M10 SM-M105F 3/32GB Black",
//       "Galaxy M10 SM-M105F 3/32GB Blue",
//       "Galaxy M10S M107F 3/32GB Black",
//       "Galaxy M115 M11 3/32 Black (SM-M115FZKN)",
//       "Galaxy M21 4/64GB Black (SM-M215FZKU)",
//       "Galaxy M30 SM-M305F 4/64GB Gradation Blue",
//       "Galaxy M31 6/128GB Black (SM-M315FZKU)",
//       "Galaxy M31s 6/128GB Blue (SM-M317FZBN)",
//       "Galaxy M51 6/128GB Black (SM-M515FZKD)",
//       "Galaxy Note 10 SM-N9700 8/256GB Black (SM-N9700ZKD)",
//       "Galaxy Note 10 SM-N9700 8/256GB White",
//       "Galaxy Note 10 SM-N970F 8/256GB Black (SM-N970FZKD)",
//       "Galaxy Note 10+ SM-N9750 12/256GB Aura Glow",
//       "Galaxy Note 10+ SM-N9750 12/512GB Black",
//       "Galaxy Note 10+ SM-N975F 12/256GB Black (SM-N975FZKD)",
//       "Galaxy Note 10+ SM-N975F 12/512GB Aura Black",
//       "Galaxy Note 8 64GB Gold",
//       "Galaxy Note 8 N950F Single sim 128GB Black",
//       "Galaxy Note 8 N950F Single sim 128GB Black",
//       "Galaxy Note 9 N960 6/128GB Metallic Copper",
//       "Galaxy Note 9 N960 8/512GB Lavender Purple",
//       "Galaxy Note 9 N960 8/512GB Lavender Purple",
//       "Galaxy Note 9 N960 8/512GB Lavender Purple",
//       "Galaxy Note 9 N960 8/512GB Metallic Copper",
//       "Galaxy Note 9 N960 8/512GB Midnight Black",
//       "Galaxy Note 9 N960 8/512GB Ocean Blue (SM-N960FZBH)",
//       "Galaxy Note10 Lite SM-N770F Dual 6/128GB Black (SM-N770FZKD)",
//       "Galaxy Note10 Lite SM-N770F Dual 8/128GB Black (SM-N770FZKU)",
//       "Galaxy Note20 5G N9810 8/256GB Mystic Gray",
//       "Galaxy Note20 5G SM-N981B 8/256GB Mystic Bronze",
//       "Galaxy Note20 SM-N980F 8/256GB Mystic Green (SM-N980FZGG)",
//       "Galaxy Note20 Ultra 5G SM-N9860 12/256GB Mystic Black",
//       "Galaxy Note20 Ultra 5G SM-N986B 12/256GB Mystic Black",
//       "Galaxy Note20 Ultra 5G SM-N986B 12/512GB Mystic Black (SM-N986BZKH)",
//       "Galaxy Note20 Ultra SM-N985F 8/256GB Mystic Bronze (SM-N985FZNG)",
//       "Galaxy S10 Lite SM-G770 6/128GB Black (SM-G770FZKG)",
//       "Galaxy S10 Lite SM-G770 8/128GB Black",
//       "Galaxy S10 SM-G973 DS 128GB Green (SM-G973FZGD)",
//       "Galaxy S10 SM-G973 DS 512GB Black",
//       "Galaxy S10 SM-G9730 DS 128GB Black",
//       "Galaxy S10+ SM-G975 DS 128GB Black (SM-G975FZKD)",
//       "Galaxy S10+ SM-G975 DS 1TB Black (SM-G975FCKH)",
//       "Galaxy S10+ SM-G975 DS 1TB Ceramic White (SM-G975FCWH)",
//       "Galaxy S10+ SM-G975 DS 512GB Black (SM-G975FCKG)",
//       "Galaxy S10+ SM-G975 DS 512GB White (SM-G975FCWG)",
//       "Galaxy S10+ SM-G975 SS 512GB White",
//       "Galaxy S10+ SM-G975 SS 512GB White",
//       "Galaxy S10+ SM-G9750 DS 128GB Black",
//       "Galaxy S10+ SM-G9750 DS 128GB Black",
//       "Galaxy S10+ SM-G9750 DS 1TB Black",
//       "Galaxy S10e SM-G970 DS 128GB Black (SM-G970FZKD)",
//       "Galaxy S10e SM-G9700 DS 128GB Black",
//       "Galaxy S20 5G SM-G981 12/128GB Cosmic Gray",
//       "Galaxy S20 5G SM-G9810 12/128GB Cloud Pink",
//       "Galaxy S20 FE 5G SM-G7810 8/128GB Cloud Navy",
//       "Galaxy S20 FE 5G SM-G7810 Dual 8/256GB Cloud Navy",
//       "Galaxy S20 FE 5G SM-G781B 6/128GB Cloud Red",
//       "Galaxy S20 FE 5G SM-G781B 8/128GB Cloud Red",
//       "Galaxy S20 FE SM-G780F 6/128GB Blue (SM-G780FZBD)",
//       "Galaxy S20 FE SM-G780F 6/256GB Cloud Navy",
//       "Galaxy S20 FE SM-G780F 8/128GB Cloud Navy",
//       "Galaxy S20 FE SM-G780F 8/256GB Blue (SM-G780FZBH)",
//       "Galaxy S20 SM-G980 8/128GB Grey (SM-G980FZAD)",
//       "Galaxy S20 Ultra 5G SM-G9880 12/256GB Cosmic Gray",
//       "Galaxy S20 Ultra 5G SM-G988B 12/128GB Black",
//       "Galaxy S20 Ultra SM-G988 128GB Grey (SM-G988BZAD)",
//       "Galaxy S20+ 5G SM-G9860 12/128GB Cosmic Black",
//       "Galaxy S20+ 5G SM-G9860 8/128GB Gray",
//       "Galaxy S20+ 5G SM-G9860 8/128GB Gray",
//       "Galaxy S20+ 5G SM-G986B 12/128GB Black",
//       "Galaxy S20+ 5G SM-G986F-DS 12/128GB Black",
//       "Galaxy S20+ LTE SM-G985 Dual 8/128GB Black (SM-G985FZKD)",
//       "Galaxy S21 8/128GB Phantom Grey (SM-G991BZADSEK)",
//       "Galaxy S21 8/256GB Phantom Grey (SM-G991BZAGSEK)",
//       "Galaxy S21 Ultra 12/128GB Phantom Black (SM-G998BZKDSEK)",
//       "Galaxy S21 Ultra 12/256GB Phantom Black (SM-G998BZKGSEK)",
//       "Galaxy S21 Ultra 16/512GB Phantom Black (SM-G998BZKHSEK)",
//       "Galaxy S21+ 8/128GB Phantom Black (SM-G996BZKDSEK)",
//       "Galaxy S21+ 8/256GB Phantom Black (SM-G996BZKGSEK)",
//       "Galaxy S7 G930F 32GB (Black)",
//       "Galaxy S7 G930F 32GB (Gold)",
//       "Galaxy S8 64GB Blue",
//       "Galaxy S8 G950F Single Sim 64GB Black",
//       "Galaxy S8+ 64GB Black (SM-G955FZKD)",
//       "Galaxy S8+ SM-G955U 64GB Black",
//       "Galaxy S9 SM-G960 DS 128GB Black (SM-G960FZKG)",
//       "Galaxy S9 SM-G960 DS 128GB Black (SM-G960FZKG)",
//       "Galaxy S9 SM-G960 DS 128GB Black (SM-G960FZKG)",
//       "Galaxy S9 SM-G960 DS 128GB Blue",
//       "Galaxy S9 SM-G960 DS 128GB Blue",
//       "Galaxy S9 SM-G960 DS 128GB Grey (SM-G960FZAG)",
//       "Galaxy S9 SM-G960 DS 128GB Purple (SM-G960FZPG)",
//       "Galaxy S9 SM-G960 DS 64GB Black (SM-G960FZKD)",
//       "Galaxy S9 SM-G960U1 128GB Purple",
//       "Galaxy S9+ SM-G965 DS 128GB Black",
//       "Galaxy S9+ SM-G965 DS 128GB Blue",
//       "Galaxy S9+ SM-G965 DS 128GB Grey",
//       "Galaxy S9+ SM-G965 DS 128GB Purple",
//       "Galaxy S9+ SM-G965 DS 256GB Black (SM-G965FZKH)",
//       "Galaxy S9+ SM-G965 DS 64GB Black (SM-G965FZKD)",
//       "Galaxy Z Flip 5G SM-F707 8/256GB Mystic Bronze",
//       "Galaxy Z Flip SM-F700 8/256GB Mirror Purple (SM-F700FZPD)",
//       "Galaxy Z Fold2 12/256GB Mystic Black (SM-F916BZKQ)",
//       "N920C Galaxy Note 5 32GB (Gold Platinum)",
//       "X Cover 4s G398F (SM-G398FZKD)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Prestigio",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Grace A1 1281 Dual Sim Red (PFP1281DUORED)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "myPhone",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Hammer Energy Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "BlackBerry",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "KEYone"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "KENEKSI",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "M1 Art (Red)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Maxcom",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "MM111",
//       "MM111",
//       "MM135 Black-Blue",
//       "MM142 Black",
//       "MM236 Black-Silver",
//       "MM320 Black",
//       "MM320 Black",
//       "MM426 Black",
//       "MM471 White",
//       "MM720 Black",
//       "MM817 Black",
//       "MM817 Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "HUAWEI",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Mate 10 6/128GB Gold",
//       "Mate 10 6/256GB Porsche Design",
//       "Mate 20 DS 6/64GB Black",
//       "Mate RS Porsche Design 6/256GB Black",
//       "Mate Xs 8/512GB Interstellar blue (51095CSQ)",
//       "Nova 4 8/128GB Black",
//       "P Smart 2020 4/128GB Emerald Green",
//       "P Smart Pro 6/128GB Midnight Black (51094UVB)",
//       "P Smart S 4/128GB Breathing Crystal (51095HVM)",
//       "P smart 2019 3/64GB Black (51093FSW)",
//       "P smart 2021 4/128GB Midnight Black (51096ABV)",
//       "P smart Z 4/64GB Emerald Green (51093WVK)",
//       "P smart+ 4/64GB Black (51092TFB)",
//       "P30 6/128GB Black (51093NDK)",
//       "P30 8/128GB Black",
//       "P30 Lite 4/128GB Breathing Crystal",
//       "P30 Lite 6/256GB Peacock Blue",
//       "P30 Pro 6/128GB Black (51093TFT)",
//       "P30 Pro 8/128GB Aurora",
//       "P30 Pro 8/256GB Black (51093NFN)",
//       "P30 Pro NEW EDITION 8/256GB Silver Frost",
//       "P40 8/128GB Black (51095EHY)",
//       "P40 Pro 8/256GB Silver Frost (51095CAL)",
//       "P40 Pro+ 8/512GB Black Ceramic",
//       "P40 Pro+ 8/512GB Black Ceramic",
//       "P40 lite 6/128GB Crush Green (51095CJX)",
//       "P40 lite E 4/64GB Midnight Black (51095DCE)",
//       "P8 Prestige Gold",
//       "P8 Prestige Gold",
//       "Y5 2019 2/16GB Black (51093SHA)",
//       "Y5 2019 2/16GB Black (51093SHA)",
//       "Y5 2019 2/16GB Brown (51093SHE)",
//       "Y5p 2/32GB Mint Green (51095MUB)",
//       "Y6 2019 DS Amber Brown (51093PMR)",
//       "Y6 2019 DS Amber Brown (51093PMR)",
//       "Y6 2019 DS Blue",
//       "Y6 2019 DS Blue",
//       "Y6 2019 DS Midnight Black (51093PMP)",
//       "Y6 Prime 2018 3/32GB Gold (51092MFF)",
//       "Y6 Prime 2018 3/32GB Gold (51092MFF)",
//       "Y6 Pro (Gold)",
//       "Y6p 3/64GB Midnight Black (51095KYP)",
//       "Y6s 3/32GB Orhid Blue (51094WBU)",
//       "Y6s 3/32GB Orhid Blue (51094WBU)",
//       "Y6s 3/32GB Starry Black (51094WBW)",
//       "Y7 2019 3/32GB Coral Red (51093HEW)",
//       "Y7 2019 3/32GB Coral Red (51093HEW)",
//       "Y7 Prime 2018 3/32GB Black (51092JHA)",
//       "nova 5T 6/128GB Black (51094MEU)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Vernee",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Mix 2 M2 4/64GB Black",
//       "Mix 2 M2 4/64GB Blue",
//       "T3 Pro 3/16GB Black",
//       "T3 Pro 3/16GB Black",
//       "X 4/64GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "General",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Mobile GM8 Space Gray"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Globex",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Neon A1",
//       "Neon A1"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Smartex",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "P600 Black",
//       "P600 Gold"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Google",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Pixel 128GB (Quite Black)",
//       "Pixel 2 128GB Just Black",
//       "Pixel 2 64GB Just Black",
//       "Pixel 2 XL 64GB Just Black",
//       "Pixel 3 4/128GB Just Black",
//       "Pixel 3 4/64GB Just Black",
//       "Pixel 3 XL 4/64GB Just Black",
//       "Pixel 32GB (Quite Black)",
//       "Pixel 3a 4/64GB Just Black",
//       "Pixel 3a XL 4/64GB Just Black",
//       "Pixel 4 6/64GB Just Black",
//       "Pixel 4 XL 6/128GB Just Black",
//       "Pixel 4 XL 6/64GB Oh So Orange",
//       "Pixel 4a 5G 6/128GB Just Black",
//       "Pixel 4a 6/128GB Just Black",
//       "Pixel 5 8/128GB Just Black",
//       "Pixel XL 128GB (Quite Black)",
//       "Pixel XL 128GB (Quite Black)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "ASUS",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "ROG Phone 3 Strix 12/128GB Black (90AI0031-M00010)",
//       "ROG Phone 3 ZS661KS 12/128GB Black (90AI0032-M00180)",
//       "ROG Phone 3 ZS661KS 12/256GB Black",
//       "ROG Phone 3 ZS661KS 12/512GB Black",
//       "ROG Phone 8/512GB DualSim Black",
//       "ROG Phone 8/512GB DualSim Black",
//       "ROG Phone 8/512GB DualSim Black",
//       "ZenFone Live ZB501KL Navy Black (ZB501KL-4A053A)",
//       "Zenfone 5 ZE620KL 4/64GB Blue (ZE620KL-1A012WW)",
//       "Zenfone 7 Pro ZS671KS 8/256GB Black",
//       "Zenfone 7 ZS670KS 8/128GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Land",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Rover Tank T3 KUH Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "MAFAM",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "SUN6 Blue"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Jinga",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Simple F200n Black",
//       "Simple F200n Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Vodafone",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Smart Ultra Dark Gray"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Microsoft",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Surface Duo 6GB/256GB (TGM-00001)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "iOutdoor",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "T1 Yellow",
//       "T1 Yellow"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Elephone",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "U 6/128GB Black",
//       "U3H 8/256GB Black",
//       "U3H 8/256GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "HTC",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "U11 4/64GB Black 99HAMB075-00",
//       "U11 4/64GB White",
//       "U20 5G 8/256GB White"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Viaan",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "V182 Black",
//       "V241 (Black)",
//       "V281 Black",
//       "V281 Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "vivo",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "V20 8/128GB Midnight Jazz",
//       "V20 8/128GB Sunset Melody",
//       "V20 SE 8/128GB Gravity Black",
//       "X50 8/128GB Frost Blue",
//       "X50 8/128GB Graze Black",
//       "X50 Pro 8/256GB Alpha Grey",
//       "Y11 3/32GB Agate Red",
//       "Y15 4/64GB Aqua Blue",
//       "Y15 4/64GB Aqua Blue",
//       "Y15 4/64GB Burgundy Red",
//       "Y19 4/128GB Black",
//       "Y1S 2/32GB Black",
//       "Y1S 2/32GB Blue",
//       "Y20 4/64GB Nebula Blue",
//       "Y20 4/64GB Obsidian Black",
//       "Y30 4/64GB Black",
//       "Y30 4/64GB Blue"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Sony",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Xperia 1 II XQ-AT51 8/256GB Black",
//       "Xperia 1 II XQ-AT51 8/256GB Black",
//       "Xperia 1 II XQ-AT52 12/256GB Mirror Lake Green",
//       "Xperia 1 II XQ-AT52 8/256GB Purple",
//       "Xperia 1 J9110 Black",
//       "Xperia 10 I4113 Black",
//       "Xperia 10 II 4/128GB Mint",
//       "Xperia 5 II 8/128GB Black",
//       "Xperia 5 II 8/256GB Blue",
//       "Xperia 5 J9210 6/128GB Black",
//       "Xperia C5 Ultra Dual E5533 (Black)",
//       "Xperia XA1 Dual (G3112) Black",
//       "Xperia XA1 Dual (G3112) Black",
//       "Xperia XZ (Black)",
//       "Xperia XZ (Blue)",
//       "Xperia XZ (Blue)",
//       "Xperia XZ Dual F8332 (Black)",
//       "Xperia Z (Black)",
//       "Xperia Z5 Dual E6683 (White)",
//       "Xperia Z5 Premium E6853 (Black)"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "LEAGOO",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "Xrover C 2/16GB Black"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Nomi",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "i144c Black",
//       "i144c Red",
//       "i144c Red",
//       "i144m Black",
//       "i144m Blue",
//       "i187 Black",
//       "i187 Black",
//       "i187 White",
//       "i189 Black",
//       "i189 Blue",
//       "i220 Black",
//       "i220 Red",
//       "i240 (Black)",
//       "i2400 Black",
//       "i2400 Black",
//       "i2400 Red",
//       "i2401 Red",
//       "i2410 Grey",
//       "i2410 Grey",
//       "i248 Black",
//       "i281 Black",
//       "i281 Black",
//       "i281 Red",
//       "i282 Grey",
//       "i283 Red",
//       "i284 Black",
//       "i284 Red",
//       "i284 Violet-blue",
//       "i285 X-Treme Black-Yellow"
//     ]
//   },
//   {
//     "name": "Modèle",
//     "customFieldId": "648c4b8b22c363887daf48cc",
//     "customFieldValue": "Apple",
//     "category": "Telephonie-et-Multimedia",
//     "subcategory": "Phones",
//     "type": "select",
//     "options": [
//       "iPhone 11 128GB Black (MWLE2)",
//       "iPhone 11 128GB Dual Sim Black (MWN72)",
//       "iPhone 11 128GB Slim Box Black (MHDH3)",
//       "iPhone 11 256GB Black (MWLL2)",
//       "iPhone 11 256GB Slim Box Black (MHDP3)",
//       "iPhone 11 64GB Black (MWLT2)",
//       "iPhone 11 64GB Dual Sim White (MWN12)",
//       "iPhone 11 64GB Slim Box Black (MHDA3)",
//       "iPhone 11 Pro 256GB Dual Sim Midnight Green (MWDH2)",
//       "iPhone 11 Pro 256GB Midnight Green (MWCQ2)",
//       "iPhone 11 Pro 512GB Dual Sim Silver (MWDK2)",
//       "iPhone 11 Pro 512GB Midnight Green (MWCV2)",
//       "iPhone 11 Pro 64GB Dual Sim Silver (MWDA2)",
//       "iPhone 11 Pro 64GB Space Gray (MWC22/MWCH2)",
//       "iPhone 11 Pro Max 256GB Dual Sim Gold (MWF32)",
//       "iPhone 11 Pro Max 256GB Midnight Green (MWH72)",
//       "iPhone 11 Pro Max 512GB Dual Sim Silver (MWF62)",
//       "iPhone 11 Pro Max 512GB Space Gray (MWH82)",
//       "iPhone 11 Pro Max 64GB Dual Sim Space Gray (MWEV2)",
//       "iPhone 11 Pro Max 64GB Dual Sim Space Gray (MWEV2)",
//       "iPhone 11 Pro Max 64GB Space Gray (MWGY2; MWHD2)",
//       "iPhone 12 128GB Black (MGJA3/MGHC3)",
//       "iPhone 12 128GB Dual Sim Black (MGGU3)",
//       "iPhone 12 256GB Black (MGJG3/MGHH3)",
//       "iPhone 12 256GB Dual Sim Black (MGH13)",
//       "iPhone 12 64GB Blue (MGJ83/MGH93)",
//       "iPhone 12 64GB Dual Sim (PRODUCT)RED (MGGP3)",
//       "iPhone 12 Pro 128GB Dual Sim Pacific Blue (MGLD3)",
//       "iPhone 12 Pro 128GB Pacific Blue (MGMN3/MGLR3)",
//       "iPhone 12 Pro 256GB Dual Sim Pacific Blue (MGLH3)",
//       "iPhone 12 Pro 256GB Pacific Blue (MGMT3/MGLW3)",
//       "iPhone 12 Pro 512GB Dual Sim Pacific Blue (MGLM3)",
//       "iPhone 12 Pro 512GB Pacific Blue (MGMX3/MGM43)",
//       "iPhone 12 Pro Max 128GB Dual Sim Graphite (MGC03)",
//       "iPhone 12 Pro Max 128GB Graphite (MGD73)",
//       "iPhone 12 Pro Max 256GB Dual Sim Pacific Blue (MGC73)",
//       "iPhone 12 Pro Max 256GB Pacific Blue (MGDF3)",
//       "iPhone 12 Pro Max 512GB Dual Sim Pacific Blue (MGCE3)",
//       "iPhone 12 Pro Max 512GB Pacific Blue (MGDL3)",
//       "iPhone 12 mini 128GB Black (MGE33)",
//       "iPhone 12 mini 256GB Black (MGE93)",
//       "iPhone 12 mini 64GB Black (MGDX3)",
//       "iPhone 5C 32GB (White)",
//       "iPhone 5C 8GB (White)",
//       "iPhone 5S 16GB Space Gray (ME432)",
//       "iPhone 5S 32GB (Space Gray)",
//       "iPhone 6 128GB (Gold)",
//       "iPhone 6 16GB Space Gray (MG472)",
//       "iPhone 6 32GB Space Grey (MQ3D2)",
//       "iPhone 6 64GB Space Gray (MG4F2)",
//       "iPhone 6 Plus 128GB (Space Gray)",
//       "iPhone 6 Plus 16GB (Silver)",
//       "iPhone 6 Plus 64GB Space Gray (MGAH2)",
//       "iPhone 6s 128GB Space Gray (MKQT2)",
//       "iPhone 6s 128GB Space Gray (MKQT2)",
//       "iPhone 6s 16GB Space Gray (MKQJ2)",
//       "iPhone 6s 32GB Space Gray (MN0W2)",
//       "iPhone 6s 64GB Space Gray (MKQN2)",
//       "iPhone 6s Plus 16GB Space Gray (MKU12)",
//       "iPhone 6s Plus 32GB Space Gray (MN2V2)",
//       "iPhone 6s Plus 64GB Space Gray (MKU62)",
//       "iPhone 7 128GB Jet Black (MN962)",
//       "iPhone 7 256GB Black (MN972)",
//       "iPhone 7 256GB Black (MN972)",
//       "iPhone 7 32GB Black (MN8X2)",
//       "iPhone 7 Plus 128GB Black (MN4M2)",
//       "iPhone 7 Plus 256GB Rose Gold (MN502)",
//       "iPhone 7 Plus 32GB Black (MNQM2)",
//       "iPhone 7 Plus 32GB Black (MNQM2)",
//       "iPhone 8 128GB Gold (MX182)",
//       "iPhone 8 256GB Space Gray (MQ7F2)",
//       "iPhone 8 64GB Space Gray (MQ6G2)",
//       "iPhone 8 Plus 128GB Gold (MX262)",
//       "iPhone 8 Plus 256GB Space Gray (MQ8G2)",
//       "iPhone 8 Plus 64GB Space Gray (MQ8L2)",
//       "iPhone SE 128GB Space Grey (MP862)",
//       "iPhone SE 16GB Space Gray (MLLN2)",
//       "iPhone SE 2020 128GB Black (MXD02/MXCW2)",
//       "iPhone SE 2020 128GB Slim Box Black (MHGT3)",
//       "iPhone SE 2020 256GB Black (MXVT2/MXVP2)",
//       "iPhone SE 2020 256GB Slim Box White (MHGX3)",
//       "iPhone SE 2020 64GB Black (MX9R2/MX9N2)",
//       "iPhone SE 2020 64GB Slim Box Black (MHGP3)",
//       "iPhone SE 32GB Space Grey (MP822)",
//       "iPhone SE 64GB Space Gray (MLM62)",
//       "iPhone SE 64GB Space Gray (MLM62)",
//       "iPhone X 256GB Silver (MQAG2)",
//       "iPhone X 64GB Space Gray (MQAC2)",
//       "iPhone XR 128GB Black (MRY92)",
//       "iPhone XR 128GB Slim Box Black (MH7L3)",
//       "iPhone XR 256GB Black (MRYJ2)",
//       "iPhone XR 64GB Black (MRY42)",
//       "iPhone XR 64GB Slim Box Black (MH6M3)",
//       "iPhone XR Dual Sim 128GB Black (MT192)",
//       "iPhone XR Dual Sim 64GB Black (MT122)",
//       "iPhone XS 256GB Gold (MT9K2)",
//       "iPhone XS 512GB Silver (MT9M2)",
//       "iPhone XS 64GB Space Gray (MT9E2)",
//       "iPhone XS Max 256GB Gold (MT552)",
//       "iPhone XS Max 512GB Space Gray (MT622)",
//       "iPhone XS Max 64GB Gold (MT522)",
//       "iPhone XS Max Dual Sim 64GB Gold (MT732)"
//     ]
//   }
// ]
// const addPhones = async() => {
//   for (let i = 0; i < phones.length; i++) {
      
      
//           const phone = new SubCustomField(phones[i]);
//           await phone.save();
//       }
//   };

// addPhones();
                const secteurs = [
 
                    {
                     "name": "AGADIR",
                     "city": "1"
                    },
                    {
                     "name": "AKSRI",
                     "city": "1"
                    },
                    {
                     "name": "AMSKROUD",
                     "city": "1"
                    },
                    {
                     "name": "AOURIR",
                     "city": "1"
                    },
                    {
                     "name": "AZIAR",
                     "city": "1"
                    },
                    {
                     "name": "BENSERGAO",
                     "city": "1"
                    },
                    {
                     "name": "DRARGUA",
                     "city": "1"
                    },
                    {
                     "name": "IDMINE",
                     "city": "1"
                    },
                    {
                     "name": "IMOUZZER IDA OU TANANE",
                     "city": "1"
                    },
                    {
                     "name": "IMSOUANE",
                     "city": "1"
                    },
                    {
                     "name": "SEBT ASSAKA",
                     "city": "1"
                    },
                    {
                     "name": "TAALAT",
                     "city": "1"
                    },
                    {
                     "name": "TADRART",
                     "city": "1"
                    },
                    {
                     "name": "TAGHAZOUTE",
                     "city": "1"
                    },
                    {
                     "name": "TAMRAGHT",
                     "city": "1"
                    },
                    {
                     "name": "TAMRI",
                     "city": "1"
                    },
                    {
                     "name": "TIKIOUINE",
                     "city": "1"
                    },
                    {
                     "name": "TIQQI",
                     "city": "1"
                    },
                    {
                     "name": "AL HOCEIMA",
                     "city": "16"
                    },
                    {
                     "name": "ABDELGHAYA SOUAHEL",
                     "city": "16"
                    },
                    {
                     "name": "AIN BENABBOU",
                     "city": "16"
                    },
                    {
                     "name": "AIT KAMRA",
                     "city": "16"
                    },
                    {
                     "name": "AIT YOUSSEF OU ALI",
                     "city": "16"
                    },
                    {
                     "name": "AJDIR",
                     "city": "16"
                    },
                    {
                     "name": "ARBAA TAOURIRT",
                     "city": "16"
                    },
                    {
                     "name": "BENI GMIL MESTASSA",
                     "city": "16"
                    },
                    {
                     "name": "BNI ABDALLAH",
                     "city": "16"
                    },
                    {
                     "name": "BNI AHMED IMOUKZAN",
                     "city": "16"
                    },
                    {
                     "name": "BNI AMMART",
                     "city": "16"
                    },
                    {
                     "name": "BNI BCHIR",
                     "city": "16"
                    },
                    {
                     "name": "BNI BOUAYACH",
                     "city": "16"
                    },
                    {
                     "name": "BNI BOUCHIBET",
                     "city": "16"
                    },
                    {
                     "name": "BNI BOUFRAH",
                     "city": "16"
                    },
                    {
                     "name": "BNI BOUNSAR",
                     "city": "16"
                    },
                    {
                     "name": "BNI GMIL MAKSOULINE",
                     "city": "16"
                    },
                    {
                     "name": "BNI HADIFA",
                     "city": "16"
                    },
                    {
                     "name": "CHAKRANE",
                     "city": "16"
                    },
                    {
                     "name": "IKAOUEN",
                     "city": "16"
                    },
                    {
                     "name": "IMRABTEN",
                     "city": "16"
                    },
                    {
                     "name": "IMZOUREN",
                     "city": "16"
                    },
                    {
                     "name": "ISSAGUEN",
                     "city": "16"
                    },
                    {
                     "name": "IZEMMOUREN",
                     "city": "16"
                    },
                    {
                     "name": "KETAMA",
                     "city": "16"
                    },
                    {
                     "name": "LOUTA",
                     "city": "16"
                    },
                    {
                     "name": "MOULAY AHMED CHERIF",
                     "city": "16"
                    },
                    {
                     "name": "NEKKOUR",
                     "city": "16"
                    },
                    {
                     "name": "ROUADI",
                     "city": "16"
                    },
                    {
                     "name": "SENADA",
                     "city": "16"
                    },
                    {
                     "name": "SIDI BOUTMIM",
                     "city": "16"
                    },
                    {
                     "name": "SIDI BOUZINEB",
                     "city": "16"
                    },
                    {
                     "name": "TABARANNT",
                     "city": "16"
                    },
                    {
                     "name": "TAGHZOUT",
                     "city": "16"
                    },
                    {
                     "name": "TAMSAOUT",
                     "city": "16"
                    },
                    {
                     "name": "TARGUIST",
                     "city": "16"
                    },
                    {
                     "name": "TIFAROUINE",
                     "city": "16"
                    },
                    {
                     "name": "TIZI TCHEN",
                     "city": "16"
                    },
                    {
                     "name": "TORRES DE ALCALA",
                     "city": "16"
                    },
                    {
                     "name": "ZAOUIAT SIDI ABDELKADER",
                     "city": "16"
                    },
                    {
                     "name": "ZARKAT",
                     "city": "16"
                    },
                    {
                     "name": "ZARKT",
                     "city": "16"
                    },
                    {
                     "name": "AL HOCEIMA SIDI ABID",
                     "city": "16"
                    },
                    {
                     "name": "AIT YOUSSEF OU ALI",
                     "city": "16"
                    },
                    {
                     "name": "ARBAA TAOURIRT",
                     "city": "16"
                    },
                    {
                     "name": "AL HOCEIMA PPAL",
                     "city": "16"
                    },
                    {
                     "name": "ROUADI",
                     "city": "16"
                    },
                    {
                     "name": "AL HOCEIMA CLD",
                     "city": "16"
                    },
                    {
                     "name": "SENADA",
                     "city": "16"
                    },
                    {
                     "name": "TORRES DE ALCALA",
                     "city": "16"
                    },
                    {
                     "name": "Agence Mobile Al Hoceima Ppal",
                     "city": "16"
                    },
                    {
                     "name": "AIT KAMRA",
                     "city": "16"
                    },
                    {
                     "name": "CHAKRANE",
                     "city": "16"
                    },
                    {
                     "name": "IZEMMOUREN",
                     "city": "16"
                    },
                    {
                     "name": "BENI BOUAYACH",
                     "city": "16"
                    },
                    {
                     "name": "NEKKOUR",
                     "city": "16"
                    },
                    {
                     "name": "BNI BOUFRAH",
                     "city": "16"
                    },
                    {
                     "name": "BENI GMIL MESTASSA",
                     "city": "16"
                    },
                    {
                     "name": "BNI HADIFA",
                     "city": "16"
                    },
                    {
                     "name": "BNI ABDALLAH",
                     "city": "16"
                    },
                    {
                     "name": "IMRABTEN",
                     "city": "16"
                    },
                    {
                     "name": "IMZOUREN",
                     "city": "16"
                    },
                    {
                     "name": "TROUKOUT",
                     "city": "16"
                    },
                    {
                     "name": "BC IMZOUREN",
                     "city": "16"
                    },
                    {
                     "name": "ISSAGUEN",
                     "city": "16"
                    },
                    {
                     "name": "IKAOUEN",
                     "city": "16"
                    },
                    {
                     "name": "KETAMA",
                     "city": "16"
                    },
                    {
                     "name": "TABARANNT",
                     "city": "16"
                    },
                    {
                     "name": "TAGHZOUT",
                     "city": "16"
                    },
                    {
                     "name": "TIZI TCHEN",
                     "city": "16"
                    },
                    {
                     "name": "BNI AMMART",
                     "city": "16"
                    },
                    {
                     "name": "TARGUIST",
                     "city": "16"
                    },
                    {
                     "name": "BC TARGUIST",
                     "city": "16"
                    },
                    {
                     "name": "AIN BENABBOU",
                     "city": "16"
                    },
                    {
                     "name": "BNI BOUNSAR",
                     "city": "16"
                    },
                    {
                     "name": "BNI BCHIR",
                     "city": "16"
                    },
                    {
                     "name": "SIDI BOUZINEB",
                     "city": "16"
                    },
                    {
                     "name": "AZILAL",
                     "city": 32
                    },
                    {
                     "name": "ABACHKOU",
                     "city": 32
                    },
                    {
                     "name": "AFOURER",
                     "city": 32
                    },
                    {
                     "name": "AGHBALOU ZAOUIA",
                     "city": 32
                    },
                    {
                     "name": "AGOUDI NLKHAIR",
                     "city": 32
                    },
                    {
                     "name": "AIT ABBAS",
                     "city": 32
                    },
                    {
                     "name": "AIT ATTAB",
                     "city": 32
                    },
                    {
                     "name": "AIT BLAL",
                     "city": 32
                    },
                    {
                     "name": "AIT BOU OULLI",
                     "city": 32
                    },
                    {
                     "name": "AIT MAJDEN",
                     "city": 32
                    },
                    {
                     "name": "AIT MAZIGH",
                     "city": 32
                    },
                    {
                     "name": "AIT MHAMED",
                     "city": 32
                    },
                    {
                     "name": "AIT OUARDA",
                     "city": 32
                    },
                    {
                     "name": "AIT OUMDIS",
                     "city": 32
                    },
                    {
                     "name": "AIT TAGUELLA",
                     "city": 32
                    },
                    {
                     "name": "AIT TAMEJOUTE",
                     "city": 32
                    },
                    {
                     "name": "AIT TAMLIL",
                     "city": 32
                    },
                    {
                     "name": "ANERGUI",
                     "city": 32
                    },
                    {
                     "name": "ANZOU",
                     "city": 32
                    },
                    {
                     "name": "ARBAA OU AOULA",
                     "city": 32
                    },
                    {
                     "name": "ARBAA OUAKABLI",
                     "city": 32
                    },
                    {
                     "name": "AZILAL",
                     "city": 32
                    },
                    {
                     "name": "BINE EL OUIDANE",
                     "city": 32
                    },
                    {
                     "name": "BNI AYAT",
                     "city": 32
                    },
                    {
                     "name": "BNI HASSANE",
                     "city": 32
                    },
                    {
                     "name": "BOUANTAR",
                     "city": 32
                    },
                    {
                     "name": "BZOU",
                     "city": 32
                    },
                    {
                     "name": "DEMNATE",
                     "city": 32
                    },
                    {
                     "name": "FOUM JEMAA",
                     "city": 32
                    },
                    {
                     "name": "IGMIR",
                     "city": 32
                    },
                    {
                     "name": "IMADAHEN",
                     "city": 32
                    },
                    {
                     "name": "IMLIL",
                     "city": 32
                    },
                    {
                     "name": "ISSEKSI",
                     "city": 32
                    },
                    {
                     "name": "KHEMIS MAJDEN",
                     "city": 32
                    },
                    {
                     "name": "MOULAY AISSA BEN DRISS",
                     "city": 32
                    },
                    {
                     "name": "OUAOUIZARHT",
                     "city": 32
                    },
                    {
                     "name": "OUZOUD",
                     "city": 32
                    },
                    {
                     "name": "RFALA",
                     "city": 32
                    },
                    {
                     "name": "SIDI BOULKHALF",
                     "city": 32
                    },
                    {
                     "name": "SIDI YACOUB",
                     "city": 32
                    },
                    {
                     "name": "SKATT",
                     "city": 32
                    },
                    {
                     "name": "TABANNT",
                     "city": 32
                    },
                    {
                     "name": "TABAROUCHT",
                     "city": 32
                    },
                    {
                     "name": "TABIA",
                     "city": 32
                    },
                    {
                     "name": "TAGUELFT",
                     "city": 32
                    },
                    {
                     "name": "TAMDA NOUMERCID",
                     "city": 32
                    },
                    {
                     "name": "TANANNT",
                     "city": 32
                    },
                    {
                     "name": "TAOUNZA",
                     "city": 32
                    },
                    {
                     "name": "TIDILI FETOUAKA",
                     "city": 32
                    },
                    {
                     "name": "TIFFERT NAIT HAMZA",
                     "city": 32
                    },
                    {
                     "name": "TIFNI",
                     "city": 32
                    },
                    {
                     "name": "TILOUGGUITE",
                     "city": 32
                    },
                    {
                     "name": "TISLIT",
                     "city": 32
                    },
                    {
                     "name": "TISQI",
                     "city": 32
                    },
                    {
                     "name": "TNINE TIMOULILT",
                     "city": 32
                    },
                    {
                     "name": "ZAOUIA AHENSAL",
                     "city": 32
                    },
                    {
                     "name": "BENI MELLAL",
                     "city": 92
                    },
                    {
                     "name": "AIT OUM EL BEKHT",
                     "city": 92
                    },
                    {
                     "name": "ARHBALA",
                     "city": 92
                    },
                    {
                     "name": "BOUTFARDA",
                     "city": 92
                    },
                    {
                     "name": "DOUAR AIT ALI",
                     "city": 92
                    },
                    {
                     "name": "EL BAZZAZA",
                     "city": 92
                    },
                    {
                     "name": "EL KRAZZA",
                     "city": 92
                    },
                    {
                     "name": "EL KSIBA",
                     "city": 92
                    },
                    {
                     "name": "FECHTALA",
                     "city": 92
                    },
                    {
                     "name": "FERYATA",
                     "city": 92
                    },
                    {
                     "name": "FOUM EL ANSER",
                     "city": 92
                    },
                    {
                     "name": "FOUM OUDI",
                     "city": 92
                    },
                    {
                     "name": "GHORM EL ALEM",
                     "city": 92
                    },
                    {
                     "name": "GUETTAYA",
                     "city": 92
                    },
                    {
                     "name": "KASBA TADLA",
                     "city": 92
                    },
                    {
                     "name": "LAAYAYTA",
                     "city": 92
                    },
                    {
                     "name": "LAHLALMA",
                     "city": 92
                    },
                    {
                     "name": "M'GHILA",
                     "city": 92
                    },
                    {
                     "name": "NAOUR",
                     "city": 92
                    },
                    {
                     "name": "OULAD ALI LOUED",
                     "city": 92
                    },
                    {
                     "name": "OULAD DRISS BRADIA",
                     "city": 92
                    },
                    {
                     "name": "OULAD GNAOUA",
                     "city": 92
                    },
                    {
                     "name": "OULAD HASSOUN",
                     "city": 92
                    },
                    {
                     "name": "OULAD SAID EL OUED",
                     "city": 92
                    },
                    {
                     "name": "OULED ABDELLAH",
                     "city": 92
                    },
                    {
                     "name": "OULED MBAREK",
                     "city": 92
                    },
                    {
                     "name": "OULED YAICHE",
                     "city": 92
                    },
                    {
                     "name": "OULED YOUSSEF",
                     "city": 92
                    },
                    {
                     "name": "SEMGUET",
                     "city": 92
                    },
                    {
                     "name": "SIDI AISSA",
                     "city": 92
                    },
                    {
                     "name": "SIDI JABER",
                     "city": 92
                    },
                    {
                     "name": "TAGHZIRT",
                     "city": 92
                    },
                    {
                     "name": "TANORHA",
                     "city": 92
                    },
                    {
                     "name": "TIZI NISLY",
                     "city": 92
                    },
                    {
                     "name": "ZAOUIAT CHEIKH",
                     "city": 92
                    },
                    {
                     "name": "ZOUAIR",
                     "city": 92
                    },
                    {
                     "name": "BENSLIMANE",
                     "city": 61
                    },
                    {
                     "name": "AHLAF",
                     "city": 61
                    },
                    {
                     "name": "AIN TIZGHA",
                     "city": 61
                    },
                    {
                     "name": "BENNABET",
                     "city": 61
                    },
                    {
                     "name": "BENSLIMANE",
                     "city": 61
                    },
                    {
                     "name": "BESSABES",
                     "city": 61
                    },
                    {
                     "name": "BIR ENNASR",
                     "city": 61
                    },
                    {
                     "name": "BOUZNIKA",
                     "city": 61
                    },
                    {
                     "name": "CHERRAT",
                     "city": 61
                    },
                    {
                     "name": "EL KRASSI",
                     "city": 61
                    },
                    {
                     "name": "EL MANSOURIA",
                     "city": 61
                    },
                    {
                     "name": "FEDALATE",
                     "city": 61
                    },
                    {
                     "name": "MELLILA",
                     "city": 61
                    },
                    {
                     "name": "MOUALINE EL GHABA",
                     "city": 61
                    },
                    {
                     "name": "MOULAINE EL OUED",
                     "city": 61
                    },
                    {
                     "name": "OULAD ALI TOUALAA",
                     "city": 61
                    },
                    {
                     "name": "OULAD YAHYA LOUTA",
                     "city": 61
                    },
                    {
                     "name": "RDADNA OULAD MALEK",
                     "city": 61
                    },
                    {
                     "name": "SIDI BETTACHE",
                     "city": 61
                    },
                    {
                     "name": "SOUALEM ET TIRS",
                     "city": 61
                    },
                    {
                     "name": "TNINE OULAD ALI",
                     "city": 61
                    },
                    {
                     "name": "ZIAIDA",
                     "city": 61
                    },
                    {
                     "name": "OULAD YAHYA LOUTA",
                     "city": 61
                    },
                    {
                     "name": "BERKANE",
                     "city": 62
                    },
                    {
                     "name": "AHFIR",
                     "city": 62
                    },
                    {
                     "name": "AIN ERREGGADA",
                     "city": 62
                    },
                    {
                     "name": "AKLIM",
                     "city": 62
                    },
                    {
                     "name": "ARHBAL",
                     "city": 62
                    },
                    {
                     "name": "BOUGHRIBA",
                     "city": 62
                    },
                    {
                     "name": "CHOUIHIA",
                     "city": 62
                    },
                    {
                     "name": "FEZOUANE",
                     "city": 62
                    },
                    {
                     "name": "LAATAMNA",
                     "city": 62
                    },
                    {
                     "name": "LAATMNA",
                     "city": 62
                    },
                    {
                     "name": "MADAGH",
                     "city": 62
                    },
                    {
                     "name": "RISLANE",
                     "city": 62
                    },
                    {
                     "name": "SAIDIA",
                     "city": 62
                    },
                    {
                     "name": "SIDI BOUHOURIA",
                     "city": 62
                    },
                    {
                     "name": "SIDI SLIMANE ECHCHARRAA",
                     "city": 62
                    },
                    {
                     "name": "TAFORHALT",
                     "city": 62
                    },
                    {
                     "name": "ZAYEST",
                     "city": 62
                    },
                    {
                     "name": "ZEGZEL",
                     "city": 62
                    },
                    {
                     "name": "BERRECHID",
                     "city": 63
                    },
                    {
                     "name": "EL GARA",
                     "city": 63
                    },
                    {
                     "name": "FOQRA OULAD AAMEUR",
                     "city": 63
                    },
                    {
                     "name": "HAD SOUALEM",
                     "city": 63
                    },
                    {
                     "name": "JAQMA",
                     "city": 63
                    },
                    {
                     "name": "KASBAT BEN MCHICH",
                     "city": 63
                    },
                    {
                     "name": "LAHSASNA",
                     "city": 63
                    },
                    {
                     "name": "LAKHIAITA",
                     "city": 63
                    },
                    {
                     "name": "LAMBARKIYINE",
                     "city": 63
                    },
                    {
                     "name": "OULAD ABBOU",
                     "city": 63
                    },
                    {
                     "name": "OULAD CEBBAH",
                     "city": 63
                    },
                    {
                     "name": "RIAH",
                     "city": 63
                    },
                    {
                     "name": "SIDI ABDELKHALEQ",
                     "city": 63
                    },
                    {
                     "name": "SIDI EL MEKKI",
                     "city": 63
                    },
                    {
                     "name": "SOUALEM TRIFIA",
                     "city": 63
                    },
                    {
                     "name": "ZAOUIAT BEN HAMDOUNE",
                     "city": 63
                    },
                    {
                     "name": "SAHEL OULAD H'RIZ",
                     "city": 63
                    },
                    {
                     "name": "BOUJDOUR",
                     "city": 81
                    },
                    {
                     "name": "GUELTAT ZEMMOUR",
                     "city": 81
                    },
                    {
                     "name": "JRAIFIA",
                     "city": 81
                    },
                    {
                     "name": "LAMSSID",
                     "city": 81
                    },
                    {
                     "name": "BOULEMANE",
                     "city": 84
                    },
                    {
                     "name": "ACHLOUJ",
                     "city": 84
                    },
                    {
                     "name": "AIT ABDALLAH BOUKHAMOUJ",
                     "city": 84
                    },
                    {
                     "name": "AIT BAZZA",
                     "city": 84
                    },
                    {
                     "name": "AIT EL MANE",
                     "city": 84
                    },
                    {
                     "name": "AIT HAMZA",
                     "city": 84
                    },
                    {
                     "name": "ALMIS GUIGOU",
                     "city": 84
                    },
                    {
                     "name": "ALMIS MARMOUCHA",
                     "city": 84
                    },
                    {
                     "name": "BOULEMANE",
                     "city": 84
                    },
                    {
                     "name": "EL MERS",
                     "city": 84
                    },
                    {
                     "name": "EL ORJANE",
                     "city": 84
                    },
                    {
                     "name": "ENJIL",
                     "city": 84
                    },
                    {
                     "name": "ENJIL AIT LAHCEN",
                     "city": 84
                    },
                    {
                     "name": "ERMILA",
                     "city": 84
                    },
                    {
                     "name": "FRITISSA",
                     "city": 84
                    },
                    {
                     "name": "IFKIRNE",
                     "city": 84
                    },
                    {
                     "name": "IMOUZZER MARMOUCHA",
                     "city": 84
                    },
                    {
                     "name": "KSABI",
                     "city": 84
                    },
                    {
                     "name": "KSABI MOULOUYA",
                     "city": 84
                    },
                    {
                     "name": "MISSOUR",
                     "city": 84
                    },
                    {
                     "name": "OUAOULZEMT",
                     "city": 84
                    },
                    {
                     "name": "OUIZEGHT",
                     "city": 84
                    },
                    {
                     "name": "OULAD ALI YOUSSEF",
                     "city": 84
                    },
                    {
                     "name": "OULAD SGHIR",
                     "city": 84
                    },
                    {
                     "name": "OULED ALI",
                     "city": 84
                    },
                    {
                     "name": "OUTAT EL HAJ",
                     "city": 84
                    },
                    {
                     "name": "SERGHINA",
                     "city": 84
                    },
                    {
                     "name": "SIDI BOUTAYEB",
                     "city": 84
                    },
                    {
                     "name": "SKOURA MDAZ",
                     "city": 84
                    },
                    {
                     "name": "TAFRAOUTE AIT ALI OULAHCEN",
                     "city": 84
                    },
                    {
                     "name": "TAGHROUTE",
                     "city": 84
                    },
                    {
                     "name": "TALZEMT",
                     "city": 84
                    },
                    {
                     "name": "TINDIT",
                     "city": 84
                    },
                    {
                     "name": "TISSAF",
                     "city": 84
                    },
                    {
                     "name": "CASABLANCA",
                     "city": 93
                    },
                    {
                     "name": "CASA BOURSE",
                     "city": 93
                    },
                    {
                     "name": "BOUSMARA",
                     "city": 93
                    },
                    {
                     "name": "MERS SULTAN",
                     "city": 93
                    },
                    {
                     "name": "MOUSSA BNOU NOUCEIR",
                     "city": 93
                    },
                    {
                     "name": "ANFA",
                     "city": 93
                    },
                    {
                     "name": "OUEST",
                     "city": 93
                    },
                    {
                     "name": "SIDI BELYOUT",
                     "city": 93
                    },
                    {
                     "name": "DERB SOLTANE",
                     "city": 93
                    },
                    {
                     "name": "HAY MOHAMMADI",
                     "city": 93
                    },
                    {
                     "name": "BEN MSIK",
                     "city": 93
                    },
                    {
                     "name": "CASA EST",
                     "city": 93
                    },
                    {
                     "name": "COMPLEXE MOHAMMED V",
                     "city": 93
                    },
                    {
                     "name": "GHANDI",
                     "city": 93
                    },
                    {
                     "name": "ADDOHA",
                     "city": 93
                    },
                    {
                     "name": "SOUK JOUMLA",
                     "city": 93
                    },
                    {
                     "name": "OASIS GARE",
                     "city": 93
                    },
                    {
                     "name": "OUM RABII",
                     "city": 93
                    },
                    {
                     "name": "BD ABDELMOUMEN",
                     "city": 93
                    },
                    {
                     "name": "HAY EL FALAH",
                     "city": 93
                    },
                    {
                     "name": " FORCES AUXILIARES",
                     "city": 93
                    },
                    {
                     "name": "HAY JAMILA",
                     "city": 93
                    },
                    {
                     "name": "HAY RHAMNA",
                     "city": 93
                    },
                    {
                     "name": "AIN DIAB",
                     "city": 93
                    },
                    {
                     "name": "BOURGOGNE",
                     "city": 93
                    },
                    {
                     "name": "EL HANK",
                     "city": 93
                    },
                    {
                     "name": "SIDI SOUFI",
                     "city": 93
                    },
                    {
                     "name": "HAY RMILA",
                     "city": 93
                    },
                    {
                     "name": "EL JOULANE",
                     "city": 93
                    },
                    {
                     "name": "TECHNOPARK",
                     "city": 93
                    },
                    {
                     "name": "MEKDAD LAHRIZI",
                     "city": 93
                    },
                    {
                     "name": "AL AMAL",
                     "city": 93
                    },
                    {
                     "name": "EL HOUDA",
                     "city": 93
                    },
                    {
                     "name": "BACHKOU",
                     "city": 93
                    },
                    {
                     "name": "CASA EMILE ZOLA",
                     "city": 93
                    },
                    {
                     "name": "10 MARS",
                     "city": 93
                    },
                    {
                     "name": "ENNASSIM",
                     "city": 93
                    },
                    {
                     "name": "DRISS EL HARTI",
                     "city": 93
                    },
                    {
                     "name": "AL AZHAR",
                     "city": 93
                    },
                    {
                     "name": "Haffarine ",
                     "city": 93
                    },
                    {
                     "name": "My Rchid ",
                     "city": 93
                    },
                    {
                     "name": "AIN SEBAA",
                     "city": 93
                    },
                    {
                     "name": "BOUSMARA",
                     "city": 93
                    },
                    {
                     "name": "DERB GHALLEF",
                     "city": 93
                    },
                    {
                     "name": "OASIS",
                     "city": 93
                    },
                    {
                     "name": "MAARIF",
                     "city": 93
                    },
                    {
                     "name": "OUED SEBOU",
                     "city": 93
                    },
                    {
                     "name": "AL AMAL",
                     "city": 93
                    },
                    {
                     "name": "AL MOUSTAKBAL",
                     "city": 93
                    },
                    {
                     "name": "HADJ FATEH",
                     "city": 93
                    },
                    {
                     "name": "ROUDANI",
                     "city": 93
                    },
                    {
                     "name": "ALANDALOUS",
                     "city": 93
                    },
                    {
                     "name": "HAY EL INARA",
                     "city": 93
                    },
                    {
                     "name": "AIN CHOK",
                     "city": 93
                    },
                    {
                     "name": "MCALLA",
                     "city": 93
                    },
                    {
                     "name": "SIDI MAAROUF",
                     "city": 93
                    },
                    {
                     "name": "HAY EL OULFA",
                     "city": 93
                    },
                    {
                     "name": "HAY ESSALAM",
                     "city": 93
                    },
                    {
                     "name": "HAY HASSANI",
                     "city": 93
                    },
                    {
                     "name": "LISSASFA",
                     "city": 93
                    },
                    {
                     "name": "SIDI EL KHADIR",
                     "city": 93
                    },
                    {
                     "name": "AIN SEBAA PLAGE",
                     "city": 93
                    },
                    {
                     "name": "AIN SEBAA",
                     "city": 93
                    },
                    {
                     "name": "AIN SEBAA AL HADIKA",
                     "city": 93
                    },
                    {
                     "name": "AIN BORJA",
                     "city": 93
                    },
                    {
                     "name": "ROCHES NOIRES",
                     "city": 93
                    },
                    {
                     "name": "GARE",
                     "city": 93
                    },
                    {
                     "name": "IBN TACHAFINE",
                     "city": 93
                    },
                    {
                     "name": "DAR LAMANE",
                     "city": 93
                    },
                    {
                     "name": "TAKADOUM",
                     "city": 93
                    },
                    {
                     "name": "SIDI MOUMEN",
                     "city": 93
                    },
                    {
                     "name": "CITE DJEMAA",
                     "city": 93
                    },
                    {
                     "name": "HAY SALMIA",
                     "city": 93
                    },
                    {
                     "name": "HAY IFRIQUIA",
                     "city": 93
                    },
                    {
                     "name": "KSAR BHAR",
                     "city": 93
                    },
                    {
                     "name": "2 MARS",
                     "city": 93
                    },
                    {
                     "name": "QUARTIER DES HOPITAUX",
                     "city": 93
                    },
                    {
                     "name": "DERB SIDNA",
                     "city": 93
                    },
                    {
                     "name": "HAY EL FARAH",
                     "city": 93
                    },
                    {
                     "name": "BOULEVARD MOHAMED VI",
                     "city": 93
                    },
                    {
                     "name": "EL FIDA",
                     "city": 93
                    },
                    {
                     "name": "AL QODS",
                     "city": 93
                    },
                    {
                     "name": "AHL LOGHLAM",
                     "city": 93
                    },
                    {
                     "name": "BD EL GUERNAOUI",
                     "city": 93
                    },
                    {
                     "name": "SIDI BERNOUSSI",
                     "city": 93
                    },
                    {
                     "name": "ATTACHAROUK",
                     "city": 93
                    },
                    {
                     "name": "HAY SADRI",
                     "city": 93
                    },
                    {
                     "name": "HAY EL BARAKA",
                     "city": 93
                    },
                    {
                     "name": "HAY MY RACHID",
                     "city": 93
                    },
                    {
                     "name": "HAY ESSALAMA",
                     "city": 93
                    },
                    {
                     "name": "SIDI OTHMANE",
                     "city": 93
                    },
                    {
                     "name": "ANASSI",
                     "city": 93
                    },
                    {
                     "name": "CHEFCHAOUEN",
                     "city": 94
                    },
                    {
                     "name": "AMTAR",
                     "city": 94
                    },
                    {
                     "name": "ASIFANE",
                     "city": 94
                    },
                    {
                     "name": "BAB BERRET",
                     "city": 94
                    },
                    {
                     "name": "BAB TAZA",
                     "city": 94
                    },
                    {
                     "name": "BENI BOUZRA",
                     "city": 94
                    },
                    {
                     "name": "BENI RZEN",
                     "city": 94
                    },
                    {
                     "name": "BENI SELMANE",
                     "city": 94
                    },
                    {
                     "name": "BNI AHMED",
                     "city": 94
                    },
                    {
                     "name": "BNI AHMED GHARBIA",
                     "city": 94
                    },
                    {
                     "name": "BNI DARKOUL",
                     "city": 94
                    },
                    {
                     "name": "BNI FAGHLOUM",
                     "city": 94
                    },
                    {
                     "name": "BNI MANSOUR",
                     "city": 94
                    },
                    {
                     "name": "BNI RZINE",
                     "city": 94
                    },
                    {
                     "name": "BNI SALAH",
                     "city": 94
                    },
                    {
                     "name": "BNI SELMANE",
                     "city": 94
                    },
                    {
                     "name": "BNI SMIH",
                     "city": 94
                    },
                    {
                     "name": "CHEFCHAOUEN",
                     "city": 94
                    },
                    {
                     "name": "DERDERA",
                     "city": 94
                    },
                    {
                     "name": "DERKOUL",
                     "city": 94
                    },
                    {
                     "name": "EL MELHA",
                     "city": 94
                    },
                    {
                     "name": "FIFI",
                     "city": 94
                    },
                    {
                     "name": "HAD RHDIR KROUCH",
                     "city": 94
                    },
                    {
                     "name": "IOUANE",
                     "city": 94
                    },
                    {
                     "name": "JEBHA",
                     "city": 94
                    },
                    {
                     "name": "KAA ASRASS",
                     "city": 94
                    },
                    {
                     "name": "LAGHDIR",
                     "city": 94
                    },
                    {
                     "name": "MANSOURA",
                     "city": 94
                    },
                    {
                     "name": "MTIOUA",
                     "city": 94
                    },
                    {
                     "name": "OUAOUZGANE",
                     "city": 94
                    },
                    {
                     "name": "STEHA",
                     "city": 94
                    },
                    {
                     "name": "TALEMBOTE",
                     "city": 94
                    },
                    {
                     "name": "TAMOROTE",
                     "city": 94
                    },
                    {
                     "name": "TANACOB",
                     "city": 94
                    },
                    {
                     "name": "TASSIFT",
                     "city": 94
                    },
                    {
                     "name": "TIZGANE",
                     "city": 94
                    },
                    {
                     "name": "TLATA ASSIFANE",
                     "city": 94
                    },
                    {
                     "name": "CHICHAOUA",
                     "city": 95
                    },
                    {
                     "name": "ADASSIL",
                     "city": 95
                    },
                    {
                     "name": "AFALLA ISSEN",
                     "city": 95
                    },
                    {
                     "name": "AHDIL",
                     "city": 95
                    },
                    {
                     "name": "AIN TAZITOUNTE",
                     "city": 95
                    },
                    {
                     "name": "AIT HADDOU YOUSSEF",
                     "city": 95
                    },
                    {
                     "name": "AIT HADI",
                     "city": 95
                    },
                    {
                     "name": "ARBAA DOUIRANE",
                     "city": 95
                    },
                    {
                     "name": "ASSERRATOU",
                     "city": 95
                    },
                    {
                     "name": "ASSIF EL MAL",
                     "city": 95
                    },
                    {
                     "name": "BOUABOUTE",
                     "city": 95
                    },
                    {
                     "name": "BOULAOUANE",
                     "city": 95
                    },
                    {
                     "name": "CHICHAOUA",
                     "city": 95
                    },
                    {
                     "name": "GUEMASSA",
                     "city": 95
                    },
                    {
                     "name": "HAD MJATT",
                     "city": 95
                    },
                    {
                     "name": "ICHAMRAREN",
                     "city": 95
                    },
                    {
                     "name": "IMINDOUNIT",
                     "city": 95
                    },
                    {
                     "name": "IMINTANOUTE",
                     "city": 95
                    },
                    {
                     "name": "IROHALEN",
                     "city": 95
                    },
                    {
                     "name": "KOUZEMT",
                     "city": 95
                    },
                    {
                     "name": "LALLA AZIZA",
                     "city": 95
                    },
                    {
                     "name": "MZOUDIA",
                     "city": 95
                    },
                    {
                     "name": "NFIFA",
                     "city": 95
                    },
                    {
                     "name": "OUAD LBOUR",
                     "city": 95
                    },
                    {
                     "name": "OULAD MOUMNA",
                     "city": 95
                    },
                    {
                     "name": "RAHHALA",
                     "city": 95
                    },
                    {
                     "name": "SAIDATE",
                     "city": 95
                    },
                    {
                     "name": "SEBT MZOUDA",
                     "city": 95
                    },
                    {
                     "name": "SIDI ABDELMOUMEN",
                     "city": 95
                    },
                    {
                     "name": "SIDI BOUZID ARRAGRAGUI",
                     "city": 95
                    },
                    {
                     "name": "SIDI MHAMED DALIL",
                     "city": 95
                    },
                    {
                     "name": "SIDI MOKHTAR",
                     "city": 95
                    },
                    {
                     "name": "TAOULOUKOUT",
                     "city": 95
                    },
                    {
                     "name": "TIMEZGUADIOUINE",
                     "city": 95
                    },
                    {
                     "name": "TIMLILT",
                     "city": 95
                    },
                    {
                     "name": "ZAOUIA NOUACEUR",
                     "city": 95
                    },
                    {
                     "name": "ZAOUIAT ANNAHLIA",
                     "city": 95
                    },
                    {
                     "name": "CHTOUKA AIT BAHA",
                     "city": 43
                    },
                    {
                     "name": "AGUERD NTEZKE",
                     "city": 43
                    },
                    {
                     "name": "AIT AMIRA",
                     "city": 43
                    },
                    {
                     "name": "AIT BAHA",
                     "city": 43
                    },
                    {
                     "name": "AIT MZAL",
                     "city": 43
                    },
                    {
                     "name": "AIT OUADRIM",
                     "city": 43
                    },
                    {
                     "name": "AOUGUENZ",
                     "city": 43
                    },
                    {
                     "name": "BIOUGRA",
                     "city": 43
                    },
                    {
                     "name": "HAD AIT BELFAA",
                     "city": 43
                    },
                    {
                     "name": "HAD TARGA NTOUCHKA",
                     "city": 43
                    },
                    {
                     "name": "HALLATE",
                     "city": 43
                    },
                    {
                     "name": "IMHILEN",
                     "city": 43
                    },
                    {
                     "name": "IMI EL HAD TASGUEDELFT",
                     "city": 43
                    },
                    {
                     "name": "IMI MQOURN",
                     "city": 43
                    },
                    {
                     "name": "INCHADEN",
                     "city": 43
                    },
                    {
                     "name": "JEMAA TAKOUCHTE",
                     "city": 43
                    },
                    {
                     "name": "KHEMIS AIT MOUSSA",
                     "city": 43
                    },
                    {
                     "name": "KHMIS IDA OU GNIDIF",
                     "city": 43
                    },
                    {
                     "name": "MASSA",
                     "city": 43
                    },
                    {
                     "name": "MASSA TASSILA",
                     "city": 43
                    },
                    {
                     "name": "OUED ESSAFA",
                     "city": 43
                    },
                    {
                     "name": "SEBT AIT MILK",
                     "city": 43
                    },
                    {
                     "name": "SIDI ABDELLAH EL BOUCHOUARI",
                     "city": 43
                    },
                    {
                     "name": "SIDI BIBI",
                     "city": 43
                    },
                    {
                     "name": "SIDI BOUAZ",
                     "city": 43
                    },
                    {
                     "name": "SIDI BOUSHAB",
                     "city": 43
                    },
                    {
                     "name": "SIDI OUASSAY",
                     "city": 43
                    },
                    {
                     "name": "SIDI RBAT",
                     "city": 43
                    },
                    {
                     "name": "TANALT",
                     "city": 43
                    },
                    {
                     "name": "TIMEZGUIDA OUASRIR",
                     "city": 43
                    },
                    {
                     "name": "TLATA OU GUENZ",
                     "city": 43
                    },
                    {
                     "name": "TNINE HILALA",
                     "city": 43
                    },
                    {
                     "name": "EL JADIDA",
                     "city": 116
                    },
                    {
                     "name": "ARBAA CHTOUKA",
                     "city": 116
                    },
                    {
                     "name": "AZEMMOUR",
                     "city": 116
                    },
                    {
                     "name": "BIR JDID",
                     "city": 116
                    },
                    {
                     "name": "BOUCEDRA",
                     "city": 116
                    },
                    {
                     "name": "CHAIBATE",
                     "city": 116
                    },
                    {
                     "name": "HAOUZIA",
                     "city": 116
                    },
                    {
                     "name": "JORF LASFAR",
                     "city": 116
                    },
                    {
                     "name": "KHEMIS DES ZEMAMRA",
                     "city": 116
                    },
                    {
                     "name": "KHEMIS MTOUH",
                     "city": 116
                    },
                    {
                     "name": "LAAOUISSATE",
                     "city": 116
                    },
                    {
                     "name": "LAGHDIRA",
                     "city": 116
                    },
                    {
                     "name": "LAMHARZA ESSAHEL",
                     "city": 116
                    },
                    {
                     "name": "LAMNAKRA EL HADDADA",
                     "city": 116
                    },
                    {
                     "name": "MHAIOULA",
                     "city": 116
                    },
                    {
                     "name": "MOGRESS",
                     "city": 116
                    },
                    {
                     "name": "MOULAY ABDELLAH",
                     "city": 116
                    },
                    {
                     "name": "OULAD AISSA",
                     "city": 116
                    },
                    {
                     "name": "OULAD BEN CHAOUI",
                     "city": 116
                    },
                    {
                     "name": "OULAD HAMDANE",
                     "city": 116
                    },
                    {
                     "name": "OULAD HASSINE",
                     "city": 116
                    },
                    {
                     "name": "OULAD RAHMOUNE",
                     "city": 116
                    },
                    {
                     "name": "OULAD RHANEM",
                     "city": 116
                    },
                    {
                     "name": "OULAD SIDI ALI BEN YOUSSEF",
                     "city": 116
                    },
                    {
                     "name": "OULED FREJ",
                     "city": 116
                    },
                    {
                     "name": "OULJA DES CHIADMA",
                     "city": 116
                    },
                    {
                     "name": "SANIAT BENRKIK",
                     "city": 116
                    },
                    {
                     "name": "SEBT SAISS",
                     "city": 116
                    },
                    {
                     "name": "SI HSAIEN BEN ABDERRAHMANE",
                     "city": 116
                    },
                    {
                     "name": "SIDI ABED",
                     "city": 116
                    },
                    {
                     "name": "SIDI ALI BEN HAMDOUCHE",
                     "city": 116
                    },
                    {
                     "name": "SIDI BOUZID",
                     "city": 116
                    },
                    {
                     "name": "SIDI MHAMED AKHDIM",
                     "city": 116
                    },
                    {
                     "name": "SIDI MOUSSA PLAGE",
                     "city": 116
                    },
                    {
                     "name": "SIDI SMAIL",
                     "city": 116
                    },
                    {
                     "name": "TLETA BOULAOUANE",
                     "city": 116
                    },
                    {
                     "name": "TNINE CHTOUKA",
                     "city": 116
                    },
                    {
                     "name": "ZAOUIAT LAKOUACEM",
                     "city": 116
                    },
                    {
                     "name": "ZAOUIAT SAISS",
                     "city": 116
                    },
                    {
                     "name": "ERRACHIDIA",
                     "city": 124
                    },
                    {
                     "name": "AARAB SEBBAH GHERIS",
                     "city": 124
                    },
                    {
                     "name": "ACHBAROU",
                     "city": 124
                    },
                    {
                     "name": "AIT OTHMAN",
                     "city": 124
                    },
                    {
                     "name": "AIT YAHYA",
                     "city": 124
                    },
                    {
                     "name": "AMELAGO",
                     "city": 124
                    },
                    {
                     "name": "AOUFOUS",
                     "city": 124
                    },
                    {
                     "name": "ARFOUD",
                     "city": 124
                    },
                    {
                     "name": "ARHBALOU NKERDOUSS",
                     "city": 124
                    },
                    {
                     "name": "ASRIR OUED FERKLA",
                     "city": 124
                    },
                    {
                     "name": "BNI MHAMMED",
                     "city": 124
                    },
                    {
                     "name": "BOUDNIB",
                     "city": 124
                    },
                    {
                     "name": "CHORFA MDARHRA",
                     "city": 124
                    },
                    {
                     "name": "DOUIRA",
                     "city": 124
                    },
                    {
                     "name": "ER RTEB",
                     "city": 124
                    },
                    {
                     "name": "FAZNA",
                     "city": 124
                    },
                    {
                     "name": "FERKLA EL OULIA",
                     "city": 124
                    },
                    {
                     "name": "FERKLA ES SOUFLA",
                     "city": 124
                    },
                    {
                     "name": "GHERIS EL OULOUI",
                     "city": 124
                    },
                    {
                     "name": "GHERIS ES SOUFLI",
                     "city": 124
                    },
                    {
                     "name": "GOULMIMA",
                     "city": 124
                    },
                    {
                     "name": "HANNABOU",
                     "city": 124
                    },
                    {
                     "name": "JORF",
                     "city": 124
                    },
                    {
                     "name": "KHENG",
                     "city": 124
                    },
                    {
                     "name": "KSAR SAHLI",
                     "city": 124
                    },
                    {
                     "name": "MELLAB",
                     "city": 124
                    },
                    {
                     "name": "MERZOUGA",
                     "city": 124
                    },
                    {
                     "name": "MESKI",
                     "city": 124
                    },
                    {
                     "name": "MFISS",
                     "city": 124
                    },
                    {
                     "name": "MOULAY ALI CHERIF",
                     "city": 124
                    },
                    {
                     "name": "OUED NAAM",
                     "city": 124
                    },
                    {
                     "name": "OULAD CHAKER",
                     "city": 124
                    },
                    {
                     "name": "RISSANI",
                     "city": 124
                    },
                    {
                     "name": "SEFFALATE",
                     "city": 124
                    },
                    {
                     "name": "SIDI ALI",
                     "city": 124
                    },
                    {
                     "name": "SIDI ALI TAFRAOUT",
                     "city": 124
                    },
                    {
                     "name": "SIFA ARAB SEBBAH ZIZ",
                     "city": 124
                    },
                    {
                     "name": "TADIRHOUST",
                     "city": 124
                    },
                    {
                     "name": "TAMHRACH RHERISS",
                     "city": 124
                    },
                    {
                     "name": "TAOUZ",
                     "city": 124
                    },
                    {
                     "name": "TAZOUGARTE",
                     "city": 124
                    },
                    {
                     "name": "TILOUINE",
                     "city": 124
                    },
                    {
                     "name": "TIMEZGUITE",
                     "city": 124
                    },
                    {
                     "name": "TINEJDAD",
                     "city": 124
                    },
                    {
                     "name": "TOUROUG",
                     "city": 124
                    },
                    {
                     "name": "ZRIGATE",
                     "city": 124
                    },
                    {
                     "name": "JBIYEL",
                     "city": 124
                    },
                    {
                     "name": "ES SEMARA",
                     "city": 125
                    },
                    {
                     "name": "AMGALA",
                     "city": 125
                    },
                    {
                     "name": "HAOUZA",
                     "city": 125
                    },
                    {
                     "name": "JDIRIYA",
                     "city": 125
                    },
                    {
                     "name": "SIDI AHMED LAAROUSS",
                     "city": 125
                    },
                    {
                     "name": "SMARA",
                     "city": 125
                    },
                    {
                     "name": "TIFARITI",
                     "city": 125
                    },
                    {
                     "name": "ESSAOUIRA",
                     "city": 126
                    },
                    {
                     "name": "ADAGHAS",
                     "city": 126
                    },
                    {
                     "name": "AGLIF",
                     "city": 126
                    },
                    {
                     "name": "AGUERD",
                     "city": 126
                    },
                    {
                     "name": "AIN ZELTEN",
                     "city": 126
                    },
                    {
                     "name": "AIT AISSI IHAHANE",
                     "city": 126
                    },
                    {
                     "name": "AIT DAOUD",
                     "city": 126
                    },
                    {
                     "name": "AIT SAID",
                     "city": 126
                    },
                    {
                     "name": "AKERMOUD",
                     "city": 126
                    },
                    {
                     "name": "ARBAA IDA OU TROUMA",
                     "city": 126
                    },
                    {
                     "name": "ARBAA IDA OUGOURD",
                     "city": 126
                    },
                    {
                     "name": "ASSAIS",
                     "city": 126
                    },
                    {
                     "name": "BIZDAD",
                     "city": 126
                    },
                    {
                     "name": "BOUZEMMOUR",
                     "city": 126
                    },
                    {
                     "name": "EZZAOUITE",
                     "city": 126
                    },
                    {
                     "name": "HAD DRAA",
                     "city": 126
                    },
                    {
                     "name": "HAD MRAMER",
                     "city": 126
                    },
                    {
                     "name": "IDA OU GUELLOUL",
                     "city": 126
                    },
                    {
                     "name": "IDA OU KAZZOU",
                     "city": 126
                    },
                    {
                     "name": "IDA OUAZZA",
                     "city": 126
                    },
                    {
                     "name": "IMGRADE",
                     "city": 126
                    },
                    {
                     "name": "KECHOULA",
                     "city": 126
                    },
                    {
                     "name": "KHEMIS MESKALA",
                     "city": 126
                    },
                    {
                     "name": "KHEMIS TAKATE",
                     "city": 126
                    },
                    {
                     "name": "LAGDADRA",
                     "city": 126
                    },
                    {
                     "name": "LAHSINATE",
                     "city": 126
                    },
                    {
                     "name": "LAMZILATE",
                     "city": 126
                    },
                    {
                     "name": "MEJJI",
                     "city": 126
                    },
                    {
                     "name": "MKHALIF",
                     "city": 126
                    },
                    {
                     "name": "MOUARID",
                     "city": 126
                    },
                    {
                     "name": "MOULAY BOUZARQTOUNE",
                     "city": 126
                    },
                    {
                     "name": "OULAD MRABET",
                     "city": 126
                    },
                    {
                     "name": "OUNAGHA",
                     "city": 126
                    },
                    {
                     "name": "SEBT IMGHADE",
                     "city": 126
                    },
                    {
                     "name": "SEBT KORIMATE",
                     "city": 126
                    },
                    {
                     "name": "SEBT MEKNAFA",
                     "city": 126
                    },
                    {
                     "name": "SIDI ABDELJALIL",
                     "city": 126
                    },
                    {
                     "name": "SIDI AHMED ESSAYEH",
                     "city": 126
                    },
                    {
                     "name": "SIDI AISSA REGRAGUI",
                     "city": 126
                    },
                    {
                     "name": "SIDI ALI EL KORATI",
                     "city": 126
                    },
                    {
                     "name": "SIDI BOULAALAM",
                     "city": 126
                    },
                    {
                     "name": "SIDI EL JAZOULI",
                     "city": 126
                    },
                    {
                     "name": "SIDI HMAD OU HAMED",
                     "city": 126
                    },
                    {
                     "name": "SIDI HMAD OU MBAREK",
                     "city": 126
                    },
                    {
                     "name": "SIDI ISHAQ",
                     "city": 126
                    },
                    {
                     "name": "SIDI KAOUKI",
                     "city": 126
                    },
                    {
                     "name": "SIDI LAAROUSSI",
                     "city": 126
                    },
                    {
                     "name": "SIDI MHAMED OU MARZOUQ",
                     "city": 126
                    },
                    {
                     "name": "SMIMOU",
                     "city": 126
                    },
                    {
                     "name": "TAFEDNA",
                     "city": 126
                    },
                    {
                     "name": "TAFTECHT",
                     "city": 126
                    },
                    {
                     "name": "TAHELOUANTE",
                     "city": 126
                    },
                    {
                     "name": "TAKOUCHT",
                     "city": 126
                    },
                    {
                     "name": "TALMEST",
                     "city": 126
                    },
                    {
                     "name": "TAMANAR",
                     "city": 126
                    },
                    {
                     "name": "TARGANTE",
                     "city": 126
                    },
                    {
                     "name": "TIDZI",
                     "city": 126
                    },
                    {
                     "name": "TIMZGUIDA OUFTAS",
                     "city": 126
                    },
                    {
                     "name": "TLATA HANCHANE",
                     "city": 126
                    },
                    {
                     "name": "TNINE IDA OU ZEMZEM",
                     "city": 126
                    },
                    {
                     "name": "TNINE IMI NTLIT",
                     "city": 126
                    },
                    {
                     "name": "ZAOUIA BEN HMIDA",
                     "city": 126
                    },
                    {
                     "name": "FES",
                     "city": 135
                    },
                    {
                     "name": "AIN BIDA",
                     "city": 135
                    },
                    {
                     "name": "LE SAIS",
                     "city": 135
                    },
                    {
                     "name": "OULAD ETTAYEB",
                     "city": 135
                    },
                    {
                     "name": "SIDI HARAZEM",
                     "city": 135
                    },
                    {
                     "name": "INEZGANE AIT MELLOUL",
                     "city": 167
                    },
                    {
                     "name": "AIT MELLOUL",
                     "city": 167
                    },
                    {
                     "name": "LQLIAA",
                     "city": 167
                    },
                    {
                     "name": "SOUK EL HAD OULAD DAHOU",
                     "city": 167
                    },
                    {
                     "name": "TEMSIA",
                     "city": 167
                    },
                    {
                     "name": "KENITRA",
                     "city": 196
                    },
                    {
                     "name": "AIN ARISS",
                     "city": 196
                    },
                    {
                     "name": "ALLAL TAZI",
                     "city": 196
                    },
                    {
                     "name": "AMEUR SEFLIA",
                     "city": 196
                    },
                    {
                     "name": "ARBAOUA",
                     "city": 196
                    },
                    {
                     "name": "BAHHARA OULAD AYAD",
                     "city": 196
                    },
                    {
                     "name": "BEN MANSOUR",
                     "city": 196
                    },
                    {
                     "name": "BENI MALEK",
                     "city": 196
                    },
                    {
                     "name": "CHOUAFAA",
                     "city": 196
                    },
                    {
                     "name": "EL ARBAA DU RHARB",
                     "city": 196
                    },
                    {
                     "name": "EL MORHRANE",
                     "city": 196
                    },
                    {
                     "name": "HADDADA EL GHARB",
                     "city": 196
                    },
                    {
                     "name": "KARIA BENAOUDA",
                     "city": 196
                    },
                    {
                     "name": "LALLA MIMOUNA",
                     "city": 196
                    },
                    {
                     "name": "MEHDYA",
                     "city": 196
                    },
                    {
                     "name": "MNASRA",
                     "city": 196
                    },
                    {
                     "name": "MOULAY BOUSELHAM",
                     "city": 196
                    },
                    {
                     "name": "OUED EL MAKHAZINE",
                     "city": 196
                    },
                    {
                     "name": "OULAD SLAMA",
                     "city": 196
                    },
                    {
                     "name": "SIDI BOUBKER EL HAJ",
                     "city": 196
                    },
                    {
                     "name": "SIDI MOHAMED EL AHMAR",
                     "city": 196
                    },
                    {
                     "name": "SIDI TAIBI",
                     "city": 196
                    },
                    {
                     "name": "SOUK TLETA EL GHARB",
                     "city": 196
                    },
                    {
                     "name": "KHEMISSET",
                     "city": 193
                    },
                    {
                     "name": "AIN JOHRA",
                     "city": 193
                    },
                    {
                     "name": "AIN SBIT",
                     "city": 193
                    },
                    {
                     "name": "AIT BELKACEM",
                     "city": 193
                    },
                    {
                     "name": "AIT ICHOU",
                     "city": 193
                    },
                    {
                     "name": "AIT MALEK",
                     "city": 193
                    },
                    {
                     "name": "AIT SIBERNE",
                     "city": 193
                    },
                    {
                     "name": "BOUKCHMIR",
                     "city": 193
                    },
                    {
                     "name": "EL GANZRA",
                     "city": 193
                    },
                    {
                     "name": "EL HAMMAM JBEL DOUM",
                     "city": 193
                    },
                    {
                     "name": "EL KENSARA",
                     "city": 193
                    },
                    {
                     "name": "HAD AIT MIMOUN",
                     "city": 193
                    },
                    {
                     "name": "HAD AIT OURIBEL",
                     "city": 193
                    },
                    {
                     "name": "HAD BRACHOUA",
                     "city": 193
                    },
                    {
                     "name": "HAD RHOUALEM",
                     "city": 193
                    },
                    {
                     "name": "HAJJAMA",
                     "city": 193
                    },
                    {
                     "name": "JEMAA MOUL LEBLAD",
                     "city": 193
                    },
                    {
                     "name": "KHEMIS AIT YADDINE",
                     "city": 193
                    },
                    {
                     "name": "KHEMIS NKHEILA",
                     "city": 193
                    },
                    {
                     "name": "KHEMIS SIDI YAHIA",
                     "city": 193
                    },
                    {
                     "name": "MAAZIZ",
                     "city": 193
                    },
                    {
                     "name": "MAJMAA TOLBA",
                     "city": 193
                    },
                    {
                     "name": "MARCHOUCH",
                     "city": 193
                    },
                    {
                     "name": "MKAM TOLBA",
                     "city": 193
                    },
                    {
                     "name": "MOULAY DRISS ARHBAL",
                     "city": 193
                    },
                    {
                     "name": "OULMES",
                     "city": 193
                    },
                    {
                     "name": "ROMMANI",
                     "city": 193
                    },
                    {
                     "name": "SEBT AIT IKKOU",
                     "city": 193
                    },
                    {
                     "name": "SFASSIF",
                     "city": 193
                    },
                    {
                     "name": "SIDI ABDERRAZAK",
                     "city": 193
                    },
                    {
                     "name": "SIDI ALI OU LAHCEN",
                     "city": 193
                    },
                    {
                     "name": "SIDI ALLAL EL BAHRAOUI",
                     "city": 193
                    },
                    {
                     "name": "SIDI ALLAL LEMSEDDER",
                     "city": 193
                    },
                    {
                     "name": "SIDI BOUKHALKHAL",
                     "city": 193
                    },
                    {
                     "name": "SIDI EL RHANDOUR",
                     "city": 193
                    },
                    {
                     "name": "SOUK JEMAA HOUDERRANE",
                     "city": 193
                    },
                    {
                     "name": "SOUK SEBT OUED BEHT",
                     "city": 193
                    },
                    {
                     "name": "SOUK TNINE MOGHANE",
                     "city": 193
                    },
                    {
                     "name": "TARMILET",
                     "city": 193
                    },
                    {
                     "name": "TIDDAS",
                     "city": 193
                    },
                    {
                     "name": "ZHILIGA",
                     "city": 193
                    },
                    {
                     "name": "KHENIFRA",
                     "city": 194
                    },
                    {
                     "name": "AGUELMAM AZEGZA",
                     "city": 194
                    },
                    {
                     "name": "AGUELMOUSS",
                     "city": 194
                    },
                    {
                     "name": "AIN AICHA AIT SAADELLI",
                     "city": 194
                    },
                    {
                     "name": "AIT ISHAK",
                     "city": 194
                    },
                    {
                     "name": "EL BORJ",
                     "city": 194
                    },
                    {
                     "name": "EL HAMMAM",
                     "city": 194
                    },
                    {
                     "name": "EL HRI",
                     "city": 194
                    },
                    {
                     "name": "EL KEBAB",
                     "city": 194
                    },
                    {
                     "name": "JBEL AOUAMA",
                     "city": 194
                    },
                    {
                     "name": "KAF NSOUR",
                     "city": 194
                    },
                    {
                     "name": "KERROUCHEN",
                     "city": 194
                    },
                    {
                     "name": "MOHA OU HAMMOU ZAYA",
                     "city": 194
                    },
                    {
                     "name": "MOULAY BOUAZZA",
                     "city": 194
                    },
                    {
                     "name": "MRIRT",
                     "city": 194
                    },
                    {
                     "name": "OUAOUMANA",
                     "city": 194
                    },
                    {
                     "name": "OUM RABIA",
                     "city": 194
                    },
                    {
                     "name": "SIDI AMAR",
                     "city": 194
                    },
                    {
                     "name": "SIDI BOUABBED",
                     "city": 194
                    },
                    {
                     "name": "SIDI HCINE",
                     "city": 194
                    },
                    {
                     "name": "SIDI LAMINE",
                     "city": 194
                    },
                    {
                     "name": "SIDI MHAMED BEN MBAREK",
                     "city": 194
                    },
                    {
                     "name": "SIDI YAHYA OU SAAD",
                     "city": 194
                    },
                    {
                     "name": "SOUK HAD BOUHSOUSSEN",
                     "city": 194
                    },
                    {
                     "name": "SOUK SEBT AIT RAHOU",
                     "city": 194
                    },
                    {
                     "name": "SOUK TNINE AIT BOUKHAYYOU",
                     "city": 194
                    },
                    {
                     "name": "TIGHESSALINE",
                     "city": 194
                    },
                    {
                     "name": "TIZI NGHACHOU",
                     "city": 194
                    },
                    {
                     "name": "AIN KICHER",
                     "city": 191
                    },
                    {
                     "name": "KHOURIBGA",
                     "city": 191
                    },
                    {
                     "name": "AIT AMMAR",
                     "city": 191
                    },
                    {
                     "name": "ARBAA MAADNA",
                     "city": 191
                    },
                    {
                     "name": "BEJAAD",
                     "city": 191
                    },
                    {
                     "name": "BIR MEZOUI",
                     "city": 191
                    },
                    {
                     "name": "BNI SMIR",
                     "city": 191
                    },
                    {
                     "name": "BOUAYACHE",
                     "city": 191
                    },
                    {
                     "name": "BOUJNIBA",
                     "city": 191
                    },
                    {
                     "name": "BOUKHRISSE",
                     "city": 191
                    },
                    {
                     "name": "BOULANOUAR",
                     "city": 191
                    },
                    {
                     "name": "EL FOKRA",
                     "city": 191
                    },
                    {
                     "name": "EL GUEFFAF",
                     "city": 191
                    },
                    {
                     "name": "HAD BNI BATAO",
                     "city": 191
                    },
                    {
                     "name": "HATTANE",
                     "city": 191
                    },
                    {
                     "name": "JEMAA OULAD AISSA",
                     "city": 191
                    },
                    {
                     "name": "KASBAT TROCH",
                     "city": 191
                    },
                    {
                     "name": "MFASSIS",
                     "city": 191
                    },
                    {
                     "name": "OUED ZEM",
                     "city": 191
                    },
                    {
                     "name": "OULAD FENNANE",
                     "city": 191
                    },
                    {
                     "name": "OULAD FTATA",
                     "city": 191
                    },
                    {
                     "name": "OULAD GOUAOUCH",
                     "city": 191
                    },
                    {
                     "name": "OULED ABDOUN",
                     "city": 191
                    },
                    {
                     "name": "OULED BOUGHADI",
                     "city": 191
                    },
                    {
                     "name": "ROUACHED",
                     "city": 191
                    },
                    {
                     "name": "SEBT BENI YAKHLEF",
                     "city": 191
                    },
                    {
                     "name": "SEBT DECHRA BRAKSA",
                     "city": 191
                    },
                    {
                     "name": "TACHREFT",
                     "city": 191
                    },
                    {
                     "name": "TLETA BENI ZRANTIL",
                     "city": 191
                    },
                    {
                     "name": "TLETA CHOUGRANE",
                     "city": 191
                    },
                    {
                     "name": "TLETA GNADIZ",
                     "city": 191
                    },
                    {
                     "name": "LAAYOUNE",
                     "city": 198
                    },
                    {
                     "name": "BOUKRAA",
                     "city": 198
                    },
                    {
                     "name": "DCHEIRA TAFOUDART",
                     "city": 198
                    },
                    {
                     "name": "EL HAGOUNIA",
                     "city": 198
                    },
                    {
                     "name": "FOUM EL OUED",
                     "city": 198
                    },
                    {
                     "name": "LARACHE",
                     "city": 203
                    },
                    {
                     "name": "AL AOUAMRA",
                     "city": 203
                    },
                    {
                     "name": "ARBAA AYACHA",
                     "city": 203
                    },
                    {
                     "name": "BNI AROUSS",
                     "city": 203
                    },
                    {
                     "name": "BOU JEDYANE",
                     "city": 203
                    },
                    {
                     "name": "KHEMIS SAHEL",
                     "city": 203
                    },
                    {
                     "name": "KSAR BJIR",
                     "city": 203
                    },
                    {
                     "name": "KSAR EL KEBIR",
                     "city": 203
                    },
                    {
                     "name": "LARACHE",
                     "city": 203
                    },
                    {
                     "name": "MECHERAH",
                     "city": 203
                    },
                    {
                     "name": "MOULAY ABDESSLAM",
                     "city": 203
                    },
                    {
                     "name": "OULAD OUCHIH",
                     "city": 203
                    },
                    {
                     "name": "RISSANA CHAMALIA",
                     "city": 203
                    },
                    {
                     "name": "RISSANA JANOUBIA",
                     "city": 203
                    },
                    {
                     "name": "SEBT BNI GARFET",
                     "city": 203
                    },
                    {
                     "name": "SIDI ALI",
                     "city": 203
                    },
                    {
                     "name": "SOUAKEN",
                     "city": 203
                    },
                    {
                     "name": "SOUK LQOLLA",
                     "city": 203
                    },
                    {
                     "name": "SOUK TOLBA",
                     "city": 203
                    },
                    {
                     "name": "TATOUFET",
                     "city": 203
                    },
                    {
                     "name": "TAZROUTE",
                     "city": 203
                    },
                    {
                     "name": "TLATA RISSANA",
                     "city": 203
                    },
                    {
                     "name": "ZAAROURA",
                     "city": 203
                    },
                    {
                     "name": "ZOUADA",
                     "city": 203
                    },
                    {
                     "name": "MARRAKECH",
                     "city": 214
                    },
                    {
                     "name": "AGAFAY",
                     "city": 214
                    },
                    {
                     "name": "AIN ITTI",
                     "city": 214
                    },
                    {
                     "name": "ALOUIDANE",
                     "city": 214
                    },
                    {
                     "name": "CHOUITER",
                     "city": 214
                    },
                    {
                     "name": "DOUAR CHAOUF EL AYADI",
                     "city": 214
                    },
                    {
                     "name": "HAD MNABHA",
                     "city": 214
                    },
                    {
                     "name": "HARBIL",
                     "city": 214
                    },
                    {
                     "name": "KETTARA",
                     "city": 214
                    },
                    {
                     "name": "MRABTINE",
                     "city": 214
                    },
                    {
                     "name": "NZALAT EL HARMEL",
                     "city": 214
                    },
                    {
                     "name": "OUAHAT SIDI BRAHIM",
                     "city": 214
                    },
                    {
                     "name": "OUED LAHJAR",
                     "city": 214
                    },
                    {
                     "name": "OULAD BELAAGUID",
                     "city": 214
                    },
                    {
                     "name": "OULAD DLIM",
                     "city": 214
                    },
                    {
                     "name": "SEBT AIT IMOUR",
                     "city": 214
                    },
                    {
                     "name": "SIDI ZOUINE",
                     "city": 214
                    },
                    {
                     "name": "SOUIHLA",
                     "city": 214
                    },
                    {
                     "name": "TAMANSOURT",
                     "city": 214
                    },
                    {
                     "name": "TASSOULTANTE",
                     "city": 214
                    },
                    {
                     "name": "TNINE OUDAYA",
                     "city": 214
                    },
                    {
                     "name": "AMERCHICH",
                     "city": 214
                    },
                    {
                     "name": "BAB RHMATE",
                     "city": 214
                    },
                    {
                     "name": "DOUAR IZIKI",
                     "city": 214
                    },
                    {
                     "name": "HAY AL MASSIRA",
                     "city": 214
                    },
                    {
                     "name": "HAY HASSANI",
                     "city": 214
                    },
                    {
                     "name": "DIOUR ECHCHOUHADA",
                     "city": 214
                    },
                    {
                     "name": "SIDI ABBAD",
                     "city": 214
                    },
                    {
                     "name": "BAB KHEMIS",
                     "city": 214
                    },
                    {
                     "name": "ANNAKHIL",
                     "city": 214
                    },
                    {
                     "name": "AIN ITTI",
                     "city": 214
                    },
                    {
                     "name": "CHOUITER",
                     "city": 214
                    },
                    {
                     "name": "DOUAR CHAOUF EL AYADI",
                     "city": 214
                    },
                    {
                     "name": "MRABTINE",
                     "city": 214
                    },
                    {
                     "name": "HAY MOHAMMADI",
                     "city": 214
                    },
                    {
                     "name": "MEDINA",
                     "city": 214
                    },
                    {
                     "name": "SIDI YOUSSEF BEN ALI",
                     "city": 214
                    },
                    {
                     "name": "SIDI GHANEM",
                     "city": 214
                    },
                    {
                     "name": "DAOUDIATE",
                     "city": 214
                    },
                    {
                     "name": "BAB AGNAOU",
                     "city": 214
                    },
                    {
                     "name": "CAMP EL GHOUL",
                     "city": 214
                    },
                    {
                     "name": "EL BAHIA",
                     "city": 214
                    },
                    {
                     "name": "RIAD EL AROUSS",
                     "city": 214
                    },
                    {
                     "name": "BEFRA",
                     "city": 214
                    },
                    {
                     "name": "MENARA",
                     "city": 214
                    },
                    {
                     "name": "MHAMID",
                     "city": 214
                    },
                    {
                     "name": "ALLAL EL FASSI",
                     "city": 214
                    },
                    {
                     "name": "AZLI",
                     "city": 214
                    },
                    {
                     "name": "OUED LAHJAR",
                     "city": 214
                    },
                    {
                     "name": "OULAD BELAAGUID",
                     "city": 214
                    },
                    {
                     "name": "OULAD DLIM",
                     "city": 214
                    },
                    {
                     "name": "TASSOULTANTE",
                     "city": 214
                    },
                    {
                     "name": "PONT MASSIRA",
                     "city": 214
                    },
                    {
                     "name": "AL FADL",
                     "city": 214
                    },
                    {
                     "name": "ATLAS",
                     "city": 214
                    },
                    {
                     "name": "ABRAJ KOUTOUBIA",
                     "city": 214
                    },
                    {
                     "name": "BORJ ZAITOUN",
                     "city": 214
                    },
                    {
                     "name": "AZZOUZIA",
                     "city": 214
                    },
                    {
                     "name": "TARGA",
                     "city": 214
                    },
                    {
                     "name": "JARDINS DES ORANGERS",
                     "city": 214
                    },
                    {
                     "name": "KETTARA",
                     "city": 214
                    },
                    {
                     "name": "NZALAT EL HARMEL",
                     "city": 214
                    },
                    {
                     "name": "HAD MNABHA",
                     "city": 214
                    },
                    {
                     "name": "SIDI ZOUINE",
                     "city": 214
                    },
                    {
                     "name": "TNINE OUDAYA",
                     "city": 214
                    },
                    {
                     "name": "SEBT AIT IMOUR",
                     "city": 214
                    },
                    {
                     "name": "MEKNES",
                     "city": 220
                    },
                    {
                     "name": "AIN EL ORMA",
                     "city": 220
                    },
                    {
                     "name": "AIN JEMAA",
                     "city": 220
                    },
                    {
                     "name": "AIN KERMA",
                     "city": 220
                    },
                    {
                     "name": "AIT AISSA ADDI",
                     "city": 220
                    },
                    {
                     "name": "AIT OUALLAL",
                     "city": 220
                    },
                    {
                     "name": "AIT RAHHOU MJATT",
                     "city": 220
                    },
                    {
                     "name": "AL MACHOUAR STINIA",
                     "city": 220
                    },
                    {
                     "name": "BENI AMMAR",
                     "city": 220
                    },
                    {
                     "name": "BOUFAKRANE",
                     "city": 220
                    },
                    {
                     "name": "BRIDIA",
                     "city": 220
                    },
                    {
                     "name": "CHARQAOUA",
                     "city": 220
                    },
                    {
                     "name": "DAR OUM SOLTANE",
                     "city": 220
                    },
                    {
                     "name": "DKHISSA",
                     "city": 220
                    },
                    {
                     "name": "EL HADJ KADDOUR",
                     "city": 220
                    },
                    {
                     "name": "HAFRAT BEN TAYBI",
                     "city": 220
                    },
                    {
                     "name": "KERMAT BEN SALEM",
                     "city": 220
                    },
                    {
                     "name": "MOULAY IDRISS",
                     "city": 220
                    },
                    {
                     "name": "MOUSSAOUA",
                     "city": 220
                    },
                    {
                     "name": "MRHASSIYNE",
                     "city": 220
                    },
                    {
                     "name": "NZALATE BNI AMMAR",
                     "city": 220
                    },
                    {
                     "name": "OUED AL JADIDAH",
                     "city": 220
                    },
                    {
                     "name": "OUED ROMMANE",
                     "city": 220
                    },
                    {
                     "name": "OUISLANE",
                     "city": 220
                    },
                    {
                     "name": "SIDI ABDALLAH AL KHAYAT",
                     "city": 220
                    },
                    {
                     "name": "SIDI ALI BENHAMDOUCHE",
                     "city": 220
                    },
                    {
                     "name": "SIDI SLIMANE MJATT",
                     "city": 220
                    },
                    {
                     "name": "TNINE MHAYA",
                     "city": 220
                    },
                    {
                     "name": "TOULAL",
                     "city": 220
                    },
                    {
                     "name": "VOLUBILIS",
                     "city": 220
                    },
                    {
                     "name": "ZOUALET",
                     "city": 220
                    },
                    {
                     "name": "MOHAMMEDIA",
                     "city": 224
                    },
                    {
                     "name": "LA GARE",
                     "city": 224
                    },
                    {
                     "name": "EL ALIA",
                     "city": 224
                    },
                    {
                     "name": "EL HASSANIA",
                     "city": 224
                    },
                    {
                     "name": "LA COLLINE",
                     "city": 224
                    },
                    {
                     "name": "RACHIDIA",
                     "city": 224
                    },
                    {
                     "name": "PARK",
                     "city": 224
                    },
                    {
                     "name": "AIN HARROUDA",
                     "city": 224
                    },
                    {
                     "name": "BENI YAKHLEF",
                     "city": 224
                    },
                    {
                     "name": "ECH CHALLALATE",
                     "city": 224
                    },
                    {
                     "name": "SIDI MOUSSA BEN ALI",
                     "city": 224
                    },
                    {
                     "name": "SIDI MOUSSA MAJDOUB",
                     "city": 224
                    },
                    {
                     "name": "NADOR",
                     "city": 238
                    },
                    {
                     "name": "AAZANEN",
                     "city": 238
                    },
                    {
                     "name": "AFSOU",
                     "city": 238
                    },
                    {
                     "name": "AIT MAIT",
                     "city": 238
                    },
                    {
                     "name": "AL AAROUI",
                     "city": 238
                    },
                    {
                     "name": "AL BARKANYENE",
                     "city": 238
                    },
                    {
                     "name": "BENI BOU IFROUR",
                     "city": 238
                    },
                    {
                     "name": "BNI ANSAR",
                     "city": 238
                    },
                    {
                     "name": "BNI OUKIL",
                     "city": 238
                    },
                    {
                     "name": "BNI OUKIL OULAD MHAND",
                     "city": 238
                    },
                    {
                     "name": "BNI SIDEL LOUTA",
                     "city": 238
                    },
                    {
                     "name": "BOUARG",
                     "city": 238
                    },
                    {
                     "name": "FARKHANA",
                     "city": 238
                    },
                    {
                     "name": "HAD BNI CHIKER",
                     "city": 238
                    },
                    {
                     "name": "HASSI BERKANE",
                     "city": 238
                    },
                    {
                     "name": "IHADDADENE",
                     "city": 238
                    },
                    {
                     "name": "IKSANE",
                     "city": 238
                    },
                    {
                     "name": "KARIAT ARKMANE",
                     "city": 238
                    },
                    {
                     "name": "MECHRA KLILA",
                     "city": 238
                    },
                    {
                     "name": "MONTE ARRUI",
                     "city": 238
                    },
                    {
                     "name": "OULAD DAOUD ZKHANINE",
                     "city": 238
                    },
                    {
                     "name": "OULAD SETTOUT",
                     "city": 238
                    },
                    {
                     "name": "RAS EL MA",
                     "city": 238
                    },
                    {
                     "name": "SELOUANE",
                     "city": 238
                    },
                    {
                     "name": "TAOUIMA",
                     "city": 238
                    },
                    {
                     "name": "TIZTOUTINE",
                     "city": 238
                    },
                    {
                     "name": "TLETA JBEL",
                     "city": 238
                    },
                    {
                     "name": "ZAIO",
                     "city": 238
                    },
                    {
                     "name": "ZEGHANGHANE",
                     "city": 238
                    },
                    {
                     "name": "OUARZAZATE",
                     "city": 243
                    },
                    {
                     "name": "AIT BEN HADDOU",
                     "city": 243
                    },
                    {
                     "name": "AIT RIDI",
                     "city": 243
                    },
                    {
                     "name": "AIT SEDRATE JBEL",
                     "city": 243
                    },
                    {
                     "name": "AIT SEDRATE JBEL EL SOUFLA",
                     "city": 243
                    },
                    {
                     "name": "AIT ZINEB",
                     "city": 243
                    },
                    {
                     "name": "AMERZGANE",
                     "city": 243
                    },
                    {
                     "name": "ANMITER OUNILLA",
                     "city": 243
                    },
                    {
                     "name": "ANZAL",
                     "city": 243
                    },
                    {
                     "name": "ASDIF",
                     "city": 243
                    },
                    {
                     "name": "AZNAGUEN",
                     "city": 243
                    },
                    {
                     "name": "BOUAZZER",
                     "city": 243
                    },
                    {
                     "name": "DOUAR SOUR",
                     "city": 243
                    },
                    {
                     "name": "GHESSATE",
                     "city": 243
                    },
                    {
                     "name": "GUERNANE",
                     "city": 243
                    },
                    {
                     "name": "IDELSANE",
                     "city": 243
                    },
                    {
                     "name": "IGHIL NOUMGOUN",
                     "city": 243
                    },
                    {
                     "name": "IGHREM NOUGDAL",
                     "city": 243
                    },
                    {
                     "name": "IMASSINE",
                     "city": 243
                    },
                    {
                     "name": "IMI NOULAOUEN",
                     "city": 243
                    },
                    {
                     "name": "IMINI",
                     "city": 243
                    },
                    {
                     "name": "KHOUZAMA",
                     "city": 243
                    },
                    {
                     "name": "OUISSELSATE",
                     "city": 243
                    },
                    {
                     "name": "OUSSIKIS AIT AZZA",
                     "city": 243
                    },
                    {
                     "name": "SIROUA",
                     "city": 243
                    },
                    {
                     "name": "SKOURA AHL AL OUST",
                     "city": 243
                    },
                    {
                     "name": "TABERKHACHTE",
                     "city": 243
                    },
                    {
                     "name": "TABOURAHTE",
                     "city": 243
                    },
                    {
                     "name": "TALOUET",
                     "city": 243
                    },
                    {
                     "name": "TAMDAKHTE",
                     "city": 243
                    },
                    {
                     "name": "TAZNAKHT",
                     "city": 243
                    },
                    {
                     "name": "TIDLI",
                     "city": 243
                    },
                    {
                     "name": "TIOUINE",
                     "city": 243
                    },
                    {
                     "name": "TOUDGHA",
                     "city": 243
                    },
                    {
                     "name": "TOUNDOUTE",
                     "city": 243
                    },
                    {
                     "name": "ZAOUIT EL BIR",
                     "city": 243
                    },
                    {
                     "name": "RABAT",
                     "city": 272
                    },
                    {
                     "name": "BC RABAT MADINA",
                     "city": 272
                    },
                    {
                     "name": "RABAT AL MANAL",
                     "city": 272
                    },
                    {
                     "name": "AKKARI",
                     "city": 272
                    },
                    {
                     "name": "YACOUB EL MANSOUR",
                     "city": 272
                    },
                    {
                     "name": "HAY EL KHAIR",
                     "city": 272
                    },
                    {
                     "name": "MOHAMED V",
                     "city": 272
                    },
                    {
                     "name": "EL MENZEH",
                     "city": 272
                    },
                    {
                     "name": "LA GARE",
                     "city": 272
                    },
                    {
                     "name": "AGENCE MOBILLE RABAT",
                     "city": 272
                    },
                    {
                     "name": "FAL OULED OUMEIR",
                     "city": 272
                    },
                    {
                     "name": "CHALLAH",
                     "city": 272
                    },
                    {
                     "name": "NATIONS UNIES",
                     "city": 272
                    },
                    {
                     "name": "AL INBIAT",
                     "city": 272
                    },
                    {
                     "name": "RYAD",
                     "city": 272
                    },
                    {
                     "name": "SOUISSI",
                     "city": 272
                    },
                    {
                     "name": "AGDAL",
                     "city": 272
                    },
                    {
                     "name": "MADINAT AL IRFANE",
                     "city": 272
                    },
                    {
                     "name": "ANNAKHIL",
                     "city": 272
                    },
                    {
                     "name": "ENNAHDA",
                     "city": 272
                    },
                    {
                     "name": "OCEAN",
                     "city": 272
                    },
                    {
                     "name": "CITE YOUSSOUFIA",
                     "city": 272
                    },
                    {
                     "name": "HAY EL AMAL",
                     "city": 272
                    },
                    {
                     "name": "AL MASSIRA",
                     "city": 272
                    },
                    {
                     "name": "DIOUR JEMAA",
                     "city": 272
                    },
                    {
                     "name": "AIT HAMMOU",
                     "city": 315
                    },
                    {
                     "name": "AIT HAMMOU",
                     "city": 315
                    },
                    {
                     "name": "AIT TALEB",
                     "city": 315
                    },
                    {
                     "name": "AKERMA",
                     "city": 315
                    },
                    {
                     "name": "BENGUERIR",
                     "city": 315
                    },
                    {
                     "name": "BOURROUS",
                     "city": 315
                    },
                    {
                     "name": "HAD JAAFRA",
                     "city": 315
                    },
                    {
                     "name": "JAIDATE",
                     "city": 315
                    },
                    {
                     "name": "JBILATE",
                     "city": 315
                    },
                    {
                     "name": "LAMHARRA",
                     "city": 315
                    },
                    {
                     "name": "NZALATE LAADIM",
                     "city": 315
                    },
                    {
                     "name": "OULAD AAMER TIZMARINE",
                     "city": 315
                    },
                    {
                     "name": "OULAD HASSOUNE HAMRI",
                     "city": 315
                    },
                    {
                     "name": "OULAD IMLOUL",
                     "city": 315
                    },
                    {
                     "name": "RAS AIN RHAMNA",
                     "city": 315
                    },
                    {
                     "name": "SEBT BRIKYINE",
                     "city": 315
                    },
                    {
                     "name": "SIDI ABDALLAH",
                     "city": 315
                    },
                    {
                     "name": "SIDI ALI LABRAHLA",
                     "city": 315
                    },
                    {
                     "name": "SIDI BOU OTHMANE",
                     "city": 315
                    },
                    {
                     "name": "SIDI BOUBKER",
                     "city": 315
                    },
                    {
                     "name": "SIDI GHANEM",
                     "city": 315
                    },
                    {
                     "name": "SIDI MANSOUR",
                     "city": 315
                    },
                    {
                     "name": "SKHOUR REHAMNA",
                     "city": 315
                    },
                    {
                     "name": "SKOURA LHADRA",
                     "city": 315
                    },
                    {
                     "name": "TLAUH",
                     "city": 315
                    },
                    {
                     "name": "TNINE BOUCHANE",
                     "city": 315
                    },
                    {
                     "name": "TNINE MHARA",
                     "city": 315
                    },
                    {
                     "name": "SAFI",
                     "city": 279
                    },
                    {
                     "name": "ARBAA KHATTAZAKARNE",
                     "city": 279
                    },
                    {
                     "name": "ATOUABET",
                     "city": 279
                    },
                    {
                     "name": "BEDDOUZA",
                     "city": 279
                    },
                    {
                     "name": "CHAHDA",
                     "city": 279
                    },
                    {
                     "name": "DAR SI AISSA",
                     "city": 279
                    },
                    {
                     "name": "EL GOURAANI",
                     "city": 279
                    },
                    {
                     "name": "HAD HARARA",
                     "city": 279
                    },
                    {
                     "name": "JAMAAT SHAIM",
                     "city": 279
                    },
                    {
                     "name": "KHEMIS NGA",
                     "city": 279
                    },
                    {
                     "name": "LAAMAMRA",
                     "city": 279
                    },
                    {
                     "name": "LABKHATI",
                     "city": 279
                    },
                    {
                     "name": "LAHDAR",
                     "city": 279
                    },
                    {
                     "name": "LAMAACHATE",
                     "city": 279
                    },
                    {
                     "name": "LAMRASLA",
                     "city": 279
                    },
                    {
                     "name": "LAMSABIH",
                     "city": 279
                    },
                    {
                     "name": "MOUL BERGUI",
                     "city": 279
                    },
                    {
                     "name": "OULED SELMANE",
                     "city": 279
                    },
                    {
                     "name": "SAADLA",
                     "city": 279
                    },
                    {
                     "name": "SEBT GZOULA",
                     "city": 279
                    },
                    {
                     "name": "SIDI TIJI",
                     "city": 279
                    },
                    {
                     "name": "SOUIRA KEDIMA",
                     "city": 279
                    },
                    {
                     "name": "SOUK EYR",
                     "city": 279
                    },
                    {
                     "name": "TLETA SIDI AISSA",
                     "city": 279
                    },
                    {
                     "name": "TLETA SIDI BOUGUEDRA",
                     "city": 279
                    },
                    {
                     "name": "TNINE RHIATE",
                     "city": 279
                    },
                    {
                     "name": "SALE",
                     "city": 280
                    },
                    {
                     "name": "AMEUR",
                     "city": 280
                    },
                    {
                     "name": "ARBAA SHOUL",
                     "city": 280
                    },
                    {
                     "name": "BOUKNADEL",
                     "city": 280
                    },
                    {
                     "name": "EL ARJATE",
                     "city": 280
                    },
                    {
                     "name": "SALA AL JADIDA",
                     "city": 280
                    },
                    {
                     "name": "SETTAT",
                     "city": 287
                    },
                    {
                     "name": "AIN DORBANE",
                     "city": 287
                    },
                    {
                     "name": "AIN NZARH",
                     "city": 287
                    },
                    {
                     "name": "ARBA OULAD BOU ALI",
                     "city": 287
                    },
                    {
                     "name": "BEN AHMED",
                     "city": 287
                    },
                    {
                     "name": "BNI KHLOUG",
                     "city": 287
                    },
                    {
                     "name": "BNI YAGRINE",
                     "city": 287
                    },
                    {
                     "name": "BOUGUARGOUH",
                     "city": 287
                    },
                    {
                     "name": "DAR CHAFFAI",
                     "city": 287
                    },
                    {
                     "name": "DEROUA OULAD ZIANE",
                     "city": 287
                    },
                    {
                     "name": "DOUAR OULED NACEUR",
                     "city": 287
                    },
                    {
                     "name": "EL BOROUJ",
                     "city": 287
                    },
                    {
                     "name": "GHNIMIYNE",
                     "city": 287
                    },
                    {
                     "name": "GUISSER",
                     "city": 287
                    },
                    {
                     "name": "HAD MZOURA",
                     "city": 287
                    },
                    {
                     "name": "IMFOUT",
                     "city": 287
                    },
                    {
                     "name": "KHEMIS GDANA",
                     "city": 287
                    },
                    {
                     "name": "KHEMISSET CHAOUIA",
                     "city": 287
                    },
                    {
                     "name": "KRAKRA",
                     "city": 287
                    },
                    {
                     "name": "LAHLAF MZAB",
                     "city": 287
                    },
                    {
                     "name": "LAHOUAZA",
                     "city": 287
                    },
                    {
                     "name": "LAKHZAZRA",
                     "city": 287
                    },
                    {
                     "name": "MECHRA BEN ABBOU",
                     "city": 287
                    },
                    {
                     "name": "MESKOURA",
                     "city": 287
                    },
                    {
                     "name": "MGARTO",
                     "city": 287
                    },
                    {
                     "name": "MNIAA",
                     "city": 287
                    },
                    {
                     "name": "MRIZIG",
                     "city": 287
                    },
                    {
                     "name": "MZAMZA JANOUBIA",
                     "city": 287
                    },
                    {
                     "name": "NKHILA",
                     "city": 287
                    },
                    {
                     "name": "OUED BERS",
                     "city": 287
                    },
                    {
                     "name": "OUED NAANAA",
                     "city": 287
                    },
                    {
                     "name": "OULAD AAFIF",
                     "city": 287
                    },
                    {
                     "name": "OULAD AMERA",
                     "city": 287
                    },
                    {
                     "name": "OULAD BELKACEM",
                     "city": 287
                    },
                    {
                     "name": "OULAD CHBANA",
                     "city": 287
                    },
                    {
                     "name": "OULAD DRISS",
                     "city": 287
                    },
                    {
                     "name": "OULAD HAMMOU",
                     "city": 287
                    },
                    {
                     "name": "OULAD MHAMED",
                     "city": 287
                    },
                    {
                     "name": "OULAD MRAH",
                     "city": 287
                    },
                    {
                     "name": "OULAD N'JIMA",
                     "city": 287
                    },
                    {
                     "name": "OULAD SAID",
                     "city": 287
                    },
                    {
                     "name": "OULAD ZIANE",
                     "city": 287
                    },
                    {
                     "name": "OULED ZIDANE",
                     "city": 287
                    },
                    {
                     "name": "RAS EL AIN",
                     "city": 287
                    },
                    {
                     "name": "RIMA",
                     "city": 287
                    },
                    {
                     "name": "SEBT OULAD FRIHA",
                     "city": 287
                    },
                    {
                     "name": "SGAMNA",
                     "city": 287
                    },
                    {
                     "name": "SIDI ABDELKRIM",
                     "city": 287
                    },
                    {
                     "name": "SIDI AHMED EL KHADIR",
                     "city": 287
                    },
                    {
                     "name": "SIDI BOUMEHDI",
                     "city": 287
                    },
                    {
                     "name": "SIDI DAHBI",
                     "city": 287
                    },
                    {
                     "name": "SIDI EL AIDI",
                     "city": 287
                    },
                    {
                     "name": "SIDI HAJJAJ",
                     "city": 287
                    },
                    {
                     "name": "SIDI MOHAMMED BEN RAHAL",
                     "city": 287
                    },
                    {
                     "name": "SIDI RAHHAL CHAOUIA",
                     "city": 287
                    },
                    {
                     "name": "SIDI RAHHAL PLAGE",
                     "city": 287
                    },
                    {
                     "name": "SIDI SAID MAACHOU",
                     "city": 287
                    },
                    {
                     "name": "TAMADROUST",
                     "city": 287
                    },
                    {
                     "name": "TLETA AIN BLAL",
                     "city": 287
                    },
                    {
                     "name": "TLETA LOULAD",
                     "city": 287
                    },
                    {
                     "name": "TLETA OULAD FARES",
                     "city": 287
                    },
                    {
                     "name": "TLETA OULAD SGHIR",
                     "city": 287
                    },
                    {
                     "name": "TNINE TOUALET",
                     "city": 287
                    },
                    {
                     "name": "ZEMAMRA CHAOUIA",
                     "city": 287
                    },
                    {
                     "name": "SIDI BENNOUR",
                     "city": 296
                    },
                    {
                     "name": "ARBAA AOUNATE",
                     "city": 296
                    },
                    {
                     "name": "BNI TSIRISS",
                     "city": 296
                    },
                    {
                     "name": "BOUHMAME",
                     "city": 296
                    },
                    {
                     "name": "EL HAGAGCHA",
                     "city": 296
                    },
                    {
                     "name": "EL MECHREK",
                     "city": 296
                    },
                    {
                     "name": "JABRIA",
                     "city": 296
                    },
                    {
                     "name": "KHEMIS KSIBA",
                     "city": 296
                    },
                    {
                     "name": "KOUDIAT BNI DGHOUGH",
                     "city": 296
                    },
                    {
                     "name": "KRIDID",
                     "city": 296
                    },
                    {
                     "name": "LAATATRA",
                     "city": 296
                    },
                    {
                     "name": "LAGHNADRA",
                     "city": 296
                    },
                    {
                     "name": "MATRANN",
                     "city": 296
                    },
                    {
                     "name": "MTAL",
                     "city": 296
                    },
                    {
                     "name": "OUALIDIA",
                     "city": 296
                    },
                    {
                     "name": "OULAD BOUSSAKEN",
                     "city": 296
                    },
                    {
                     "name": "OULAD SBAITA",
                     "city": 296
                    },
                    {
                     "name": "OULAD SI BOUHYA",
                     "city": 296
                    },
                    {
                     "name": "OULED AMRANE",
                     "city": 296
                    },
                    {
                     "name": "SEBT BENI HLAL",
                     "city": 296
                    },
                    {
                     "name": "SIDI BENNOUR",
                     "city": 296
                    },
                    {
                     "name": "TAMDA",
                     "city": 296
                    },
                    {
                     "name": "TNINE GHARBIA",
                     "city": 296
                    },
                    {
                     "name": "LAAMRIA",
                     "city": 296
                    },
                    {
                     "name": "TANGER",
                     "city": 346
                    },
                    {
                     "name": "AL MANZLA",
                     "city": 346
                    },
                    {
                     "name": "AQUOUASS BRIECH",
                     "city": 346
                    },
                    {
                     "name": "ASSILAH",
                     "city": 346
                    },
                    {
                     "name": "BOUKHALEF",
                     "city": 346
                    },
                    {
                     "name": "DAR CHAOUI",
                     "city": 346
                    },
                    {
                     "name": "GZENAYA",
                     "city": 346
                    },
                    {
                     "name": "HAD RHARBIA",
                     "city": 346
                    },
                    {
                     "name": "HAJR ENHAL",
                     "city": 346
                    },
                    {
                     "name": "LKHALOUA",
                     "city": 346
                    },
                    {
                     "name": "SAHEL CHAMALI",
                     "city": 346
                    },
                    {
                     "name": "SANIA EL JADIDA",
                     "city": 346
                    },
                    {
                     "name": "SEBT ZENIATE",
                     "city": 346
                    },
                    {
                     "name": "TNINE SIDI EL YAMANI",
                     "city": 346
                    },
                    {
                     "name": "TATA",
                     "city": 354
                    },
                    {
                     "name": "AGUERD TAMANART",
                     "city": 354
                    },
                    {
                     "name": "AGUINANE",
                     "city": 354
                    },
                    {
                     "name": "AIT OUABELLI",
                     "city": 354
                    },
                    {
                     "name": "AKKA",
                     "city": 354
                    },
                    {
                     "name": "AKKA IGHANE",
                     "city": 354
                    },
                    {
                     "name": "ALLOUGOUM",
                     "city": 354
                    },
                    {
                     "name": "FAM EL HISN",
                     "city": 354
                    },
                    {
                     "name": "FOUM ZGUID",
                     "city": 354
                    },
                    {
                     "name": "IBN YACOUB",
                     "city": 354
                    },
                    {
                     "name": "KASBAT SIDI ABDELLAH BEN MBAREK",
                     "city": 354
                    },
                    {
                     "name": "KHEMIS ADDIS",
                     "city": 354
                    },
                    {
                     "name": "KHEMIS ISSAFEN",
                     "city": 354
                    },
                    {
                     "name": "LAKHRIOUIA",
                     "city": 354
                    },
                    {
                     "name": "OUM EL GUERDANE",
                     "city": 354
                    },
                    {
                     "name": "TATA",
                     "city": 354
                    },
                    {
                     "name": "TIGZMERTE",
                     "city": 354
                    },
                    {
                     "name": "TISSINT",
                     "city": 354
                    },
                    {
                     "name": "TIZAGHTE",
                     "city": 354
                    },
                    {
                     "name": "TIZOUININE",
                     "city": 354
                    },
                    {
                     "name": "TLATA TAGMOUTE",
                     "city": 354
                    },
                    {
                     "name": "TLITE",
                     "city": 354
                    },
                    {
                     "name": "TAZA",
                     "city": 355
                    },
                    {
                     "name": "AIN BOUMASSAY",
                     "city": 355
                    },
                    {
                     "name": "AIN EL FENDEL",
                     "city": 355
                    },
                    {
                     "name": "AIN EL HAMRA",
                     "city": 355
                    },
                    {
                     "name": "AKNOUL",
                     "city": 355
                    },
                    {
                     "name": "AOURA",
                     "city": 355
                    },
                    {
                     "name": "ARBAA BENI FTAH",
                     "city": 355
                    },
                    {
                     "name": "BAB BOUIDIR",
                     "city": 355
                    },
                    {
                     "name": "BAB EL MROUJ",
                     "city": 355
                    },
                    {
                     "name": "BAB MARZOUKA",
                     "city": 355
                    },
                    {
                     "name": "BECHIYINE",
                     "city": 355
                    },
                    {
                     "name": "BENI ALI",
                     "city": 355
                    },
                    {
                     "name": "BENI LENNT",
                     "city": 355
                    },
                    {
                     "name": "BENI MGARA",
                     "city": 355
                    },
                    {
                     "name": "BOUCHFAA",
                     "city": 355
                    },
                    {
                     "name": "BOUHLOU",
                     "city": 355
                    },
                    {
                     "name": "BOURED",
                     "city": 355
                    },
                    {
                     "name": "BOUYABLANE",
                     "city": 355
                    },
                    {
                     "name": "BOUZEMLANE",
                     "city": 355
                    },
                    {
                     "name": "BRARHA",
                     "city": 355
                    },
                    {
                     "name": "EL GOUZAT",
                     "city": 355
                    },
                    {
                     "name": "GUELDAMANE",
                     "city": 355
                    },
                    {
                     "name": "GZENAYA AL JANOUBIA",
                     "city": 355
                    },
                    {
                     "name": "HAD MSILA",
                     "city": 355
                    },
                    {
                     "name": "HAD OULAD ZBAIR",
                     "city": 355
                    },
                    {
                     "name": "IFRANE AIT ASSOU",
                     "city": 355
                    },
                    {
                     "name": "INAHNAHEN",
                     "city": 355
                    },
                    {
                     "name": "JBARNA",
                     "city": 355
                    },
                    {
                     "name": "KAHF EL RHAR",
                     "city": 355
                    },
                    {
                     "name": "KAOUANE",
                     "city": 355
                    },
                    {
                     "name": "KASSARAT",
                     "city": 355
                    },
                    {
                     "name": "MAHIRIJA",
                     "city": 355
                    },
                    {
                     "name": "MATMATA",
                     "city": 355
                    },
                    {
                     "name": "MEKNASSA ACHARQIA",
                     "city": 355
                    },
                    {
                     "name": "MERHRAOUA",
                     "city": 355
                    },
                    {
                     "name": "MSOUN",
                     "city": 355
                    },
                    {
                     "name": "OUED AMLIL",
                     "city": 355
                    },
                    {
                     "name": "OUED EL MALEH",
                     "city": 355
                    },
                    {
                     "name": "OUED LAHMAR",
                     "city": 355
                    },
                    {
                     "name": "OULAD CHRIF",
                     "city": 355
                    },
                    {
                     "name": "RBAA EL FOUKI",
                     "city": 355
                    },
                    {
                     "name": "RCHIDA",
                     "city": 355
                    },
                    {
                     "name": "SEBT BNI FRASSEN",
                     "city": 355
                    },
                    {
                     "name": "SIDI ALI BENNACER",
                     "city": 355
                    },
                    {
                     "name": "SIDI ALI BOURAKBA",
                     "city": 355
                    },
                    {
                     "name": "SKOURA SEGHROUCHEN",
                     "city": 355
                    },
                    {
                     "name": "SMIAA",
                     "city": 355
                    },
                    {
                     "name": "TAHLA",
                     "city": 355
                    },
                    {
                     "name": "TAINESTE",
                     "city": 355
                    },
                    {
                     "name": "TAZARINE MSARA",
                     "city": 355
                    },
                    {
                     "name": "TIGHEZRATINE",
                     "city": 355
                    },
                    {
                     "name": "TIGHZA",
                     "city": 355
                    },
                    {
                     "name": "TIZI OUZLI",
                     "city": 355
                    },
                    {
                     "name": "TLATA TRAIBA",
                     "city": 355
                    },
                    {
                     "name": "TNINE TAIFA",
                     "city": 355
                    },
                    {
                     "name": "TOUAHAR",
                     "city": 355
                    },
                    {
                     "name": "ZAOUIA SIDI ABDEJLIL",
                     "city": 355
                    },
                    {
                     "name": "ZERARDA",
                     "city": 355
                    },
                    {
                     "name": "TETOUAN",
                     "city": 382
                    },
                    {
                     "name": "AIN LAHSAN",
                     "city": 382
                    },
                    {
                     "name": "AL HAMRA",
                     "city": 382
                    },
                    {
                     "name": "AL KHRROUB",
                     "city": 382
                    },
                    {
                     "name": "AL OUED",
                     "city": 382
                    },
                    {
                     "name": "ASMATEN",
                     "city": 382
                    },
                    {
                     "name": "AZLA",
                     "city": 382
                    },
                    {
                     "name": "BENI YDER",
                     "city": 382
                    },
                    {
                     "name": "BGHAGHZA",
                     "city": 382
                    },
                    {
                     "name": "BNI HARCHEN",
                     "city": 382
                    },
                    {
                     "name": "BNI KARRICH FOUKI",
                     "city": 382
                    },
                    {
                     "name": "BNI LEIT",
                     "city": 382
                    },
                    {
                     "name": "BNI SAID",
                     "city": 382
                    },
                    {
                     "name": "DAR BEN SADDOUK",
                     "city": 382
                    },
                    {
                     "name": "EL FENDEQ",
                     "city": 382
                    },
                    {
                     "name": "JEMAA EL OUED",
                     "city": 382
                    },
                    {
                     "name": "MALLALIENNE",
                     "city": 382
                    },
                    {
                     "name": "OUED LAOU",
                     "city": 382
                    },
                    {
                     "name": "OULAD ALI MANSOUR",
                     "city": 382
                    },
                    {
                     "name": "SADDINA",
                     "city": 382
                    },
                    {
                     "name": "SAHTRYINE",
                     "city": 382
                    },
                    {
                     "name": "SOUK KDIM",
                     "city": 382
                    },
                    {
                     "name": "ZAITOUNE",
                     "city": 382
                    },
                    {
                     "name": "ZAOUIA SIDI KACEM",
                     "city": 382
                    },
                    {
                     "name": "TIZNIT",
                     "city": 373
                    },
                    {
                     "name": "ADAY ALMEZOUARTE",
                     "city": 373
                    },
                    {
                     "name": "AGLOU PLAGE",
                     "city": 373
                    },
                    {
                     "name": "AIT BRAHIM OU YOUSSEF",
                     "city": 373
                    },
                    {
                     "name": "AIT ISSAFEN",
                     "city": 373
                    },
                    {
                     "name": "AMMELNE",
                     "city": 373
                    },
                    {
                     "name": "ANAMEUR",
                     "city": 373
                    },
                    {
                     "name": "ANEZI",
                     "city": 373
                    },
                    {
                     "name": "ARBA AIT AHMED",
                     "city": 373
                    },
                    {
                     "name": "ARBAA RAS MOUKA",
                     "city": 373
                    },
                    {
                     "name": "ARBAA SAHEL",
                     "city": 373
                    },
                    {
                     "name": "BOUZERZ",
                     "city": 373
                    },
                    {
                     "name": "EL KREIMA",
                     "city": 373
                    },
                    {
                     "name": "EL MAADER EL KEBIR",
                     "city": 373
                    },
                    {
                     "name": "HAD AFFELA IRHIR",
                     "city": 373
                    },
                    {
                     "name": "HAD RAGGADA",
                     "city": 373
                    },
                    {
                     "name": "HAD TAHALA",
                     "city": 373
                    },
                    {
                     "name": "IGHIR MELLOULEN",
                     "city": 373
                    },
                    {
                     "name": "IGHREM OULAD JERRAR",
                     "city": 373
                    },
                    {
                     "name": "IZERBI",
                     "city": 373
                    },
                    {
                     "name": "JEMAA IDA OUSSEMLAL",
                     "city": 373
                    },
                    {
                     "name": "KHEMIS AIT OUFKA",
                     "city": 373
                    },
                    {
                     "name": "LAOUINA",
                     "city": 373
                    },
                    {
                     "name": "OU MESNATE",
                     "city": 373
                    },
                    {
                     "name": "OULAD JERRAR",
                     "city": 373
                    },
                    {
                     "name": "OULED NOUMMEUR",
                     "city": 373
                    },
                    {
                     "name": "SEBT BOUNAAMANE",
                     "city": 373
                    },
                    {
                     "name": "SEBT OUIJJANE",
                     "city": 373
                    },
                    {
                     "name": "SEBT TAFRAOUTE",
                     "city": 373
                    },
                    {
                     "name": "SIDI BOUABDELLI",
                     "city": 373
                    },
                    {
                     "name": "SIDI MBARK",
                     "city": 373
                    },
                    {
                     "name": "TAFRAOUT",
                     "city": 373
                    },
                    {
                     "name": "TAFRAOUT EL MOULOUD",
                     "city": 373
                    },
                    {
                     "name": "TAFRAOUTE NAIT DAOUD",
                     "city": 373
                    },
                    {
                     "name": "TANFIT AIT OUMZIL",
                     "city": 373
                    },
                    {
                     "name": "TIFERMITE",
                     "city": 373
                    },
                    {
                     "name": "TIRHMI",
                     "city": 373
                    },
                    {
                     "name": "TIZNIT",
                     "city": 373
                    },
                    {
                     "name": "TIZOUGHANE",
                     "city": 373
                    },
                    {
                     "name": "TLATA IDA GOUGMAR",
                     "city": 373
                    },
                    {
                     "name": "TLETA TASSRIRT",
                     "city": 373
                    },
                    {
                     "name": "TLETA TIDLI",
                     "city": 373
                    },
                    {
                     "name": "TNINE AGLOU",
                     "city": 373
                    },
                    {
                     "name": "TNINE TARSOUAT",
                     "city": 373
                    },
                    {
                     "name": "TOUBOUZAR",
                     "city": 373
                    },
                    {
                     "name": "ZAOUIA SIDI AHMED OU MOUSSA",
                     "city": 373
                    },
                    {
                     "name": "ZAGORA",
                     "city": 385
                    },
                    {
                     "name": "AFELLA NDRA",
                     "city": 385
                    },
                    {
                     "name": "AFRA",
                     "city": 385
                    },
                    {
                     "name": "AGDZ",
                     "city": 385
                    },
                    {
                     "name": "AIT BOUDAOUD",
                     "city": 385
                    },
                    {
                     "name": "AIT OUALLAL",
                     "city": 385
                    },
                    {
                     "name": "AIT SAOUN",
                     "city": 385
                    },
                    {
                     "name": "BLEIDA",
                     "city": 385
                    },
                    {
                     "name": "BNI ZOLI",
                     "city": 385
                    },
                    {
                     "name": "BOUZEROUAL",
                     "city": 385
                    },
                    {
                     "name": "DOUAR SITE",
                     "city": 385
                    },
                    {
                     "name": "EL BLIDA",
                     "city": 385
                    },
                    {
                     "name": "ERROUHA",
                     "city": 385
                    },
                    {
                     "name": "FEZOUATA",
                     "city": 385
                    },
                    {
                     "name": "KTAOUA",
                     "city": 385
                    },
                    {
                     "name": "MEZGUITA",
                     "city": 385
                    },
                    {
                     "name": "MHAMID GHIZLANE",
                     "city": 385
                    },
                    {
                     "name": "NESRATE",
                     "city": 385
                    },
                    {
                     "name": "NKOB",
                     "city": 385
                    },
                    {
                     "name": "OULAD DRISS EL GHOUZLANE",
                     "city": 385
                    },
                    {
                     "name": "OULAD YAHIA LAGRAIRE",
                     "city": 385
                    },
                    {
                     "name": "TAFTECHNA",
                     "city": 385
                    },
                    {
                     "name": "TAGOUNITE",
                     "city": 385
                    },
                    {
                     "name": "TAMEGROUTE",
                     "city": 385
                    },
                    {
                     "name": "TAMEZMOUTE",
                     "city": 385
                    },
                    {
                     "name": "TANSSIFTE",
                     "city": 385
                    },
                    {
                     "name": "TARHBALTE",
                     "city": 385
                    },
                    {
                     "name": "TAZZARINE",
                     "city": 385
                    },
                    {
                     "name": "TERNATA",
                     "city": 385
                    },
                    {
                     "name": "TINZOULINE",
                     "city": 385
                    },
                    {
                     "name": "ZAGORA",
                     "city": 385
                    },
                    {
                     "name": "ZAOUIA KADIRIA",
                     "city": 385
                    },
                    {
                     "name": "ZAOUIT SIDI SALAH",
                     "city": 385
                    }
                   ];
    
                const addSecteurs = async() => {
                    for (let i = 0; i < secteurs.length; i++) {
                        const secteur = secteurs[i];
                        const existingSecteur = await Secteur.findOne({ name: secteur.name });
                        if (!existingSecteur) {
                            const newSecteur = new Secteur(secteur);
                            await newSecteur.save();
                        }
                    }
                };
    
                addSecteurs();
                const cities = [
                  {
                      "id": "0",
                      "name": "Afourar",
                      "region": "5"
                  },
                  {
                      "id": "1",
                      "name": "Agadir",
                      "region": "9"
                  },
                  {
                      "id": "2",
                      "name": "Agdz",
                      "region": "8"
                  },
                  {
                      "id": "3",
                      "name": "Aghbala",
                      "region": "5"
                  },
                  {
                      "id": "4",
                      "name": "Agni Izimmer",
                      "region": "9"
                  },
                  {
                      "id": "5",
                      "name": "Agourai",
                      "region": "3"
                  },
                  {
                      "id": "6",
                      "name": "Ahfir",
                      "region": "2"
                  },
                  {
                      "id": "7",
                      "name": "Ain El Aouda",
                      "region": "4"
                  },
                  {
                      "id": "8",
                      "name": "Ain Taoujdate",
                      "region": "3"
                  },
                  {
                      "id": "9",
                      "name": "Ait Daoud",
                      "region": "7"
                  },
                  {
                      "id": "10",
                      "name": "Ajdir‎",
                      "region": "1"
                  },
                  {
                      "id": "11",
                      "name": "Akchour",
                      "region": "1"
                  },
                  {
                      "id": "12",
                      "name": "Akka",
                      "region": "9"
                  },
                  {
                      "id": "13",
                      "name": "Aklim",
                      "region": "2"
                  },
                  {
                      "id": "14",
                      "name": "Aknoul‎",
                      "region": "3"
                  },
                  {
                      "id": "15",
                      "name": "Al Aroui",
                      "region": "2"
                  },
                  {
                      "id": "16",
                      "name": "Al Hoceïma‎",
                      "region": "1"
                  },
                  {
                      "id": "17",
                      "name": "Alnif",
                      "region": "8"
                  },
                  {
                      "id": "18",
                      "name": "Amalou Ighriben",
                      "region": "5"
                  },
                  {
                      "id": "19",
                      "name": "Amizmiz",
                      "region": "7"
                  },
                  {
                      "id": "20",
                      "name": "Anzi",
                      "region": "9"
                  },
                  {
                      "id": "21",
                      "name": "Aoufous",
                      "region": "8"
                  },
                  {
                      "id": "22",
                      "name": "Aoulouz",
                      "region": "9"
                  },
                  {
                      "id": "23",
                      "name": "Aourir",
                      "region": "9"
                  },
                  {
                      "id": "24",
                      "name": "Arazane",
                      "region": "9"
                  },
                  {
                      "id": "25",
                      "name": "Arbaoua",
                      "region": "4"
                  },
                  {
                      "id": "26",
                      "name": "Arfoud",
                      "region": "8"
                  },
                  {
                      "id": "27",
                      "name": "Assa",
                      "region": "10"
                  },
                  {
                      "id": "28",
                      "name": "Assahrij",
                      "region": "7"
                  },
                  {
                      "id": "29",
                      "name": "Assilah",
                      "region": "1"
                  },
                  {
                      "id": "30",
                      "name": "Awsard",
                      "region": "12"
                  },
                  {
                      "id": "31",
                      "name": "Azemmour",
                      "region": "6"
                  },
                  {
                      "id": "32",
                      "name": "Azilal",
                      "region": "5"
                  },
                  {
                      "id": "33",
                      "name": "Azrou",
                      "region": "3"
                  },
                  {
                      "id": "34",
                      "name": "Aïn Bni Mathar",
                      "region": "2"
                  },
                  {
                      "id": "35",
                      "name": "Aïn Cheggag",
                      "region": "3"
                  },
                  {
                      "id": "36",
                      "name": "Aïn Dorij",
                      "region": "1"
                  },
                  {
                      "id": "37",
                      "name": "Aïn Erreggada",
                      "region": "2"
                  },
                  {
                      "id": "38",
                      "name": "Aïn Harrouda",
                      "region": "6"
                  },
                  {
                      "id": "39",
                      "name": "Aïn Jemaa",
                      "region": "3"
                  },
                  {
                      "id": "40",
                      "name": "Aïn Karma",
                      "region": "3"
                  },
                  {
                      "id": "41",
                      "name": "Aïn Leuh",
                      "region": "3"
                  },
                  {
                      "id": "42",
                      "name": "Aït Attab",
                      "region": "5"
                  },
                  {
                      "id": "43",
                      "name": "Aït Baha",
                      "region": "9"
                  },
                  {
                      "id": "44",
                      "name": "Aït Boubidmane",
                      "region": "3"
                  },
                  {
                      "id": "45",
                      "name": "Aït Hichem‎",
                      "region": "1"
                  },
                  {
                      "id": "46",
                      "name": "Aït Iaâza",
                      "region": "9"
                  },
                  {
                      "id": "47",
                      "name": "Aït Ishaq",
                      "region": "5"
                  },
                  {
                      "id": "48",
                      "name": "Aït Majden",
                      "region": "5"
                  },
                  {
                      "id": "49",
                      "name": "Aït Melloul",
                      "region": "9"
                  },
                  {
                      "id": "50",
                      "name": "Aït Ourir",
                      "region": "7"
                  },
                  {
                      "id": "51",
                      "name": "Aït Yalla",
                      "region": "8"
                  },
                  {
                      "id": "52",
                      "name": "Bab Berred",
                      "region": "1"
                  },
                  {
                      "id": "53",
                      "name": "Bab Taza",
                      "region": "1"
                  },
                  {
                      "id": "54",
                      "name": "Bejaâd",
                      "region": "5"
                  },
                  {
                      "id": "55",
                      "name": "Ben Ahmed",
                      "region": "6"
                  },
                  {
                      "id": "56",
                      "name": "Ben Guerir",
                      "region": "7"
                  },
                  {
                      "id": "57",
                      "name": "Ben Sergao",
                      "region": "9"
                  },
                  {
                      "id": "58",
                      "name": "Ben Taïeb",
                      "region": "2"
                  },
                  {
                      "id": "59",
                      "name": "Ben Yakhlef",
                      "region": "6"
                  },
                  {
                      "id": "60",
                      "name": "Beni Ayat",
                      "region": "5"
                  },
                  {
                      "id": "61",
                      "name": "Benslimane",
                      "region": "6"
                  },
                  {
                      "id": "62",
                      "name": "Berkane",
                      "region": "2"
                  },
                  {
                      "id": "63",
                      "name": "Berrechid",
                      "region": "6"
                  },
                  {
                      "id": "64",
                      "name": "Bhalil",
                      "region": "3"
                  },
                  {
                      "id": "65",
                      "name": "Bin elouidane",
                      "region": "5"
                  },
                  {
                      "id": "66",
                      "name": "Biougra",
                      "region": "9"
                  },
                  {
                      "id": "67",
                      "name": "Bir Jdid",
                      "region": "6"
                  },
                  {
                      "id": "68",
                      "name": "Bni Ansar",
                      "region": "2"
                  },
                  {
                      "id": "69",
                      "name": "Bni Bouayach‎",
                      "region": "1"
                  },
                  {
                      "id": "70",
                      "name": "Bni Chiker",
                      "region": "2"
                  },
                  {
                      "id": "71",
                      "name": "Bni Drar",
                      "region": "2"
                  },
                  {
                      "id": "72",
                      "name": "Bni Hadifa‎",
                      "region": "1"
                  },
                  {
                      "id": "73",
                      "name": "Bni Tadjite",
                      "region": "2"
                  },
                  {
                      "id": "74",
                      "name": "Bouanane",
                      "region": "2"
                  },
                  {
                      "id": "75",
                      "name": "Bouarfa",
                      "region": "2"
                  },
                  {
                      "id": "76",
                      "name": "Boudnib",
                      "region": "8"
                  },
                  {
                      "id": "77",
                      "name": "Boufakrane",
                      "region": "3"
                  },
                  {
                      "id": "78",
                      "name": "Bouguedra",
                      "region": "7"
                  },
                  {
                      "id": "79",
                      "name": "Bouhdila",
                      "region": "2"
                  },
                  {
                      "id": "80",
                      "name": "Bouizakarne",
                      "region": "10"
                  },
                  {
                      "id": "81",
                      "name": "Boujdour‎",
                      "region": "11"
                  },
                  {
                      "id": "82",
                      "name": "Boujniba",
                      "region": "5"
                  },
                  {
                      "id": "83",
                      "name": "Boulanouare",
                      "region": "5"
                  },
                  {
                      "id": "84",
                      "name": "Boulemane",
                      "region": "3"
                  },
                  {
                      "id": "85",
                      "name": "Boumalne-Dadès",
                      "region": "8"
                  },
                  {
                      "id": "86",
                      "name": "Boumia",
                      "region": "8"
                  },
                  {
                      "id": "87",
                      "name": "Bouskoura",
                      "region": "6"
                  },
                  {
                      "id": "88",
                      "name": "Bouznika",
                      "region": "6"
                  },
                  {
                      "id": "89",
                      "name": "Bradia",
                      "region": "5"
                  },
                  {
                      "id": "90",
                      "name": "Brikcha",
                      "region": "1"
                  },
                  {
                      "id": "91",
                      "name": "Bzou",
                      "region": "5"
                  },
                  {
                      "id": "92",
                      "name": "Béni Mellal",
                      "region": "5"
                  },
                  {
                      "id": "93",
                      "name": "Casablanca",
                      "region": "6"
                  },
                  {
                      "id": "94",
                      "name": "Chefchaouen",
                      "region": "1"
                  },
                  {
                      "id": "95",
                      "name": "Chichaoua",
                      "region": "7"
                  },
                  {
                      "id": "96",
                      "name": "Dar Bni Karrich",
                      "region": "1"
                  },
                  {
                      "id": "97",
                      "name": "Dar Chaoui",
                      "region": "1"
                  },
                  {
                      "id": "98",
                      "name": "Dar El Kebdani",
                      "region": "2"
                  },
                  {
                      "id": "99",
                      "name": "Dar Gueddari",
                      "region": "4"
                  },
                  {
                      "id": "100",
                      "name": "Dar Oulad Zidouh",
                      "region": "5"
                  },
                  {
                      "id": "101",
                      "name": "Dcheira El Jihadia",
                      "region": "9"
                  },
                  {
                      "id": "102",
                      "name": "Debdou",
                      "region": "2"
                  },
                  {
                      "id": "103",
                      "name": "Demnate",
                      "region": "5"
                  },
                  {
                      "id": "104",
                      "name": "Deroua",
                      "region": "6"
                  },
                  {
                      "id": "105",
                      "name": "Douar Kannine",
                      "region": "2"
                  },
                  {
                      "id": "106",
                      "name": "Dra'a",
                      "region": "8"
                  },
                  {
                      "id": "107",
                      "name": "Drargua",
                      "region": "9"
                  },
                  {
                      "id": "108",
                      "name": "Driouch",
                      "region": "2"
                  },
                  {
                      "id": "109",
                      "name": "Echemmaia",
                      "region": "7"
                  },
                  {
                      "id": "110",
                      "name": "El Aïoun Sidi Mellouk",
                      "region": "2"
                  },
                  {
                      "id": "111",
                      "name": "El Borouj",
                      "region": "6"
                  },
                  {
                      "id": "112",
                      "name": "El Gara",
                      "region": "6"
                  },
                  {
                      "id": "113",
                      "name": "El Guerdane",
                      "region": "9"
                  },
                  {
                      "id": "114",
                      "name": "El Hajeb",
                      "region": "3"
                  },
                  {
                      "id": "115",
                      "name": "El Hanchane",
                      "region": "7"
                  },
                  {
                      "id": "116",
                      "name": "El Jadida",
                      "region": "6"
                  },
                  {
                      "id": "117",
                      "name": "El Kelaâ des Sraghna",
                      "region": "7"
                  },
                  {
                      "id": "118",
                      "name": "El Ksiba",
                      "region": "5"
                  },
                  {
                      "id": "119",
                      "name": "El Marsa‎",
                      "region": "11"
                  },
                  {
                      "id": "120",
                      "name": "El Menzel",
                      "region": "3"
                  },
                  {
                      "id": "121",
                      "name": "El Ouatia",
                      "region": "10"
                  },
                  {
                      "id": "122",
                      "name": "Elkbab",
                      "region": "5"
                  },
                  {
                      "id": "123",
                      "name": "Er-Rich",
                      "region": "5"
                  },
                  {
                      "id": "124",
                      "name": "Errachidia",
                      "region": "8"
                  },
                  {
                      "id": "125",
                      "name": "Es-Semara",
                      "region": "11"
                  },
                  {
                      "id": "126",
                      "name": "Essaouira",
                      "region": "7"
                  },
                  {
                      "id": "127",
                      "name": "Fam El Hisn",
                      "region": "9"
                  },
                  {
                      "id": "128",
                      "name": "Farkhana",
                      "region": "2"
                  },
                  {
                      "id": "129",
                      "name": "Figuig",
                      "region": "2"
                  },
                  {
                      "id": "130",
                      "name": "Fnideq",
                      "region": "1"
                  },
                  {
                      "id": "131",
                      "name": "Foum Jamaa",
                      "region": "5"
                  },
                  {
                      "id": "132",
                      "name": "Foum Zguid",
                      "region": "9"
                  },
                  {
                      "id": "133",
                      "name": "Fquih Ben Salah",
                      "region": "5"
                  },
                  {
                      "id": "134",
                      "name": "Fraïta",
                      "region": "7"
                  },
                  {
                      "id": "135",
                      "name": "Fès",
                      "region": "3"
                  },
                  {
                      "id": "136",
                      "name": "Gardmit",
                      "region": "8"
                  },
                  {
                      "id": "137",
                      "name": "Ghafsai‎",
                      "region": "3"
                  },
                  {
                      "id": "138",
                      "name": "Ghmate",
                      "region": "7"
                  },
                  {
                      "id": "139",
                      "name": "Goulmima",
                      "region": "8"
                  },
                  {
                      "id": "140",
                      "name": "Gourrama",
                      "region": "8"
                  },
                  {
                      "id": "141",
                      "name": "Guelmim",
                      "region": "10"
                  },
                  {
                      "id": "142",
                      "name": "Guercif‎",
                      "region": "2"
                  },
                  {
                      "id": "143",
                      "name": "Gueznaia",
                      "region": "1"
                  },
                  {
                      "id": "144",
                      "name": "Guigou",
                      "region": "3"
                  },
                  {
                      "id": "145",
                      "name": "Guisser",
                      "region": "6"
                  },
                  {
                      "id": "146",
                      "name": "Had Bouhssoussen",
                      "region": "5"
                  },
                  {
                      "id": "147",
                      "name": "Had Kourt",
                      "region": "4"
                  },
                  {
                      "id": "148",
                      "name": "Haj Kaddour",
                      "region": "3"
                  },
                  {
                      "id": "149",
                      "name": "Harhoura",
                      "region": "4"
                  },
                  {
                      "id": "150",
                      "name": "Harte Lyamine",
                      "region": "8"
                  },
                  {
                      "id": "151",
                      "name": "Hattane",
                      "region": "5"
                  },
                  {
                      "id": "152",
                      "name": "Hrara",
                      "region": "7"
                  },
                  {
                      "id": "153",
                      "name": "Ida Ougnidif",
                      "region": "9"
                  },
                  {
                      "id": "154",
                      "name": "Ifrane",
                      "region": "3"
                  },
                  {
                      "id": "155",
                      "name": "Ifri",
                      "region": "8"
                  },
                  {
                      "id": "156",
                      "name": "Igdamen",
                      "region": "9"
                  },
                  {
                      "id": "157",
                      "name": "Ighil n'Oumgoun",
                      "region": "8"
                  },
                  {
                      "id": "158",
                      "name": "Ighoud",
                      "region": "7"
                  },
                  {
                      "id": "159",
                      "name": "Ighounane",
                      "region": "8"
                  },
                  {
                      "id": "160",
                      "name": "Ihddaden",
                      "region": "2"
                  },
                  {
                      "id": "161",
                      "name": "Imassine",
                      "region": "8"
                  },
                  {
                      "id": "162",
                      "name": "Imintanoute",
                      "region": "7"
                  },
                  {
                      "id": "163",
                      "name": "Imouzzer Kandar",
                      "region": "3"
                  },
                  {
                      "id": "164",
                      "name": "Imouzzer Marmoucha",
                      "region": "3"
                  },
                  {
                      "id": "165",
                      "name": "Imzouren‎",
                      "region": "1"
                  },
                  {
                      "id": "166",
                      "name": "Inahnahen‎",
                      "region": "1"
                  },
                  {
                      "id": "167",
                      "name": "Inezgane",
                      "region": "9"
                  },
                  {
                      "id": "168",
                      "name": "Irherm",
                      "region": "9"
                  },
                  {
                      "id": "169",
                      "name": "Issaguen (Ketama)‎",
                      "region": "1"
                  },
                  {
                      "id": "170",
                      "name": "Itzer",
                      "region": "8"
                  },
                  {
                      "id": "171",
                      "name": "Jamâat Shaim",
                      "region": "7"
                  },
                  {
                      "id": "172",
                      "name": "Jaâdar",
                      "region": "2"
                  },
                  {
                      "id": "173",
                      "name": "Jebha",
                      "region": "1"
                  },
                  {
                      "id": "174",
                      "name": "Jerada",
                      "region": "2"
                  },
                  {
                      "id": "175",
                      "name": "Jorf",
                      "region": "8"
                  },
                  {
                      "id": "176",
                      "name": "Jorf El Melha",
                      "region": "4"
                  },
                  {
                      "id": "177",
                      "name": "Jorf Lasfar",
                      "region": "6"
                  },
                  {
                      "id": "178",
                      "name": "Karia",
                      "region": "3"
                  },
                  {
                      "id": "179",
                      "name": "Karia (El Jadida)‎",
                      "region": "6"
                  },
                  {
                      "id": "180",
                      "name": "Karia Ba Mohamed‎",
                      "region": "3"
                  },
                  {
                      "id": "181",
                      "name": "Kariat Arekmane",
                      "region": "2"
                  },
                  {
                      "id": "182",
                      "name": "Kasba Tadla",
                      "region": "5"
                  },
                  {
                      "id": "183",
                      "name": "Kassita",
                      "region": "2"
                  },
                  {
                      "id": "184",
                      "name": "Kattara",
                      "region": "7"
                  },
                  {
                      "id": "185",
                      "name": "Kehf Nsour",
                      "region": "5"
                  },
                  {
                      "id": "186",
                      "name": "Kelaat-M'Gouna",
                      "region": "8"
                  },
                  {
                      "id": "187",
                      "name": "Kerouna",
                      "region": "2"
                  },
                  {
                      "id": "188",
                      "name": "Kerrouchen",
                      "region": "5"
                  },
                  {
                      "id": "189",
                      "name": "Khemis Zemamra",
                      "region": "6"
                  },
                  {
                      "id": "190",
                      "name": "Khenichet",
                      "region": "4"
                  },
                  {
                      "id": "191",
                      "name": "Khouribga",
                      "region": "5"
                  },
                  {
                      "id": "192",
                      "name": "Khémis Sahel",
                      "region": "1"
                  },
                  {
                      "id": "193",
                      "name": "Khémisset",
                      "region": "4"
                  },
                  {
                      "id": "194",
                      "name": "Khénifra",
                      "region": "5"
                  },
                  {
                      "id": "195",
                      "name": "Ksar El Kébir",
                      "region": "1"
                  },
                  {
                      "id": "196",
                      "name": "Kénitra",
                      "region": "4"
                  },
                  {
                      "id": "197",
                      "name": "Laaounate",
                      "region": "6"
                  },
                  {
                      "id": "198",
                      "name": "Laayoune‎",
                      "region": "11"
                  },
                  {
                      "id": "199",
                      "name": "Lakhsas",
                      "region": "9"
                  },
                  {
                      "id": "200",
                      "name": "Lakhsass",
                      "region": "9"
                  },
                  {
                      "id": "201",
                      "name": "Lalla Mimouna",
                      "region": "4"
                  },
                  {
                      "id": "202",
                      "name": "Lalla Takerkoust",
                      "region": "7"
                  },
                  {
                      "id": "203",
                      "name": "Larache",
                      "region": "1"
                  },
                  {
                      "id": "204",
                      "name": "Laâtamna",
                      "region": "2"
                  },
                  {
                      "id": "205",
                      "name": "Loudaya",
                      "region": "7"
                  },
                  {
                      "id": "206",
                      "name": "Loulad",
                      "region": "6"
                  },
                  {
                      "id": "207",
                      "name": "Lqliâa",
                      "region": "9"
                  },
                  {
                      "id": "208",
                      "name": "Lâattaouia",
                      "region": "7"
                  },
                  {
                      "id": "209",
                      "name": "M'diq",
                      "region": "1"
                  },
                  {
                      "id": "210",
                      "name": "M'haya",
                      "region": "3"
                  },
                  {
                      "id": "211",
                      "name": "M'rirt",
                      "region": "5"
                  },
                  {
                      "id": "212",
                      "name": "M'semrir",
                      "region": "8"
                  },
                  {
                      "id": "213",
                      "name": "Madagh",
                      "region": "2"
                  },
                  {
                      "id": "214",
                      "name": "Marrakech",
                      "region": "7"
                  },
                  {
                      "id": "215",
                      "name": "Martil",
                      "region": "1"
                  },
                  {
                      "id": "216",
                      "name": "Massa (Maroc)",
                      "region": "9"
                  },
                  {
                      "id": "217",
                      "name": "Mechra Bel Ksiri",
                      "region": "4"
                  },
                  {
                      "id": "218",
                      "name": "Megousse",
                      "region": "9"
                  },
                  {
                      "id": "219",
                      "name": "Mehdia",
                      "region": "4"
                  },
                  {
                      "id": "220",
                      "name": "Meknès‎",
                      "region": "3"
                  },
                  {
                      "id": "221",
                      "name": "Midar",
                      "region": "2"
                  },
                  {
                      "id": "222",
                      "name": "Midelt",
                      "region": "8"
                  },
                  {
                      "id": "223",
                      "name": "Missour",
                      "region": "3"
                  },
                  {
                      "id": "224",
                      "name": "Mohammadia",
                      "region": "6"
                  },
                  {
                      "id": "225",
                      "name": "Moqrisset",
                      "region": "1"
                  },
                  {
                      "id": "226",
                      "name": "Moulay Abdallah",
                      "region": "6"
                  },
                  {
                      "id": "227",
                      "name": "Moulay Ali Cherif",
                      "region": "8"
                  },
                  {
                      "id": "228",
                      "name": "Moulay Bouazza",
                      "region": "5"
                  },
                  {
                      "id": "229",
                      "name": "Moulay Bousselham",
                      "region": "4"
                  },
                  {
                      "id": "230",
                      "name": "Moulay Brahim",
                      "region": "7"
                  },
                  {
                      "id": "231",
                      "name": "Moulay Idriss Zerhoun",
                      "region": "3"
                  },
                  {
                      "id": "232",
                      "name": "Moulay Yaâcoub",
                      "region": "3"
                  },
                  {
                      "id": "233",
                      "name": "Moussaoua",
                      "region": "3"
                  },
                  {
                      "id": "234",
                      "name": "MyAliCherif",
                      "region": "8"
                  },
                  {
                      "id": "235",
                      "name": "Mzouda",
                      "region": "7"
                  },
                  {
                      "id": "236",
                      "name": "Médiouna",
                      "region": "6"
                  },
                  {
                      "id": "237",
                      "name": "N'Zalat Bni Amar",
                      "region": "3"
                  },
                  {
                      "id": "238",
                      "name": "Nador",
                      "region": "2"
                  },
                  {
                      "id": "239",
                      "name": "Naima",
                      "region": "2"
                  },
                  {
                      "id": "240",
                      "name": "Oualidia",
                      "region": "6"
                  },
                  {
                      "id": "241",
                      "name": "Ouaouizeght",
                      "region": "5"
                  },
                  {
                      "id": "242",
                      "name": "Ouaoumana",
                      "region": "5"
                  },
                  {
                      "id": "243",
                      "name": "Ouarzazate",
                      "region": "8"
                  },
                  {
                      "id": "244",
                      "name": "Ouazzane",
                      "region": "1"
                  },
                  {
                      "id": "245",
                      "name": "Oued Amlil‎",
                      "region": "3"
                  },
                  {
                      "id": "246",
                      "name": "Oued Heimer",
                      "region": "2"
                  },
                  {
                      "id": "247",
                      "name": "Oued Ifrane",
                      "region": "3"
                  },
                  {
                      "id": "248",
                      "name": "Oued Laou",
                      "region": "1"
                  },
                  {
                      "id": "249",
                      "name": "Oued Rmel",
                      "region": "1"
                  },
                  {
                      "id": "250",
                      "name": "Oued Zem",
                      "region": "5"
                  },
                  {
                      "id": "251",
                      "name": "Oued-Eddahab",
                      "region": "12"
                  },
                  {
                      "id": "252",
                      "name": "Oujda",
                      "region": "2"
                  },
                  {
                      "id": "253",
                      "name": "Oulad Abbou",
                      "region": "6"
                  },
                  {
                      "id": "254",
                      "name": "Oulad Amrane",
                      "region": "6"
                  },
                  {
                      "id": "255",
                      "name": "Oulad Ayad",
                      "region": "5"
                  },
                  {
                      "id": "256",
                      "name": "Oulad Berhil",
                      "region": "9"
                  },
                  {
                      "id": "257",
                      "name": "Oulad Frej",
                      "region": "6"
                  },
                  {
                      "id": "258",
                      "name": "Oulad Ghadbane",
                      "region": "6"
                  },
                  {
                      "id": "259",
                      "name": "Oulad H'Riz Sahel",
                      "region": "6"
                  },
                  {
                      "id": "260",
                      "name": "Oulad M'Barek",
                      "region": "5"
                  },
                  {
                      "id": "261",
                      "name": "Oulad M'rah",
                      "region": "6"
                  },
                  {
                      "id": "262",
                      "name": "Oulad Saïd",
                      "region": "6"
                  },
                  {
                      "id": "263",
                      "name": "Oulad Sidi Ben Daoud",
                      "region": "6"
                  },
                  {
                      "id": "264",
                      "name": "Oulad Teïma",
                      "region": "9"
                  },
                  {
                      "id": "265",
                      "name": "Oulad Yaich",
                      "region": "5"
                  },
                  {
                      "id": "266",
                      "name": "Oulad Zbair‎",
                      "region": "3"
                  },
                  {
                      "id": "267",
                      "name": "Ouled Tayeb",
                      "region": "3"
                  },
                  {
                      "id": "268",
                      "name": "Oulmès",
                      "region": "4"
                  },
                  {
                      "id": "269",
                      "name": "Ounagha",
                      "region": "7"
                  },
                  {
                      "id": "270",
                      "name": "Outat El Haj",
                      "region": "3"
                  },
                  {
                      "id": "271",
                      "name": "Point Cires",
                      "region": "1"
                  },
                  {
                      "id": "272",
                      "name": "Rabat",
                      "region": "4"
                  },
                  {
                      "id": "273",
                      "name": "Ras El Aïn",
                      "region": "6"
                  },
                  {
                      "id": "274",
                      "name": "Ras El Ma",
                      "region": "2"
                  },
                  {
                      "id": "275",
                      "name": "Ribate El Kheir",
                      "region": "3"
                  },
                  {
                      "id": "276",
                      "name": "Rissani",
                      "region": "8"
                  },
                  {
                      "id": "277",
                      "name": "Rommani",
                      "region": "4"
                  },
                  {
                      "id": "278",
                      "name": "Sabaa Aiyoun",
                      "region": "3"
                  },
                  {
                      "id": "279",
                      "name": "Safi",
                      "region": "7"
                  },
                  {
                      "id": "280",
                      "name": "Salé",
                      "region": "4"
                  },
                  {
                      "id": "281",
                      "name": "Sarghine",
                      "region": "8"
                  },
                  {
                      "id": "282",
                      "name": "Saïdia",
                      "region": "2"
                  },
                  {
                      "id": "283",
                      "name": "Sebt El Maârif",
                      "region": "6"
                  },
                  {
                      "id": "284",
                      "name": "Sebt Gzoula",
                      "region": "7"
                  },
                  {
                      "id": "285",
                      "name": "Sebt Jahjouh",
                      "region": "3"
                  },
                  {
                      "id": "286",
                      "name": "Selouane",
                      "region": "2"
                  },
                  {
                      "id": "287",
                      "name": "Settat",
                      "region": "6"
                  },
                  {
                      "id": "288",
                      "name": "Sid L'Mokhtar",
                      "region": "7"
                  },
                  {
                      "id": "289",
                      "name": "Sid Zouin",
                      "region": "7"
                  },
                  {
                      "id": "290",
                      "name": "Sidi Abdallah Ghiat",
                      "region": "7"
                  },
                  {
                      "id": "291",
                      "name": "Sidi Addi",
                      "region": "3"
                  },
                  {
                      "id": "292",
                      "name": "Sidi Ahmed",
                      "region": "7"
                  },
                  {
                      "id": "293",
                      "name": "Sidi Ali Ban Hamdouche",
                      "region": "6"
                  },
                  {
                      "id": "294",
                      "name": "Sidi Allal El Bahraoui",
                      "region": "4"
                  },
                  {
                      "id": "295",
                      "name": "Sidi Allal Tazi",
                      "region": "4"
                  },
                  {
                      "id": "296",
                      "name": "Sidi Bennour",
                      "region": "6"
                  },
                  {
                      "id": "297",
                      "name": "Sidi Bou Othmane",
                      "region": "7"
                  },
                  {
                      "id": "298",
                      "name": "Sidi Boubker",
                      "region": "2"
                  },
                  {
                      "id": "299",
                      "name": "Sidi Bouknadel",
                      "region": "4"
                  },
                  {
                      "id": "300",
                      "name": "Sidi Bouzid",
                      "region": "6"
                  },
                  {
                      "id": "301",
                      "name": "Sidi Ifni",
                      "region": "10"
                  },
                  {
                      "id": "302",
                      "name": "Sidi Jaber",
                      "region": "5"
                  },
                  {
                      "id": "303",
                      "name": "Sidi Kacem",
                      "region": "4"
                  },
                  {
                      "id": "304",
                      "name": "Sidi Lyamani",
                      "region": "1"
                  },
                  {
                      "id": "305",
                      "name": "Sidi Mohamed ben Abdallah el-Raisuni",
                      "region": "1"
                  },
                  {
                      "id": "306",
                      "name": "Sidi Rahhal",
                      "region": "7"
                  },
                  {
                      "id": "307",
                      "name": "Sidi Rahhal Chataï",
                      "region": "6"
                  },
                  {
                      "id": "308",
                      "name": "Sidi Slimane",
                      "region": "4"
                  },
                  {
                      "id": "309",
                      "name": "Sidi Slimane Echcharaa",
                      "region": "2"
                  },
                  {
                      "id": "310",
                      "name": "Sidi Smaïl",
                      "region": "6"
                  },
                  {
                      "id": "311",
                      "name": "Sidi Taibi",
                      "region": "4"
                  },
                  {
                      "id": "312",
                      "name": "Sidi Yahya El Gharb",
                      "region": "4"
                  },
                  {
                      "id": "313",
                      "name": "Skhinate",
                      "region": "3"
                  },
                  {
                      "id": "314",
                      "name": "Skhirate",
                      "region": "4"
                  },
                  {
                      "id": "315",
                      "name": "Skhour Rehamna",
                      "region": "7"
                  },
                  {
                      "id": "316",
                      "name": "Skoura",
                      "region": "8"
                  },
                  {
                      "id": "317",
                      "name": "Smimou",
                      "region": "7"
                  },
                  {
                      "id": "318",
                      "name": "Soualem",
                      "region": "6"
                  },
                  {
                      "id": "319",
                      "name": "Souk El Arbaa",
                      "region": "4"
                  },
                  {
                      "id": "320",
                      "name": "Souk Sebt Oulad Nemma",
                      "region": "5"
                  },
                  {
                      "id": "321",
                      "name": "Stehat",
                      "region": "1"
                  },
                  {
                      "id": "322",
                      "name": "Séfrou",
                      "region": "3"
                  },
                  {
                      "id": "323",
                      "name": "Tabounte",
                      "region": "8"
                  },
                  {
                      "id": "324",
                      "name": "Tafajight",
                      "region": "3"
                  },
                  {
                      "id": "325",
                      "name": "Tafetachte",
                      "region": "7"
                  },
                  {
                      "id": "326",
                      "name": "Tafraout",
                      "region": "9"
                  },
                  {
                      "id": "327",
                      "name": "Taghjijt",
                      "region": "10"
                  },
                  {
                      "id": "328",
                      "name": "Taghzout",
                      "region": "1"
                  },
                  {
                      "id": "329",
                      "name": "Tagzen",
                      "region": "9"
                  },
                  {
                      "id": "330",
                      "name": "Tahannaout",
                      "region": "7"
                  },
                  {
                      "id": "331",
                      "name": "Tahla‎",
                      "region": "3"
                  },
                  {
                      "id": "332",
                      "name": "Tala Tazegwaght‎",
                      "region": "1"
                  },
                  {
                      "id": "333",
                      "name": "Taliouine",
                      "region": "9"
                  },
                  {
                      "id": "334",
                      "name": "Talmest",
                      "region": "7"
                  },
                  {
                      "id": "335",
                      "name": "Talsint",
                      "region": "2"
                  },
                  {
                      "id": "336",
                      "name": "Tamallalt",
                      "region": "7"
                  },
                  {
                      "id": "337",
                      "name": "Tamanar",
                      "region": "7"
                  },
                  {
                      "id": "338",
                      "name": "Tamansourt",
                      "region": "7"
                  },
                  {
                      "id": "339",
                      "name": "Tamassint‎",
                      "region": "1"
                  },
                  {
                      "id": "340",
                      "name": "Tamegroute",
                      "region": "8"
                  },
                  {
                      "id": "341",
                      "name": "Tameslouht",
                      "region": "7"
                  },
                  {
                      "id": "342",
                      "name": "Tamesna",
                      "region": "4"
                  },
                  {
                      "id": "343",
                      "name": "Tamraght",
                      "region": "9"
                  },
                  {
                      "id": "344",
                      "name": "Tan-Tan",
                      "region": "10"
                  },
                  {
                      "id": "345",
                      "name": "Tanalt",
                      "region": "9"
                  },
                  {
                      "id": "346",
                      "name": "Tanger‎",
                      "region": "1"
                  },
                  {
                      "id": "347",
                      "name": "Tanoumrite Nkob Zagora",
                      "region": "8"
                  },
                  {
                      "id": "348",
                      "name": "Taounate‎",
                      "region": "3"
                  },
                  {
                      "id": "349",
                      "name": "Taourirt",
                      "region": "2"
                  },
                  {
                      "id": "350",
                      "name": "Taourirt ait zaghar",
                      "region": "8"
                  },
                  {
                      "id": "351",
                      "name": "Tarfaya‎",
                      "region": "11"
                  },
                  {
                      "id": "352",
                      "name": "Targuist‎",
                      "region": "1"
                  },
                  {
                      "id": "353",
                      "name": "Taroudannt",
                      "region": "9"
                  },
                  {
                      "id": "354",
                      "name": "Tata",
                      "region": "9"
                  },
                  {
                      "id": "355",
                      "name": "Taza‎",
                      "region": "3"
                  },
                  {
                      "id": "356",
                      "name": "Taïnaste‎",
                      "region": "3"
                  },
                  {
                      "id": "357",
                      "name": "Temsia",
                      "region": "9"
                  },
                  {
                      "id": "358",
                      "name": "Tendrara",
                      "region": "2"
                  },
                  {
                      "id": "359",
                      "name": "Thar Es-Souk‎",
                      "region": "3"
                  },
                  {
                      "id": "360",
                      "name": "Tichoute",
                      "region": "8"
                  },
                  {
                      "id": "361",
                      "name": "Tiddas",
                      "region": "4"
                  },
                  {
                      "id": "362",
                      "name": "Tiflet",
                      "region": "4"
                  },
                  {
                      "id": "363",
                      "name": "Tifnit",
                      "region": "9"
                  },
                  {
                      "id": "364",
                      "name": "Tighassaline",
                      "region": "5"
                  },
                  {
                      "id": "365",
                      "name": "Tighza",
                      "region": "5"
                  },
                  {
                      "id": "366",
                      "name": "Timahdite",
                      "region": "3"
                  },
                  {
                      "id": "367",
                      "name": "Tinejdad",
                      "region": "8"
                  },
                  {
                      "id": "368",
                      "name": "Tisgdal",
                      "region": "9"
                  },
                  {
                      "id": "369",
                      "name": "Tissa‎",
                      "region": "3"
                  },
                  {
                      "id": "370",
                      "name": "Tit Mellil",
                      "region": "6"
                  },
                  {
                      "id": "371",
                      "name": "Tizguite",
                      "region": "3"
                  },
                  {
                      "id": "372",
                      "name": "Tizi Ouasli‎",
                      "region": "3"
                  },
                  {
                      "id": "373",
                      "name": "Tiznit",
                      "region": "9"
                  },
                  {
                      "id": "374",
                      "name": "Tiztoutine",
                      "region": "2"
                  },
                  {
                      "id": "375",
                      "name": "Touarga",
                      "region": "4"
                  },
                  {
                      "id": "376",
                      "name": "Touima",
                      "region": "2"
                  },
                  {
                      "id": "377",
                      "name": "Touissit",
                      "region": "2"
                  },
                  {
                      "id": "378",
                      "name": "Toulal",
                      "region": "3"
                  },
                  {
                      "id": "379",
                      "name": "Toundoute",
                      "region": "8"
                  },
                  {
                      "id": "380",
                      "name": "Tounfite",
                      "region": "8"
                  },
                  {
                      "id": "381",
                      "name": "Témara",
                      "region": "4"
                  },
                  {
                      "id": "382",
                      "name": "Tétouan‎",
                      "region": "1"
                  },
                  {
                      "id": "383",
                      "name": "Youssoufia",
                      "region": "7"
                  },
                  {
                      "id": "384",
                      "name": "Zag",
                      "region": "10"
                  },
                  {
                      "id": "385",
                      "name": "Zagora",
                      "region": "8"
                  },
                  {
                      "id": "386",
                      "name": "Zaouia d'Ifrane",
                      "region": "3"
                  },
                  {
                      "id": "387",
                      "name": "Zaouïat Cheikh",
                      "region": "5"
                  },
                  {
                      "id": "388",
                      "name": "Zaïda",
                      "region": "8"
                  },
                  {
                      "id": "389",
                      "name": "Zaïo",
                      "region": "2"
                  },
                  {
                      "id": "390",
                      "name": "Zeghanghane",
                      "region": "2"
                  },
                  {
                      "id": "391",
                      "name": "Zeubelemok",
                      "region": "7"
                  },
                  {
                      "id": "392",
                      "name": "Zinat",
                      "region": "1"
                  }
              ]
    
                const addCities = async() => {
                    for (let i = 0; i < cities.length; i++) {
                        const city = cities[i];
                        const existingCity = await City.findOne({ name: city.name });
                        if (!existingCity) {
                            const newCity = new City(city);
                            await newCity.save();
                        }
                    }
                };
    
                addCities();
                const regions = [
                    {
                        "id": "1",
                        "region": "Tanger-Tétouan-Al Hoceïma"
                    },
                    {
                        "id": "2",
                        "region": "l'Oriental"
                    },
                    {
                        "id": "3",
                        "region": "Fès-Meknès"
                    },
                    {
                        "id": "4",
                        "region": "Rabat-Salé-Kénitra"
                    },
                    {
                        "id": "5",
                        "region": "Béni Mellal-Khénifra"
                    },
                    {
                        "id": "6",
                        "region": "Casablanca-Settat"
                    },
                    {
                        "id": "7",
                        "region": "Marrakech-Safi"
                    },
                    {
                        "id": "8",
                        "region": "Drâa-Tafilalet"
                    },
                    {
                        "id": "9",
                        "region": "Souss-Massa"
                    },
                    {
                        "id": "10",
                        "region": "Guelmim-Oued Noun"
                    },
                    {
                        "id": "11",
                        "region": "Laâyoune-Sakia El Hamra"
                    },
                    {
                        "id": "12",
                        "region": "Dakhla-Oued Ed Dahab"
                    }
                ]
    
                const addRegions = async() => {
                    for (let i = 0; i < regions.length; i++) {
                        const region = regions[i];
                        const existingRegion = await Region.findOne({ id: region.id });
                        if (!existingRegion) {
                            const newRegion = new Region(region);
                            await newRegion.save();
                        }
                    }
                };
    
                addRegions();
                /* ADD DATA ONE TIME */
                // User.insertMany(users);
                // Post.insertMany(posts);
                console.log('server live')
            });
          
                
            })
        .catch((error) => {
           console.log(error)
           })