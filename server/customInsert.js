import CustomField from "./models/CustomField.js";
 const customFields = [{"_id":"6466549a2f0bd33d4c207f3d","name":"Type","category":"vehicule-vente","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646654d72f0bd33d4c207f80","name":"Type","category":"vehicules-location","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646654f82f0bd33d4c207fa3","name":"Type","category":"Auto-Moto","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"6466550e2f0bd33d4c207fbc","name":"Type","category":"Materiels-Professionnels","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655262f0bd33d4c207fd9","name":"Type","category":"Pieces-de-rechange-et-Accessoires","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655382f0bd33d4c207fee","name":"Type","category":"Immobiliers-Vente","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655582f0bd33d4c20800f","name":"Type","category":"Immobiliers-Location","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655a72f0bd33d4c208067","name":"type","category":"Telephonie-et-Multimedia","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655bc2f0bd33d4c20807e","name":"Type","category":"Espace-daffaires-et-Gros","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655de2f0bd33d4c2080a4","name":"Type","category":"Jeux-video-et-Jouets","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646655f42f0bd33d4c2080bf","name":"Type","category":"Loisirs/Vetements/Vacances","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"6466560c2f0bd33d4c2080d8","name":"Type","category":"Maison-et-Equipements","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"6466561f2f0bd33d4c2080ef","name":"Type","category":"Beaute-et-Sante","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646656312f0bd33d4c208104","name":"Type","category":"Divers","subcategory":"","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646b366b2f0bd33d4c2200f3","name":"Sexe","category":"Loisirs/Vetements/Vacances","subcategory":"Vtements","type":"radio","options":["Homme","Femme","Garçon","Fille","Bébé"]}
 ,{"_id":"646bf921a981c3b7517b92b3","name":"Type","category":"Telephonie-et-Multimedia ","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646bf940a981c3b7517b92c5","name":"Type","category":"Espace-daffaires-et-Gros","type":"radio","options":["Offre","Demande"]}
 ,{"_id":"646cad8cbe6ec6b621a35a8a","name":"Type","category":"Animaux-et-oiseaux","subcategory":"","type":"radio","options":["Offre","Demande"]}]
 
                const result =  CustomField.insertMany(customFields);
                //console.log('Inserted documents:', result.insertedCount);