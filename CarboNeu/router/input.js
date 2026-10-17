const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/auth");
const { submitInput } = require("../controller/input");

// 🧾 Display input form (multi-step EJS UI)
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("pages/input"); // views/pages/input.ejs
});

// 📤 Handle input submission (calculations + save)
router.post("/submit-input", ensureAuthenticated, submitInput);

module.exports = router;
