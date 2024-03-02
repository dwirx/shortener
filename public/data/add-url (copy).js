const fs = require("fs");
const path = require("path");
const readline = require("readline-sync");

// Input values from the terminal
const title = readline.question("Title: ");
const description = readline.question("Description: ");
let source = readline.question("Source: ");
let destination = readline.question("Destination: ");

// Menambahkan "/" ke "source" jika tidak ada
if (!source.startsWith("/")) {
  source = `/${source}`;
}

// Check if "https://" or "http://" is already present
if (!destination.startsWith("https://") && !destination.startsWith("http://")) {
  destination = `https://${destination}`;
}

// Load existing JSON file
const file = path.join(__dirname, "vercel.json");

let data;
try {
  data = JSON.parse(fs.readFileSync(file, "utf-8"));
} catch (error) {
  console.error(`Error reading ${file}: ${error.message}`);
  process.exit(1);
}

// Check for duplicate source
const duplicateIndex = data.redirects.findIndex(
  (entry) => entry.source === source,
);

// Ask for confirmation if duplicate source is found
if (duplicateIndex !== -1) {
  const replaceConfirmation = readline.keyInYNStrict(
    "Duplikasi source ditemukan. Apakah Anda ingin menggantikan entri yang sudah ada?",
  );
  if (!replaceConfirmation) {
    console.log("Operasi dibatalkan. Tidak ada perubahan yang dilakukan.");
    process.exit(0);
  }
}

// Replace existing entry or add new entry
if (duplicateIndex !== -1) {
  data.redirects[duplicateIndex] = {
    title,
    description,
    source,
    destination,
  };
} else {
  data.redirects.push({ title, description, source, destination });
}

// Save updated JSON back to the file
try {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`Entri baru telah ditambahkan atau digantikan dalam ${file}.`);
} catch (error) {
  console.error(`Error writing to ${file}: ${error.message}`);
  process.exit(1);
}
