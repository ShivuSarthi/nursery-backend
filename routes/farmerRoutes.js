const express = require("express");
const router = express.Router();
const FarmerDetail = require("../models/farmerDetail");
const authRoute = require("../utils/authRoute");
const Plant = require("../models/plant.model");

// Create farmer detail
router.post("/", authRoute, async (req, res) => {
  try {
    const farmerDetail = await FarmerDetail.create(req.body);

    // Update plant stock (add this to your Plant model)
    await Plant.findByIdAndUpdate(req.body.plantId, {
      $inc: { stock: -req.body.quantity },
    });

    res.status(201).json(farmerDetail);
  } catch (err) {
    console.log("Error", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Get all sales
router.get("/", authRoute, async (req, res) => {
  try {
    const details = await FarmerDetail.find().populate("plantId");
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
