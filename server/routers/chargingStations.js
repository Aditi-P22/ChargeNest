const express = require("express");
const router = express.Router();
const ChargingStation = require("../models/chargingStationModel"); // Your mongoose model

// GET all stations
router.get("/", async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a station by ID
router.delete("/:id", async (req, res) => {
  try {
    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

// POST /api/charging-stations - Add a new charging station
router.post("/", async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;

    // Basic validation (you can expand this)
    if (
      !name ||
      !location ||
      !location.latitude ||
      !location.longitude ||
      !powerOutput ||
      !connectorType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newStation = new ChargingStation({
      name,
      location,
      status: status || "Active", // default to Active if not provided
      powerOutput,
      connectorType,
    });

    const savedStation = await newStation.save();
    res.status(201).json({ success: true, data: savedStation });
  } catch (error) {
    console.error("Error adding charging station:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

module.exports = router;
