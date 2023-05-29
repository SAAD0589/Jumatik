import { deserialize } from 'bson';
import fs from 'fs';

// Read the BSON data from a file
const bsonData = fs.readFileSync('categories.bson');

// Convert BSON to JSON
const bsonBuffer = new Uint8Array(bsonData).buffer;
const jsonData = deserialize(bsonBuffer);

// Pretty-print the JSON output for better readability
const prettyJson = JSON.stringify(jsonData, null, 4);

// Save the JSON to a file
fs.writeFileSync('output.json', prettyJson);

console.log('BSON to JSON conversion completed.');
