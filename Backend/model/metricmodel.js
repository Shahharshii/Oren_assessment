const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carbonEmissions: {
    type: Number,
    required: true,
  },
  waterUsage: {
    type: Number,
    required: true,
  },
  wasteDistributed: {
    type: Number,
    required: true,
  },
  energyConsumption: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const Metric = mongoose.model("Metric", metricSchema);
module.exports = Metric;
