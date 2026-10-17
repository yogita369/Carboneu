const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  // ⚡ Energy Appliances (list of top 5)
  energy: [
    {
      name: { type: String, required: true }, // e.g., "Air Conditioner"
      powerKWh: { type: Number, required: true }, // e.g., 1.5
      starRating: { type: Number, min: 1, max: 5, required: true }, // efficiency
    },
  ],
  appliances: [
    {
      name: { type: String, required: true },
      count: { type: Number, required: true },
      details: [
        {
          powerKWh: { type: Number, required: true },
          starRating: { type: Number, min: 1, max: 5, required: true },
        },
      ],
    },
  ],

totalEmission: {
  type: Number,
  default: 0
},


  // 🍽️ Food choice
  foodChoice: {
    type: {
      type: String,
      enum: ["vegan", "vegetarian", "non-vegetarian"],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["most", "some", "rare"],
      required: function () {
        return this.foodChoice.type === "non-vegetarian";
      },
    },
  },

  // 🔋 Energy Source
  usesNonRenewableEnergy: {
    type: Boolean,
    required: true,
  },
  renewableEnergyPercent: {
    type: Number,
    enum: [25, 50, 75, 100],
    required: function () {
      return this.usesNonRenewableEnergy === true;
    },
  },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
