const mongoose = require("mongoose");

const FarmerDetailSchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FarmerDetailSchema.index({ createdAt: -1 });
FarmerDetailSchema.index({ plantId: 1 });

module.exports = mongoose.model("FarmerDetail", FarmerDetailSchema);
