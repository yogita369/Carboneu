
const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("../middleware/auth");
const { addPositiveOffset, addMultipleOffsets,reduceEmission, getUserOffsets } = require("../controller/offset");
const Analytics = require("../Models/analytics");
const User = require("../Models/user");


// GET: MAIN NEUTRAL PAGE (/neutral)
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
     const userId = req.session.userId || req.user._id;
    // Load User
    const user = await User.findById(userId);
    // Load only this user's analytics
    const analyticsList = await Analytics.find({ userId });
    const totalEmissionAllTime = analyticsList.reduce(
      (sum, item) => sum + item.totalEmission,0);

      // Get all user's offsets
    const offsetList = await getUserOffsets(userId);
    const totalReduction = offsetList.reduce((sum, item) => sum + item.reductionKgCO2, 0);
const userNetEmission = user.totalEmission || user.netEmission || 0;

    res.render("pages/neutral", {
      user,
      analyticsList,
      totalEmissionAllTime,
      offsetList,
      totalReduction,
      userNetEmission  
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// POST: Positive actions
router.post("/add-positive", ensureAuthenticated, addPositiveOffset);

// ensure express.json() is available globally in your app.js; if not, attach parser to this route
router.post("/add-multiple", ensureAuthenticated, addMultipleOffsets);


// POST: Existing emission reductions
router.post("/reduce-existing", ensureAuthenticated, reduceEmission);
 
router.get("/add-positive", ensureAuthenticated, (req, res) => {
  res.render("pages/form-positive");
});




router.get("/reduce-existing", ensureAuthenticated, (req, res) => {
  res.render("pages/form-action");
});


module.exports = router;
