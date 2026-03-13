const router = require("express").Router();
const auth = require("../middleware/auth");
const GroceryScan = require("../models/GroceryScan");
const aiService = require("../services/aiService");

// POST /api/grocery/scan — analyze a grocery list/receipt
router.post("/scan", auth, async (req, res) => {
  try {
    const aiResponse = await aiService.groceryAnalyze(req.body);

    const scan = await GroceryScan.create({
      userId: req.user.id,
      items: req.body.items || [],
      nutritionAnalysis: aiResponse.data.nutritionAnalysis,
      recommendations: aiResponse.data.recommendations,
    });

    res.status(201).json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/grocery/history
router.get("/history", auth, async (req, res) => {
  try {
    const scans = await GroceryScan.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/grocery/scan-image — analyze a grocery list image
router.post("/scan-image", async (req, res) => {
  try {
    const aiResponse = await aiService.groceryAnalyzeImage(req.body);
    res.json(aiResponse.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
