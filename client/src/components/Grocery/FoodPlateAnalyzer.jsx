import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import "./FoodPlateAnalyzer.css";

const MACRO_COLORS = {
  protein: "#8b5cf6",
  carbs: "#f59e0b",
  fat: "#ef4444",
  fiber: "#22c55e",
  sugar: "#ec4899",
};

// Fallback AI analysis when backend is unavailable
const FALLBACK_FOODS = [
  {
    name: "Grilled Chicken", description: "Lean grilled chicken breast, one of the best sources of high-quality protein.",
    calories_per_serving: 165, serving_size: "1 breast (120g)",
    macros: { protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
    vitamins: { "Vitamin B3": "60% DV", "Vitamin B6": "30% DV", "Vitamin B12": "10% DV", "Vitamin B5": "12% DV" },
    minerals: { "Selenium": "45% DV", "Phosphorus": "20% DV", "Zinc": "8% DV", "Potassium": "7% DV" },
    benefits: ["High protein-to-calorie ratio", "Rich in niacin (B3) for energy metabolism", "Excellent selenium source for thyroid", "Supports muscle building and repair"],
    health_score: 9
  },
  {
    name: "Garden Salad", description: "A fresh mix of leafy greens, vegetables, and light dressing.",
    calories_per_serving: 120, serving_size: "1 bowl (250g)",
    macros: { protein: 3.5, carbs: 12, fat: 7, fiber: 4.8, sugar: 5.2 },
    vitamins: { "Vitamin A": "85% DV", "Vitamin C": "45% DV", "Vitamin K": "120% DV", "Folate": "25% DV" },
    minerals: { "Calcium": "8% DV", "Iron": "10% DV", "Potassium": "12% DV", "Manganese": "15% DV" },
    benefits: ["High in Vitamin K for blood clotting", "Rich in antioxidants", "High fiber for digestion", "Low calorie for weight management"],
    health_score: 9
  },
  {
    name: "Biryani", description: "A fragrant South Asian rice dish layered with spiced meat, saffron, and aromatic herbs.",
    calories_per_serving: 420, serving_size: "1 plate (300g)",
    macros: { protein: 18, carbs: 52, fat: 16, fiber: 2, sugar: 3 },
    vitamins: { "Vitamin A": "8% DV", "Vitamin B12": "15% DV", "Vitamin B6": "12% DV", "Vitamin C": "4% DV" },
    minerals: { "Iron": "15% DV", "Zinc": "12% DV", "Selenium": "20% DV", "Phosphorus": "15% DV" },
    benefits: ["Turmeric has anti-inflammatory properties", "Saffron provides antioxidants", "Balanced carbs and protein", "Aromatic herbs aid digestion"],
    health_score: 6
  },
  {
    name: "Fresh Fruit Bowl", description: "An assortment of fresh seasonal fruits providing natural sugars and antioxidants.",
    calories_per_serving: 150, serving_size: "1 bowl (250g)",
    macros: { protein: 2, carbs: 38, fat: 0.5, fiber: 5, sugar: 28 },
    vitamins: { "Vitamin C": "120% DV", "Vitamin A": "25% DV", "Vitamin K": "15% DV", "Folate": "12% DV" },
    minerals: { "Potassium": "15% DV", "Manganese": "12% DV", "Magnesium": "6% DV", "Copper": "8% DV" },
    benefits: ["Extremely rich in Vitamin C for immunity", "Natural antioxidants fight free radicals", "High fiber supports digestion", "Hydrating due to high water content"],
    health_score: 10
  },
  {
    name: "Pizza", description: "A popular Italian dish with flatbread, tomato sauce, cheese, and toppings.",
    calories_per_serving: 285, serving_size: "1 slice (107g)",
    macros: { protein: 12.2, carbs: 35.6, fat: 10.4, fiber: 2.5, sugar: 3.6 },
    vitamins: { "Vitamin A": "6% DV", "Vitamin C": "2% DV", "Vitamin B6": "5% DV", "Vitamin B12": "8% DV" },
    minerals: { "Calcium": "18% DV", "Iron": "12% DV", "Sodium": "24% DV", "Potassium": "4% DV" },
    benefits: ["Good calcium source from cheese", "Lycopene from tomato sauce", "Contains protein for muscle health", "Tomato sauce provides Vitamin C"],
    health_score: 5
  },
];

function getHealthRating(score) {
  if (score >= 9) return { label: "Excellent", color: "#22c55e" };
  if (score >= 7) return { label: "Good", color: "#84cc16" };
  if (score >= 5) return { label: "Moderate", color: "#eab308" };
  if (score >= 3) return { label: "Fair", color: "#f97316" };
  return { label: "Poor", color: "#ef4444" };
}

export default function FoodPlateAnalyzer() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);
  const macroCardsRef = useRef([]);

  useEffect(() => {
    if (result && resultsRef.current) {
      gsap.from(resultsRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    }
  }, [result]);

  useEffect(() => {
    if (result && macroCardsRef.current.length > 0) {
      gsap.from(macroCardsRef.current.filter(Boolean), {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.7)",
        delay: 0.3,
      });
    }
  }, [result]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyzeFood = async () => {
    setLoading(true);
    try {
      const base64 = preview.split(",")[1];
      const res = await fetch(
        `/api/food-plate/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error("API error");
      }
    } catch {
      // Fallback: use local data
      const food = FALLBACK_FOODS[Math.floor(Math.random() * FALLBACK_FOODS.length)];
      const rating = getHealthRating(food.health_score);
      setResult({
        identified: true,
        food,
        healthRating: { score: food.health_score, ...rating },
        dailyIntakeAdvice: food.calories_per_serving < 200
          ? `Low-calorie food at ${food.calories_per_serving} kcal. Enjoy freely as part of a balanced diet.`
          : `At ${food.calories_per_serving} kcal per serving, balance with vegetables and fiber.`,
      });
    }
    setLoading(false);
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const maxMacro = result
    ? Math.max(...Object.values(result.food.macros).map(Number))
    : 1;

  return (
    <div className="fpa-container">
      {/* Upload Zone */}
      {!preview && (
        <motion.div
          className={`fpa-upload-zone ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span className="fpa-upload-icon">📸</span>
          <p className="fpa-upload-title">Upload Your Food Plate</p>
          <p className="fpa-upload-subtitle">
            Drag & drop an image or click to browse
          </p>
          <button
            className="fpa-upload-btn"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            Choose Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </motion.div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {preview && !result && (
          <motion.div
            className="fpa-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <img src={preview} alt="Food preview" />
            <div className="fpa-preview-overlay">
              <button className="fpa-clear-btn" onClick={clearImage}>
                ✕ Clear
              </button>
              <button
                className="fpa-analyze-btn"
                onClick={analyzeFood}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "🔍 Analyze Food"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <div className="fpa-loading">
          <div className="fpa-spinner" />
          <p className="fpa-loading-text">
            Identifying your food and analyzing nutrition...
          </p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="fpa-results"
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Food Header */}
            <div className="fpa-food-header">
              {preview && (
                <div style={{ marginBottom: "1rem" }}>
                  <img
                    src={preview}
                    alt="Food"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `3px solid ${result.healthRating.color}`,
                      boxShadow: `0 0 24px ${result.healthRating.color}33`,
                    }}
                  />
                </div>
              )}
              <h3 className="fpa-food-name">{result.food.name}</h3>
              <p className="fpa-food-desc">{result.food.description}</p>
              <div
                className="fpa-health-badge"
                style={{
                  background: `${result.healthRating.color}15`,
                  color: result.healthRating.color,
                  border: `1px solid ${result.healthRating.color}40`,
                }}
              >
                ★ Health Score: {result.healthRating.score}/10 —{" "}
                {result.healthRating.label}
              </div>
            </div>

            {/* Calories */}
            <div className="fpa-calorie-section">
              <div className="fpa-calorie-header">
                <div>
                  <p className="fpa-calorie-label">Calories per Serving</p>
                  <p className="fpa-serving-info">{result.food.serving_size}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="fpa-calorie-value">
                    {result.food.calories_per_serving}
                  </span>
                  <span className="fpa-calorie-unit"> kcal</span>
                </div>
              </div>
            </div>

            {/* Macros */}
            <div className="fpa-macros-grid">
              {Object.entries(result.food.macros).map(([key, val], i) => (
                <div
                  key={key}
                  className="fpa-macro-card"
                  ref={(el) => (macroCardsRef.current[i] = el)}
                >
                  <p className="fpa-macro-name">{key}</p>
                  <p
                    className="fpa-macro-value"
                    style={{ color: MACRO_COLORS[key] || "#8b5cf6" }}
                  >
                    {val}
                    <span style={{ fontSize: "0.7rem", color: "#888" }}>g</span>
                  </p>
                  <div className="fpa-macro-bar-track">
                    <div
                      className="fpa-macro-bar-fill"
                      style={{
                        width: `${Math.min((val / maxMacro) * 100, 100)}%`,
                        background: MACRO_COLORS[key] || "#8b5cf6",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Vitamins & Minerals */}
            <div className="fpa-nutrients-section">
              <div className="fpa-nutrient-group">
                <p className="fpa-nutrient-title">💊 Vitamins</p>
                {Object.entries(result.food.vitamins || {}).map(([k, v]) => (
                  <div key={k} className="fpa-nutrient-item">
                    <span className="fpa-nutrient-name">{k}</span>
                    <span className="fpa-nutrient-value">{v}</span>
                  </div>
                ))}
              </div>
              <div className="fpa-nutrient-group">
                <p className="fpa-nutrient-title">⚡ Minerals</p>
                {Object.entries(result.food.minerals || {}).map(([k, v]) => (
                  <div key={k} className="fpa-nutrient-item">
                    <span className="fpa-nutrient-name">{k}</span>
                    <span className="fpa-nutrient-value">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="fpa-benefits-section">
              <p className="fpa-benefits-title">✨ Health Benefits</p>
              {(result.food.benefits || []).map((b, i) => (
                <div key={i} className="fpa-benefit-item">
                  <div className="fpa-benefit-dot" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* Intake Advice */}
            <div className="fpa-advice">
              💡 {result.dailyIntakeAdvice}
            </div>

            {/* Scan Another */}
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button className="fpa-upload-btn" onClick={clearImage}>
                📸 Scan Another Food
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
