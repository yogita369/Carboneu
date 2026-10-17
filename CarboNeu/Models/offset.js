// models/Offset.js
const mongoose = require('mongoose');
const OffsetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. 'positive' or 'reduction'
  activityType: { type: String }, // e.g. 'plant_trees', 'cycled_instead_car'
  quantity: { type: Number },
  reductionKgCO2: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Offset', OffsetSchema);
