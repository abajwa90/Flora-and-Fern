const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const Plant = require("./model/plant-model");
const { upload } = require("./config/multer");

mongoose.connect(
  'mongodb+srv://flora-and-fern:T3Fs0ih3HxDCLJAU@flora-and-fern.yhfwse9.mongodb.net/flora-and-fern',
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  const plants = await Plant.find();
  res.render("index", { plants });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/create", upload.single("image"), async (req, res) => {
  const { name, price, description, sunlightRequirement, soilType, rating } =
    req.body;
  if (!req.file) {
    return res.status(400).send("Please upload a file");
  }
  if (!name || !price || !description || !sunlightRequirement || !soilType) {
    return res.status(400).send("Please fill all the fields");
  }
  const image = "/uploads/" + req?.file?.filename;
  const plant = new Plant({
    name,
    price,
    image,
    description,
    sunlightRequirement,
    soilType,
    rating,
  });
  await plant.save();
  res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
