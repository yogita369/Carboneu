const CarbonFactor = require("../Models/carbonfactor");
const Analytics = require("../Models/analytics");
const User = require("../Models/user");

exports.submitInput = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1️ Destructure input AFTER fetching user
    const { energy, fuel1, fuel2, travel1, travel2 } = req.body;
    const travel = { ...travel1, ...travel2 };
    const fuel = { ...fuel1, ...fuel2 };

    console.log({ energy, fuel, travel });

    // 2️ Fetch carbon factors
    const factors = await CarbonFactor.find();
    const carbonFactors = {};
    for (const factor of factors) {
      if (!carbonFactors[factor.category]) carbonFactors[factor.category] = {};
      carbonFactors[factor.category][factor.name] = factor.co2Emission;
    }

    // 3️ Food emission
    const foodType = user.foodChoice?.type;
    const foodFrequency = user.foodChoice?.frequency;
    const foodFactors = factors.filter(f => f.category === "food");
    let foodEmission = 0;

    if (foodType === "vegan") {
      foodEmission = foodFactors.find(f => f.name === "vegan")?.co2Emission || 0;
    } else if (foodType === "vegetarian") {
      foodEmission = foodFactors.find(f => f.name === "vegetarian")?.co2Emission || 0;
    } else if (foodType === "non-vegetarian") {
      if (foodFrequency === "most") foodEmission = foodFactors.find(f => f.name === "mostlyMeat")?.co2Emission || 0;
      else if (foodFrequency === "some") foodEmission = foodFactors.find(f => f.name === "someMeat")?.co2Emission || 0;
      else if (foodFrequency === "rare") foodEmission = foodFactors.find(f => f.name === "rareMeat")?.co2Emission || 0;
    }

    // 4️ Fuel & Travel emissions
    const fuelEmissions =
      (fuel.petrolLit || 0) * (carbonFactors.fuel.petrol || 0) +
      (fuel.dieselLit || 0) * (carbonFactors.fuel.diesel || 0) +
      (fuel.cngKg || 0) * (carbonFactors.fuel.cng || 0) +
      (fuel.lpgKg || 0) * (carbonFactors.fuel.lpg || 0) +
      (fuel.woodKg || 0) * (carbonFactors.fuel.wood || 0) +
      (fuel.coalKg || 0) * (carbonFactors.fuel.coal || 0);

    const travelEmissions =
      (travel.airKm || 0) * (carbonFactors.travel.air || 0) +
      (travel.trainKm || 0) * (carbonFactors.travel.train || 0) +
      (travel.metroKm || 0) * (carbonFactors.travel.metro || 0) +
      (travel.busKm || 0) * (carbonFactors.travel.bus || 0) +
      (travel.electricBusKm || 0) * (carbonFactors.travel.electricBus || 0) +
      (travel.carKm || 0) * (carbonFactors.travel.car || 0) +
      (travel.electricCarKm || 0) * (carbonFactors.travel.electricCar || 0);

    // 5️ Appliance calculations
    function getEfficiency(star) {
      switch (star) {
        case 1: return 1.0;
        case 2: return 0.95;
        case 3: return 0.9;
        case 4: return 0.85;
        case 5: return 0.8;
        default: return 1.0;
      }
    }

    function calculateApplianceKWh(applianceName, hours) {
      // const appliance = user.appliances.find(a => a.name === applianceName);
      const appliance = user.appliances.find(
  a => a.name.toLowerCase().replace(/[- ]/g, '') === 
      applianceName.toLowerCase().replace(/[- ]/g, '')
);

      if (!appliance || !appliance.details?.length) return 0;

      let totalKWh = 0;
      appliance.details.forEach(detail => {
        totalKWh += detail.powerKWh * getEfficiency(detail.starRating) * hours;
      });

      return totalKWh / 1000;
    }
//  console.log("Finding Appliance:", applianceName);
// console.log("Matched:", appliance);



    const acKWh = calculateApplianceKWh("AC", energy.acHrs || 0);
    const fanKWh = calculateApplianceKWh("Fan", energy.fanHrs || 0);
    const washingMachineKWh = calculateApplianceKWh("Washing Machine", energy.washingMachineHrs || 0);
    const refrigeratorKWh = calculateApplianceKWh("Refrigerator", energy.refrigeratorHrs || 0);
    const geyserKWh = calculateApplianceKWh("Geyser", energy.geyserHrs || 0);
    const totalKWh = acKWh + fanKWh + washingMachineKWh + refrigeratorKWh + geyserKWh;

const usesNonRenewableEnergy = req.body['renewable-energy'] === 'no'; 
let renewablePercent = Number(req.body['energyPercentage'] || 0); // from your input field
let nonRenewablePercent = 100 - renewablePercent;


const renewableKWh = totalKWh * (renewablePercent / 100);
const nonRenewableKWh = totalKWh * (nonRenewablePercent / 100);

    // const renewablePercent = user.renewableEnergyPercent || 0;
    // const renewableKWh = totalKWh * (renewablePercent / 100);
    // const nonRenewableKWh = totalKWh - renewableKWh;

    const nonRenewableCO2 = nonRenewableKWh * 0.82;
    const renewableCO2 = renewableKWh * 0.05;

    const totalEnergy = nonRenewableCO2 + renewableCO2;
    console.log("the total energy is:",{totalEnergy});
    console.log("ENERGY INPUT:", energy);
console.log("USER APPLIANCES:", user.appliances);
console.log("AC RESULT:", calculateApplianceKWh("AC", energy.acHrs || 0));

    // 6️ Total emission
    const totalEmission = totalEnergy + fuelEmissions + travelEmissions + foodEmission;



    // 7️ Save to Analytics
    const analytics = new Analytics({
      userId: req.user?._id,
      totalEmission,
      breakdown: {
        energy: totalEnergy,
        fuel: fuelEmissions,
        travel: travelEmissions,
        food: foodEmission
      },
      createdAt: new Date(),
    });
  
    await analytics.save();

    // 8️ Redirect to analytics
    res.redirect(`/analytics?total=${totalEmission.toFixed(2)}`);

  } catch (error) {
    console.error("Error in calculation:", error);
    res.status(500).json({ message: "Server error during emission calculation" });
  }
};
