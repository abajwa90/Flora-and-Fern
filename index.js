const express = require("express");
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8000;
const dotenv = require("dotenv");
const Plant = require("./model/plant-model");
const { upload } = require("./config/multer");
const { auth } = require('express-openid-connect');
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'NYWhqToKDsnwmkw8QgOg1pMfqyf5h7MH',
  issuerBaseURL: 'https://dev-1kqtfitbng6kcnaa.us.auth0.com'
};

require("dotenv").config();

//DB connection string 
mongoose.connect(
  process.env.DB_CONNECT_STRING
);

//Session Configuration
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

//Passport Configuration



//App Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(auth(config));
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

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
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
