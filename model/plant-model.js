const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  sunlightRequirement: {
    type: String,
  },
  soilType: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
