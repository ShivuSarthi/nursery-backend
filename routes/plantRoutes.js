const express = require("express");
const router = express.Router();
const Plant = require("../models/plant.model");
const authRoute = require("../utils/authRoute");

// Get all plants (for home page categories)
router.get("/", authRoute, async (req, res) => {
  try {
    const plants = await Plant.find({ isDeleted: false });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new plant (for Post page)
router.post("/", authRoute, async (req, res) => {
  const plant = new Plant(req.body);
  try {
    const savedPlant = await plant.save();
    res.status(201).json(savedPlant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single plants by id
router.get("/:id", authRoute, async (req, res) => {
  try {
    const plantDetails = await Plant.findById(req.params.id);

    if (!plantDetails) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json({ response: plantDetails });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Edit Plants by id 
router.put("/:id", authRoute, async (req, res) => {
  try {

    const { id } = req.params;
    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(updatedPlant);
  } catch (error) {
    res.status(400).json({ 
      message: error.message || 'Error updating plant'
    });
  }
});



router.delete("/:id", authRoute, async (req, res) => {
  try {
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
