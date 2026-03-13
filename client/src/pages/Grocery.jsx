import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FoodPlateAnalyzer from "../components/Grocery/FoodPlateAnalyzer";
import GroceryScanner from "../components/Grocery/GroceryScanner";
import HealthChat from "../components/Grocery/HealthChat";
import "./Grocery.css";

const TABS = [
  { id: "food", label: "Food Plate", icon: "📸", description: "Analyze food nutrition" },
  { id: "grocery", label: "Grocery List", icon: "🛒", description: "Scan grocery items" },
  { id: "health", label: "Health Q&A", icon: "🩺", description: "Ask health questions" },
];

const tabVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export default function Grocery() {
  const [activeTab, setActiveTab] = useState("food");
  const navigate = useNavigate();

  return (
    <div className="grocery-page">
      {/* Header */}
      <div className="grocery-header">
        <button className="grocery-header-back" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1 className="grocery-title">AI Nutrition Hub</h1>
        <p className="grocery-subtitle">
          Analyze your food, scan groceries, and get personalized health advice
        </p>
      </div>

      {/* Tab Bar */}
      <div className="grocery-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`grocery-tab ${activeTab === tab.id ? "active" : ""}`}
            data-tab={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="grocery-tab-icon">{tab.icon}</span>
            <span className="grocery-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grocery-content">
        <AnimatePresence mode="wait">
          {activeTab === "food" && (
            <motion.div key="food" variants={tabVariants}
              initial="initial" animate="animate" exit="exit">
              <FoodPlateAnalyzer />
            </motion.div>
          )}
          {activeTab === "grocery" && (
            <motion.div key="grocery" variants={tabVariants}
              initial="initial" animate="animate" exit="exit">
              <GroceryScanner />
            </motion.div>
          )}
          {activeTab === "health" && (
            <motion.div key="health" variants={tabVariants}
              initial="initial" animate="animate" exit="exit">
              <HealthChat />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
