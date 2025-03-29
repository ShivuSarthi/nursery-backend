// server/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const Plant = require("../models/plant.model");
const FarmerDetail = require("../models/farmerDetail");
const authRoute = require("../utils/authRoute");

// Dashboard Statistics Endpoint
router.get("/stats", authRoute, async (req, res) => {
  try {
    // Get basic counts
    const totalPlants = await Plant.countDocuments({ isDeleted: false });
    const totalCategories = await Plant.distinct("type").then(
      (types) => types.length
    );

    // Get active growth percentage (example: plants with status 'active')
    // const activePlants = await Plant.countDocuments({ status: 'active' });
    // const activeGrowth = totalPlants > 0
    //   ? Math.round((activePlants / totalPlants) * 100)
    //   : 0;

    // Monthly plant additions
    const monthlyData = await Plant.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          count: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Sales statistics
    const totalSales = await FarmerDetail.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const recentSales = await FarmerDetail.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("plantId", "name type");

    res.json({
      totalPlants,
      totalCategories,
      // activeGrowth,
      monthlyData,
      sales: {
        totalAmount: totalSales[0]?.totalAmount || 0,
        totalTransactions: totalSales[0]?.count || 0,
        recentSales: recentSales.map((sale) => ({
          _id: sale._id,
          farmerName: sale.farmerName,
          plantName: sale.plantId?.name,
          quantity: sale.quantity,
          amount: sale.amount,
          date: sale.date,
          type: sale.plantId?.type,
          mobile: sale.mobile,
        })),
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
