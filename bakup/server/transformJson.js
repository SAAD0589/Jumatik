import fs from 'fs';

const originalData = JSON.parse(fs.readFileSync('camions.json', 'utf-8'));

const transformedData = [];

const customFieldId = { $oid: "645ff7fbfd3a9ff9897889a9" };

const processedMarques = new Set();

originalData.forEach(item => {
  const { modele, marque } = item;
  
  if (processedMarques.has(marque)) {
    return;
  }

  const options = originalData
    .filter(x => x.marque === marque)
    .map(x => x.modele);

  transformedData.push({
    name: "Modèle",
    customFieldId,
    customFieldValue: marque,
    category: "vehicule-vente",
    subcategory: "Camions",
    type: "select",
    options
  });

  processedMarques.add(marque);
});

fs.writeFileSync('modelesCamions.json', JSON.stringify(transformedData, null, 2));
