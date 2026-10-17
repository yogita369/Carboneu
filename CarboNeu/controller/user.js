// controller/user.js
const User = require("../Models/user"); // your Mongoose User model
const bcrypt = require("bcrypt");

//  Render register page
exports.renderRegister = (req, res) => {
  res.render("users/register");
};

//  Render login page
exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// 🧩 Handle Register
exports.handleRegister = async (req, res) => {
  try {
    const { name, email, password, foodChoice, renewableEnergy, renewablePercent } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      foodChoice,
      renewableEnergy,
      renewablePercent,
    });

    await user.save();

    console.log("✅ User registered:", user);
    res.status(200).json({ message: "Registration successful", user });
  } catch (err) {
    console.error(" Registration error:", err);
    res.status(500).json({ message: "Server error during registration", error: err });
  }
};

//  Handle Login
exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    console.log("Login successful:", user.email);
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err });
  }
};
