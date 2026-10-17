const mongoose = require("mongoose");

const EmissionAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // total CO2 emitted for that day (in kg or tonnes)
  totalEmission: {
    type: Number,
    required: true,
  },

  // breakdown by category
  breakdown: {
    energy: { type: Number, default: 0 }, // kWh → CO2
    travel: { type: Number, default: 0 }, // km → CO2
    fuel: { type: Number, default: 0 }, // litre/kg → CO2
    food: { type: Number, default: 0 }, // food habits → CO2
    others: { type: Number, default: 0 }, // optional
  },

  // date-based analytics (for daily tracking)
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.models.EmissionAnalytics|| mongoose.model("EmissionAnalytics", EmissionAnalyticsSchema);
