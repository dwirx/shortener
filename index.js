const express = require("express");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");

const app = express();
const port = process.env.PORT || 3000;

const vercelDataPath = path.resolve(__dirname, "public/data/vercel.json");
let vercelData = loadVercelData(); // Memuat data Vercel saat server pertama kali dimulai

// Fungsi untuk memuat ulang data Vercel
function loadVercelData() {
    try {
        const data = fs.readFileSync(vercelDataPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading Vercel data:", error.message);
        return { redirects: [] }; // Mengembalikan objek kosong jika terjadi kesalahan
    }
}

// Fungsi untuk memuat ulang data Vercel saat terjadi perubahan pada berkas
const reloadVercelData = () => {
    try {
        vercelData = loadVercelData();
        console.log("Vercel data reloaded.");
    } catch (error) {
        console.error("Error reloading Vercel data:", error.message);
    }
};

// Membuat pemantau berkas untuk file vercel.json
const watcher = chokidar.watch(vercelDataPath);
watcher.on("change", reloadVercelData);

app.use(express.static(path.join(__dirname, "public")));

app.get("/:redirectPath", (req, res) => {
    const redirect = vercelData.redirects.find(
        (redirect) => redirect.source === `/${req.params.redirectPath}`
    );

    if (redirect) {
        res.redirect(redirect.destination);
    } else {
        res.status(404).send("Not Found");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
