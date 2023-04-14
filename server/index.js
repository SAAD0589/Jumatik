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
import customFieldsRoutes from "./routes/customFields.js"
import customFieldsValuesRoutes from "./routes/customFieldValues.js"
import citiesRoutes from "./routes/cities.js"
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
import Region from "./models/Region.js";
import passport from "passport";

/* CONFIGURATION */

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

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
        fieldSize: 3 * 1024 * 1024, // 25 MB
    },
    fileFilter: fileFilter,
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
app.use("/customFieldsValues", customFieldsValuesRoutes);
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
            app.listen(PORT, () => {
                const categories = [
                    { "label": "Mode et vêtements", "name": "mode", "description": "Vêtements, chaussures, accessoires de mode, etc.", "CatPicture": "" }, { "label": "Beauté et soins personnels", "name": "beaute", "description": "Produits de beauté, soins personnels, parfums, etc.", "CatPicture": "" }, { "label": "Électronique", "name": "electronique", "description": "Appareils électroniques, téléphones portables, ordinateurs, etc.", "CatPicture": "" }, { "label": "Maison et jardin", "name": "maison", "description": "Meubles, décoration, accessoires pour la maison, outils de jardinage, etc.", "CatPicture": "" }, { "label": "Alimentation et boissons", "name": "alimentation", "description": "Produits alimentaires, boissons, snacks, etc.", "CatPicture": "" }, { "label": "Sports et loisirs", "name": "sports", "description": "Matériel de sport, équipements de loisirs, billets pour des événements sportifs, etc.", "CatPicture": "" }, { "label": "Voitures et véhicules", "name": "voitures", "description": "Voitures, motos, bateaux, vélos, etc.", "CatPicture": "" }, { "label": "Animaux de compagnie", "name": "animaux", "description": "Animaux de compagnie, nourriture pour animaux, accessoires pour animaux, etc.", "CatPicture": "" }, { "label": "Art et artisanat", "name": "art", "description": "Peintures, sculptures, poteries, bijoux faits à la main, etc.", "CatPicture": "" }, { "label": "Éducation et livres", "name": "education", "description": "Livres, fournitures scolaires, cours en ligne, etc.", "CatPicture": "" },
                    {
                        "label": "Conseil et consulting",
                        "name": "conseil-consulting",
                        "description": "Services de conseil, d'accompagnement et de consulting dans différents domaines.",
                        "CatPicture": ""
                    },
                    {
                        "label": "Services informatiques",
                        "name": "services-informatiques",
                        "description": "Services liés à l'informatique et aux technologies de l'information, tels que le développement de logiciels, la maintenance informatique, etc.",
                        "CatPicture": ""
                    },
                    {
                        "label": "Marketing et communication",
                        "name": "marketing-communication",
                        "description": "Services de marketing et de communication, tels que la publicité, les relations publiques, etc.",
                        "CatPicture": ""
                    },
                    {
                        "label": "Formation et coaching",
                        "name": "formation-coaching",
                        "description": "Services de formation et de coaching pour les individus et les entreprises.",
                        "CatPicture": ""
                    },
                    {
                        "label": "Services financiers",
                        "name": "services-financiers",
                        "description": "Services financiers tels que la comptabilité, la gestion financière, etc.",
                        "CatPicture": ""
                    },
                    {
                        name: 'Autre',
                        label: 'Autre',
                        description: ''
    
                    }
                ];
    
                const addCategories = async() => {
                    for (let i = 0; i < categories.length; i++) {
                        const category = categories[i];
                        const existingCategory = await Category.findOne({ name: category.name });
                        if (!existingCategory) {
                            const newCategory = new Category(category);
                            await newCategory.save();
                        }
                    }
                };
    
                addCategories();
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