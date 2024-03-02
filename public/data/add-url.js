const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");

const getInput = (prompt) => readline.question(prompt);

const processJSONFile = (filePath) => {
  let data;

  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error.message}`);
    process.exit(1);
  }

  return data;
};

const saveJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(
      `Entri baru telah ditambahkan atau digantikan dalam ${filePath}.`,
    );
  } catch (error) {
    console.error(`Error writing to ${filePath}: ${error.message}`);
    process.exit(1);
  }
};

// Input values from the terminal
const title = getInput("Title: ");
const description = getInput("Description: ");
let source = getInput("Source: ");
let destination = getInput("Destination: ");

// Menambahkan "/" ke "source" jika tidak ada
if (!source.startsWith("/")) {
  source = `/${source}`;
}

// Check if "https://" or "http://" is already present
if (!destination.startsWith("https://") && !destination.startsWith("http://")) {
  destination = `https://${destination}`;
}

// Process the first JSON file
const firstFilePath = path.join(__dirname, "vercel.json");
let firstData = processJSONFile(firstFilePath);

// Process the second JSON file
const secondFilePath = path.join(__dirname, "../../vercel.json"); // Ganti dengan path relatif yang sesuai
let secondData = processJSONFile(secondFilePath);

// Check for duplicate source in either file
const duplicateIndexFirst = firstData.redirects.findIndex(
  (entry) => entry.source === source,
);

const duplicateIndexSecond = secondData.redirects.findIndex(
  (entry) => entry.source === source,
);

// Ask for confirmation if duplicate source is found in either file
if (duplicateIndexFirst !== -1 || duplicateIndexSecond !== -1) {
  const replaceConfirmation = readline.keyInYNStrict(
    "Duplikasi source ditemukan. Apakah Anda ingin menggantikan entri yang sudah ada?",
  );
  if (!replaceConfirmation) {
    console.log("Operasi dibatalkan. Tidak ada perubahan yang dilakukan.");
    process.exit(0);
  }
}

// Combine existing data with new entry
const newEntry = { title, description, source, destination };
firstData.redirects.push(newEntry);
secondData.redirects.push(newEntry);

// Save updated JSON back to the files
saveJSONFile(firstFilePath, firstData);
saveJSONFile(secondFilePath, secondData);
