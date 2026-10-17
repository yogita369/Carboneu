const mongoose = require('mongoose');

const CarbonFactorSchema = new mongoose.Schema({
  category: {            // energy / fuel / travel / food
    type: String,
    required: true
  },
  name: {                // sub-item name, e.g., "Diesel", "Air Travel"
    type: String,
    required: true
  },
  co2Emission: {         // daily CO2
    type: Number,
    required: true
  },
  unit: {                // unit of emission
    type: String,
    required: true
  }
});

module.exports =mongoose.models.CarbonFacto || mongoose.model('CarbonFactor', CarbonFactorSchema);
