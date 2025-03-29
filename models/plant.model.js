const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Tomato, Chili, etc.
  description: { type: String },
  stock: { type: Number, default: 0 },
  //   growthRequirements: { type: String },
  image: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

PlantSchema.index({ createdAt: 1 });
// PlantSchema.index({ status: 1 });

module.exports = mongoose.model("Plant", PlantSchema);
