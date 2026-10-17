const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/auth");
const { showAnalytics, showUserAnalytics } = require("../controller/analytics");

// View all analytics for logged-in user
router.get("/", ensureAuthenticated, showUserAnalytics);

// View single analytics detail
router.get("/:id", ensureAuthenticated, showAnalytics);

module.exports = router;
