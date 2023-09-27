import fs from 'fs';

const originalData = JSON.parse(fs.readFileSync('camions.json', 'utf-8'));

const marqueSet = new Set();

originalData.forEach(item => {
  marqueSet.add(item.marque);
});

const marqueOptions = [...marqueSet];

const outputData = {
  name: "Marque",
  category: "vehicule-vente",
  subcategory: "Camions",
  type: "select",
  options: marqueOptions
};

fs.writeFileSync('camionsR.json', JSON.stringify(outputData, null, 2));
