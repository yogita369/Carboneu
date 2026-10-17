const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CarbonFactor = require("./Models/carbonfactor");

dotenv.config();

const data = [
  // -------------------- ENERGY --------------------
  { category: "energy", name: "ac", co2Emission: 0.615, unit: "kg CO2 per hr" },
  {
    category: "energy",
    name: "heater",
    co2Emission: 0.435,
    unit: "kg CO2 per hr",
  },
  {
    category: "energy",
    name: "refrigerator",
    co2Emission: 0.235,
    unit: "kg CO2 per hr",
  },
  {
    category: "energy",
    name: "washingMachine",
    co2Emission: 0.05,
    unit: "kg CO2 per hr",
  },
  {
    category: "energy",
    name: "fan",
    co2Emission: 0.615,
    unit: "kg CO2 per hr",
  },

  // -------------------- TRAVEL --------------------
  { category: "travel", name: "air", co2Emission: 0.12, unit: "kg CO2 per km" },
  {
    category: "travel",
    name: "train",
    co2Emission: 0.008,
    unit: "kg CO2 per km",
  },
  {
    category: "travel",
    name: "metro",
    co2Emission: 0.014,
    unit: "kg CO2 per km",
  },
  {
    category: "travel",
    name: "bus",
    co2Emission: 0.054,
    unit: "kg CO2 per km",
  },
  {
    category: "travel",
    name: "electricBus",
    co2Emission: 0.038,
    unit: "kg CO2 per km",
  },
  { category: "travel", name: "car", co2Emission: 0.14, unit: "kg CO2 per km" },
  {
    category: "travel",
    name: "electricCar",
    co2Emission: 0.1,
    unit: "kg CO2 per km",
  },

  // -------------------- FUEL --------------------
  { category: "fuel", name: "lpg", co2Emission: 2.0, unit: "kg CO2 per kg" },
  { category: "fuel", name: "wood", co2Emission: 3.0, unit: "kg CO2 per kg" },
  { category: "fuel", name: "coal", co2Emission: 3.5, unit: "kg CO2 per kg" },
  {
    category: "fuel",
    name: "petrol",
    co2Emission: 2.0,
    unit: "kg CO2 per liter",
  },
  {
    category: "fuel",
    name: "diesel",
    co2Emission: 3.0,
    unit: "kg CO2 per liter",
  },
  { category: "fuel", name: "cng", co2Emission: 2.0, unit: "kg CO2 per liter" },

  // -------------------- FOOD --------------------
  {
    category: "food",
    name: "vegan",
    co2Emission: 5.48,
    unit: "kg CO2 per person per day",
  },
  {
    category: "food",
    name: "vegetarian",
    co2Emission: 6.03,
    unit: "kg CO2 per person per day",
  },
  {
    category: "food",
    name: "someMeat",
    co2Emission: 8.22,
    unit: "kg CO2 per person per day",
  },
  {
    category: "food",
    name: "rareMeat",
    co2Emission: 6.58,
    unit: "kg CO2 per person per day",
  },
  {
    category: "food",
    name: "mostlyMeat",
    co2Emission: 10.41,
    unit: "kg CO2 per person per day",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    await CarbonFactor.deleteMany();
    console.log("Old data cleared.");

    await CarbonFactor.insertMany(data);
    console.log("✅ Carbon factors inserted successfully!");

    process.exit();
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
