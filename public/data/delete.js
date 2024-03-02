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
    console.log(`Entri telah dihapus dari ${filePath} berdasarkan source.`);
  } catch (error) {
    console.error(`Error writing to ${filePath}: ${error.message}`);
    process.exit(1);
  }
};

const deleteSourceEntry = () => {
  // Input values from the terminal
  let sourceToDelete = getInput("Source to delete (type '/exit' to quit): ");

  if (sourceToDelete.toLowerCase() === "/exit") {
    console.log("Operasi penghapusan dibatalkan. Program dihentikan.");
    process.exit(0);
  }

  // Menambahkan "/" ke "sourceToDelete" jika tidak ada
  if (!sourceToDelete.startsWith("/")) {
    sourceToDelete = `/${sourceToDelete}`;
  }

  // Process the first JSON file
  const firstFilePath = path.join(__dirname, "vercel.json");
  let firstData = processJSONFile(firstFilePath);

  // Process the second JSON file
  const secondFilePath = path.join(__dirname, "../../vercel.json");
  let secondData = processJSONFile(secondFilePath);

  // Check if the source exists in either file
  const indexToDeleteFirst = firstData.redirects.findIndex(
    (entry) => entry.source === sourceToDelete,
  );

  const indexToDeleteSecond = secondData.redirects.findIndex(
    (entry) => entry.source === sourceToDelete,
  );

  // Confirm deletion if the source is found in either file
  if (indexToDeleteFirst !== -1 || indexToDeleteSecond !== -1) {
    const deleteConfirmation = readline.keyInYNStrict(
      "Source ditemukan. Apakah Anda yakin ingin menghapus entri ini dari kedua file?",
    );
    if (deleteConfirmation) {
      // Remove entry from the first file
      if (indexToDeleteFirst !== -1) {
        firstData.redirects.splice(indexToDeleteFirst, 1);
      }

      // Remove entry from the second file
      if (indexToDeleteSecond !== -1) {
        secondData.redirects.splice(indexToDeleteSecond, 1);
      }

      // Save updated JSON back to the files
      saveJSONFile(firstFilePath, firstData);
      saveJSONFile(secondFilePath, secondData);

      console.log("Entri berhasil dihapus!");
    } else {
      console.log(
        "Operasi penghapusan dibatalkan. Tidak ada perubahan yang dilakukan.",
      );
    }
  } else {
    console.log(
      "Source tidak ditemukan di kedua file. Tidak ada perubahan yang dilakukan.",
    );
  }

  // Tambahkan perintah untuk selalu terbuka dan panggil fungsi utama kembali
  console.log("\n--------------------------------\n");
  deleteSourceEntry();
};

// Panggil fungsi deleteSourceEntry untuk pertama kali
deleteSourceEntry();
