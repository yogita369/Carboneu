const mongoose = require('mongoose');


const CombustionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  date: { 
    type: Date, 
    default: Date.now 
  },

  //  Energy use (daily hours of operation)
  energyUsage: [
    {
      applianceName: { type: String, required: true },   // Match from user's appliance
      hoursPerDay: { type: Number, required: true }      // Usage hours
    }
  ],

  //  Transport in km
  transport: {
    airplaneKm: { type: Number, default: 0 },
    railwayKm: { type: Number, default: 0 },
    metroKm: { type: Number, default: 0 },
    busKm: { type: Number, default: 0 },
    electricBusKm: { type: Number, default: 0 },
    cabKm: { type: Number, default: 0 },
    electricCabKm: { type: Number, default: 0 }
  },

  //  Fuel (solid fuels - in kg)
  solidFuels: {
    lpgKg: { type: Number, default: 0 },
    cngKg: { type: Number, default: 0 },
    coalKg: { type: Number, default: 0 },
    woodKg: { type: Number, default: 0 }
  },

  //  Liquid fuels (in liters)
  liquidFuels: {
    petrolL: { type: Number, default: 0 },
    dieselL: { type: Number, default: 0 },
    lpgL: { type: Number, default: 0 },
    cngL: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Combustion', CombustionSchema);
