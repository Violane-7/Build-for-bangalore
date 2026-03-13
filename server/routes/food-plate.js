const router = require("express").Router();
const aiService = require("../services/aiService");

// POST /api/food-plate/analyze — analyze a food plate image
router.post("/analyze", async (req, res) => {
  try {
    const aiResponse = await aiService.foodPlateAnalyze(req.body);
    res.json(aiResponse.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
