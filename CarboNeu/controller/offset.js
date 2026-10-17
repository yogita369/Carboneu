
const Offset = require('../Models/offset');
const User = require('../Models/user');

const REDUCTION_FACTORS = {
  food_skipped_meals: 2.5,         
  transport_km_saved: 0.21,       
  energy_saving: 3.0,              
  fuel_saved_liters: 2.3,          
  plant_trees: 21,                 
  cycled_waste: 0.05,              
  composting_organic_waste: 0.5    
};

function calcReduction(activityType, quantity) {
  const factor = REDUCTION_FACTORS[activityType];
  if (typeof factor === 'undefined') return 0;
  return Number(quantity) * factor;
}

exports.addPositiveOffset = async (req, res) => {
  try {
    const userId = req.session.userId || req.user?._id;
    const { activityType, quantity } = req.body;

    if (!activityType || !quantity) {
      return res.status(400).send('Missing activityType or quantity');
    }

    const reduction = calcReduction(activityType, quantity);
    if (reduction === 0) {
      return res.status(400).send('Invalid offset activity type or zero quantity');
    }

    const entry = await Offset.create({
      userId,
      type: 'positive',
      activityType,
      quantity: Number(quantity),
      reductionKgCO2: reduction
    });

    // decrement totalEmission (store net emission)
    await User.findByIdAndUpdate(userId, { $inc: { totalEmission: -Math.abs(reduction) } });

    return res.redirect('/neutral');
  } catch (err) {
    console.error('addPositiveOffset error:', err);
    return res.status(500).send('Server Error');
  }
};


exports.reduceEmission = async (req, res) => {
  try {
    const userId = req.session.userId || req.user?._id;
    const { existingActivity, reduceAmount } = req.body;

    if (!existingActivity || !reduceAmount) {
      return res.status(400).send('Missing parameters');
    }

    await Offset.create({
      userId,
      type: 'reduction',
      activityType: existingActivity,
      quantity: 1,
      reductionKgCO2: Number(reduceAmount)
    });

    await User.findByIdAndUpdate(userId, { $inc: { totalEmission: -Math.abs(Number(reduceAmount)) } });
    return res.redirect('/neutral');
  } catch (err) {
    console.error('reduceEmission error:', err);
    return res.status(500).send('Server Error');
  }
};

exports.getUserOffsets = async (userId) => {
  return await Offset.find({ userId }).sort({ createdAt: -1 }).lean();
};


exports.addMultipleOffsets = async (req, res) => {
  try {
    const userId = req.session.userId || req.user?._id;
    const activities = req.body.activities || {};

    if (!activities || typeof activities !== 'object' || Object.keys(activities).length === 0) {
      return res.status(400).json({ success: false, message: 'No activities provided' });
    }

    const docs = [];
    let totalReduction = 0;

    for (const [activityType, rawQty] of Object.entries(activities)) {
      const quantity = Number(rawQty) || 0;
      if (quantity <= 0) continue;

      const reduction = calcReduction(activityType, quantity);
      if (reduction <= 0) continue; // skip unknown activityType

      docs.push({
        userId,
        type: 'positive',
        activityType,
        quantity,
        reductionKgCO2: reduction
      });

      totalReduction += reduction;
    }

    if (docs.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid activities to save' });
    }

    await Offset.insertMany(docs);

    // Update user's totalEmission by subtracting the totalReduction
    await User.findByIdAndUpdate(userId, { $inc: { totalEmission: -Math.abs(totalReduction) } });

    return res.json({ success: true, totalReduction });
  } catch (err) {
    console.error('addMultipleOffsets error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
