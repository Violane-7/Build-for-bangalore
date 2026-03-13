const router = require("express").Router();
const aiService = require("../services/aiService");

// POST /api/health-qa/ask — ask a health question
router.post("/ask", async (req, res) => {
  try {
    const aiResponse = await aiService.healthQA(req.body);
    res.json(aiResponse.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
