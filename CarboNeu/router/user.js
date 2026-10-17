const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Models/user");
const bcrypt = require("bcrypt");

// --- REGISTER ---
router.get("/register", (req, res) => {
  res.render("users/register");
});

// --- REGISTER ---
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      "food-preference": foodPreference,
      "meat-frequency": meatFrequency,
      "renewable-energy": renewableEnergy,
      energyPercentage,
      appliancesData,
    } = req.body;
    console.log(appliancesData);
    // 🧂 Map frontend terms to schema format
    const foodChoice = {
      type: foodPreference === "meat-eater" ? "non-vegetarian" : foodPreference, // convert to schema enum
      frequency:
        foodPreference === "meat-eater"
          ? meatFrequency === "most-meals"
            ? "most"
            : meatFrequency === "some-meals"
            ? "some"
            : "rare"
          : undefined, // only needed for non-veg
    };

    const usesNonRenewableEnergy = renewableEnergy === "no";
    const renewableEnergyPercent =
      renewableEnergy === "yes" ? Number(energyPercentage) : undefined;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      foodChoice,
      usesNonRenewableEnergy,
      renewableEnergyPercent,
      appliances: JSON.parse(appliancesData),
    });

    await newUser.save();
    console.log("✅ User registered:", newUser);

    res.redirect("/login");
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).send("Error registering user");
  }
});

// --- LOGIN ---
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home", // redirect after successful login
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// --- LOGOUT ---
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

module.exports = router;
