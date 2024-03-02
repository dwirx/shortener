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
let source;
let destination;
let isRunning = true;

while (isRunning) {
  source = getInput("Source/Path (type '/exit' to quit): ");
  if (source.toLowerCase() === "/exit") {
    isRunning = false;
    continue;
  }

  destination = getInput("Destination/URL: ");

  // Add "/" to "source" if not present
  if (!source.startsWith("/")) {
    source = `/${source}`;
  }

  // Check if "https://" or "http://" is already present
  if (
    !destination.startsWith("https://") &&
    !destination.startsWith("http://")
  ) {
    destination = `https://${destination}`;
  }

  // Process the first JSON file
  const firstFilePath = path.join(__dirname, "vercel.json");
  let firstData = processJSONFile(firstFilePath);

  // Process the second JSON file
  const secondFilePath = path.join(__dirname, "../../vercel.json");
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
      continue;
    }
  }

  // Input values specific to the first file
  const titleFirst = getInput("Title for the first file: ");
  const descriptionFirst = getInput("Description for the first file: ");

  // Create a new entry for the first file
  const newEntryFirst = {
    title: titleFirst,
    description: descriptionFirst,
    source,
    destination,
  };

  // Add a new entry to the first file
  firstData.redirects.push(newEntryFirst);

  // Remove title and description from the second file
  const modifiedEntrySecond = secondData.redirects.map(
    ({ title, description, ...rest }) => rest,
  );
  secondData.redirects = [...modifiedEntrySecond, { source, destination }];

  // Save the updated JSON back to the files
  saveJSONFile(firstFilePath, firstData);
  saveJSONFile(secondFilePath, secondData);

  console.log("Entri berhasil ditambahkan!");
}

console.log("Terima kasih! Program telah dihentikan.");
