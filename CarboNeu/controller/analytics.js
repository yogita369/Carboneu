const Analytics = require("../Models/analytics");
const User = require("../Models/user");
exports.showUserAnalytics = async (req, res) => {
  try {
    const userId = req.user?._id;
    const allAnalytics = await Analytics.find({ userId }).sort({
      createdAt: -1,
    });

    res.render("pages/allAnalytics", {
      user: req.user,
      analyticsList: allAnalytics,
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res
      .status(500)
      .render("pages/error", { message: "Unable to load analytics history" });
  }
};

exports.showAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const analytics = await Analytics.findById(id).populate(
      "userId",
      "name email"
    );

    if (!analytics) {
      return res
        .status(404)
        .render("pages/404", { message: "Analytics not found" });
    }

    res.render("pages/analytics", {
      user: analytics.userId,
      totalEmission: analytics.totalEmission.toFixed(2),
      breakdown: analytics.breakdown,
      createdAt: analytics.createdAt.toLocaleString(),
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).render("pages/error", {
      message: "Server error fetching analytics data",
    });
  }
};
