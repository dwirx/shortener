const express = require("express");
const path = require("path");
const vercelData = require("./vercel.json");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/:redirectPath", (req, res) => {
  const redirect = vercelData.redirects.find(
    (redirect) => redirect.source === `/${req.params.redirectPath}`,
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
