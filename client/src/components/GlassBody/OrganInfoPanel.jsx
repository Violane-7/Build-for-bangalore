import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORGAN_DATA = {
  heart: {
    name: "Heart",
    icon: "❤️",
    metrics: [
      { label: "Resting Heart Rate", value: "78 bpm", status: "normal" },
      { label: "Blood Pressure", value: "128/82 mmHg", status: "warning" },
      { label: "Cardiovascular Risk", value: "Moderate", status: "warning" },
    ],
    recommendations: [
      "Increase aerobic activity to 150 min/week",
      "Reduce sodium intake below 2,300 mg/day",
      "Monitor blood pressure weekly",
    ],
    history: [
      { date: "2026-03-10", test: "ECG", result: "Normal sinus rhythm", status: "normal" },
      { date: "2026-02-22", test: "Lipid Panel", result: "LDL 142 mg/dL (borderline high)", status: "warning" },
      { date: "2026-02-01", test: "Blood Pressure Check", result: "130/85 mmHg", status: "warning" },
      { date: "2026-01-15", test: "Echocardiogram", result: "Ejection Fraction 58% — normal", status: "normal" },
      { date: "2025-12-10", test: "Stress Test", result: "No ischemic changes detected", status: "normal" },
    ],
    updates: [
      { date: "2026-03-12", change: "Resting HR improved from 82 to 78 bpm after 4 weeks of cardio", trend: "improved" },
      { date: "2026-02-25", change: "LDL cholesterol slightly elevated — dietary adjustments recommended", trend: "worsened" },
      { date: "2026-02-05", change: "Blood pressure trending down with reduced sodium diet", trend: "improved" },
    ],
  },
  lungs: {
    name: "Lungs",
    icon: "🫁",
    metrics: [
      { label: "SpO2", value: "97%", status: "normal" },
      { label: "Respiratory Rate", value: "16/min", status: "normal" },
      { label: "Lung Capacity", value: "Good", status: "normal" },
    ],
    recommendations: [
      "Continue regular breathing exercises",
      "Avoid prolonged exposure to pollutants",
    ],
    history: [
      { date: "2026-03-08", test: "Pulse Oximetry", result: "SpO2 97%, stable", status: "normal" },
      { date: "2026-02-15", test: "Spirometry", result: "FEV1/FVC ratio 0.82 — normal", status: "normal" },
      { date: "2026-01-20", test: "Chest X-Ray", result: "No abnormalities detected", status: "normal" },
      { date: "2025-11-30", test: "Pulmonary Function Test", result: "Lung capacity within normal range", status: "normal" },
    ],
    updates: [
      { date: "2026-03-10", change: "Respiratory rate stable at 16/min — consistent with fitness improvements", trend: "stable" },
      { date: "2026-02-18", change: "Lung capacity improved by 5% — attributed to breathing exercises", trend: "improved" },
    ],
  },
  liver: {
    name: "Liver",
    icon: "🫘",
    metrics: [
      { label: "ALT Level", value: "42 U/L", status: "warning" },
      { label: "AST Level", value: "38 U/L", status: "normal" },
      { label: "Liver Health", value: "Monitor", status: "warning" },
    ],
    recommendations: [
      "Reduce alcohol consumption",
      "Increase antioxidant-rich foods",
      "Schedule liver function test in 3 months",
    ],
    history: [
      { date: "2026-03-05", test: "Liver Function Panel", result: "ALT 42 U/L, AST 38 U/L", status: "warning" },
      { date: "2026-01-28", test: "Liver Function Panel", result: "ALT 48 U/L, AST 40 U/L", status: "warning" },
      { date: "2025-12-15", test: "Abdominal Ultrasound", result: "Mild fatty liver noted", status: "warning" },
      { date: "2025-11-01", test: "Liver Function Panel", result: "ALT 35 U/L, AST 32 U/L — normal", status: "normal" },
    ],
    updates: [
      { date: "2026-03-06", change: "ALT levels improving — dropped from 48 to 42 over 5 weeks", trend: "improved" },
      { date: "2026-01-30", change: "Mild fatty liver detected — dietary changes initiated", trend: "worsened" },
      { date: "2025-11-05", change: "Baseline liver function within normal range", trend: "stable" },
    ],
  },
  kidneyL: {
    name: "Left Kidney",
    icon: "🫘",
    metrics: [
      { label: "Creatinine", value: "1.0 mg/dL", status: "normal" },
      { label: "GFR", value: "92 mL/min", status: "normal" },
      { label: "Kidney Function", value: "Good", status: "normal" },
    ],
    recommendations: ["Stay hydrated — aim for 2.5L water/day", "Limit processed food intake"],
    history: [
      { date: "2026-03-01", test: "Renal Function Panel", result: "Creatinine 1.0, GFR 92", status: "normal" },
      { date: "2026-01-10", test: "Urinalysis", result: "No proteinuria, no hematuria", status: "normal" },
      { date: "2025-11-20", test: "Kidney Ultrasound", result: "Normal size, no stones", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "GFR stable at 92 mL/min — healthy kidney function maintained", trend: "stable" },
      { date: "2026-01-12", change: "Urinalysis clear — no signs of kidney stress", trend: "stable" },
    ],
  },
  kidneyR: {
    name: "Right Kidney",
    icon: "🫘",
    metrics: [
      { label: "Creatinine", value: "1.0 mg/dL", status: "normal" },
      { label: "GFR", value: "92 mL/min", status: "normal" },
      { label: "Kidney Function", value: "Good", status: "normal" },
    ],
    recommendations: ["Stay hydrated — aim for 2.5L water/day", "Limit processed food intake"],
    history: [
      { date: "2026-03-01", test: "Renal Function Panel", result: "Creatinine 1.0, GFR 92", status: "normal" },
      { date: "2026-01-10", test: "Urinalysis", result: "No proteinuria, no hematuria", status: "normal" },
      { date: "2025-11-20", test: "Kidney Ultrasound", result: "Normal size, no stones", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "GFR stable at 92 mL/min — healthy kidney function maintained", trend: "stable" },
      { date: "2026-01-12", change: "Urinalysis clear — no signs of kidney stress", trend: "stable" },
    ],
  },
  stomach: {
    name: "Stomach",
    icon: "🫄",
    metrics: [
      { label: "Gut Health Score", value: "7.2/10", status: "normal" },
      { label: "Metabolic Rate", value: "1,820 kcal", status: "normal" },
      { label: "Glycemic Control", value: "Good", status: "normal" },
    ],
    recommendations: [
      "Increase fiber intake to 25g/day",
      "Add probiotic-rich foods",
    ],
    history: [
      { date: "2026-03-07", test: "H. Pylori Breath Test", result: "Negative", status: "normal" },
      { date: "2026-02-10", test: "Gastric pH Test", result: "pH 2.5 — normal acidity", status: "normal" },
      { date: "2025-12-20", test: "Blood Glucose (Fasting)", result: "92 mg/dL — normal", status: "normal" },
    ],
    updates: [
      { date: "2026-03-08", change: "Gut health score improved from 6.5 to 7.2 with probiotic supplementation", trend: "improved" },
      { date: "2026-02-12", change: "No signs of gastric distress — diet adjustments working well", trend: "stable" },
    ],
  },
  digestive: {
    name: "Digestive System",
    icon: "🫗",
    metrics: [
      { label: "Digestive Efficiency", value: "82%", status: "normal" },
      { label: "Nutrient Absorption", value: "Good", status: "normal" },
      { label: "GI Inflammation", value: "Low", status: "normal" },
      { label: "Bowel Regularity", value: "Normal", status: "normal" },
    ],
    recommendations: [
      "Eat slowly and chew food thoroughly",
      "Include fermented foods like yogurt and kimchi",
      "Stay hydrated — water aids digestion",
      "Limit processed and fried foods",
    ],
    history: [
      { date: "2026-03-06", test: "Stool Analysis", result: "Normal flora, no pathogens", status: "normal" },
      { date: "2026-02-18", test: "Celiac Panel", result: "Negative — no gluten sensitivity", status: "normal" },
      { date: "2026-01-05", test: "Colonoscopy", result: "No polyps, healthy mucosa", status: "normal" },
      { date: "2025-11-10", test: "Food Intolerance Test", result: "Mild lactose sensitivity detected", status: "warning" },
    ],
    updates: [
      { date: "2026-03-07", change: "Digestive efficiency up from 76% to 82% with dietary changes", trend: "improved" },
      { date: "2026-02-20", change: "Celiac panel clear — gluten is not a concern", trend: "stable" },
      { date: "2025-11-12", change: "Lactose intolerance identified — switched to lactose-free alternatives", trend: "worsened" },
    ],
  },
  brain: {
    name: "Brain",
    icon: "🧠",
    metrics: [
      { label: "Sleep Quality", value: "6.8/10", status: "warning" },
      { label: "Stress Level", value: "Moderate", status: "warning" },
      { label: "Cognitive Score", value: "85/100", status: "normal" },
    ],
    recommendations: [
      "Aim for 7-8 hours of sleep",
      "Practice mindfulness 10 min/day",
      "Reduce screen time before bed",
    ],
    history: [
      { date: "2026-03-09", test: "Cognitive Assessment", result: "Score 85/100 — above average", status: "normal" },
      { date: "2026-02-20", test: "Sleep Study", result: "REM sleep 18% — slightly below optimal 20-25%", status: "warning" },
      { date: "2026-01-15", test: "Cortisol Level", result: "18 mcg/dL — upper normal range", status: "warning" },
      { date: "2025-12-05", test: "Neuropsychological Screening", result: "No cognitive decline detected", status: "normal" },
    ],
    updates: [
      { date: "2026-03-11", change: "Sleep quality improved from 5.9 to 6.8 with consistent bedtime routine", trend: "improved" },
      { date: "2026-02-22", change: "REM sleep still below optimal — melatonin supplement suggested", trend: "worsened" },
      { date: "2026-01-18", change: "Cortisol slightly elevated — linked to work-related stress", trend: "worsened" },
    ],
  },
  eyes: {
    name: "Eyes",
    icon: "👁️",
    metrics: [
      { label: "Vision Score", value: "Good", status: "normal" },
      { label: "Screen Time", value: "8.2 hrs/day", status: "warning" },
      { label: "Eye Strain", value: "Moderate", status: "warning" },
    ],
    recommendations: [
      "Follow 20-20-20 rule (every 20 min, look 20ft away for 20s)",
      "Use blue light filter after 8 PM",
    ],
    history: [
      { date: "2026-03-04", test: "Visual Acuity Test", result: "20/20 both eyes", status: "normal" },
      { date: "2026-02-12", test: "Intraocular Pressure", result: "14 mmHg — normal range", status: "normal" },
      { date: "2026-01-08", test: "Retinal Scan", result: "No signs of macular degeneration", status: "normal" },
      { date: "2025-12-01", test: "Dry Eye Assessment", result: "Mild dryness — artificial tears recommended", status: "warning" },
      { date: "2025-10-15", test: "Color Vision Test", result: "Normal trichromatic vision", status: "normal" },
    ],
    updates: [
      { date: "2026-03-05", change: "Vision remains 20/20 — eye health stable", trend: "stable" },
      { date: "2026-02-14", change: "Screen time reduced from 9.5 to 8.2 hrs/day — eye strain improving", trend: "improved" },
      { date: "2025-12-03", change: "Mild dry eyes detected — likely from excessive screen use", trend: "worsened" },
    ],
  },
};

const statusColors = {
  normal: "#44ff88",
  warning: "#ffaa00",
  critical: "#ff2244",
};

const trendColors = {
  improved: "#44ff88",
  stable: "#4488ff",
  worsened: "#ff6644",
};

const trendIcons = {
  improved: "↑",
  stable: "→",
  worsened: "↓",
};

const panelStyle = {
  position: "absolute",
  top: "10px",
  right: "20px",
  bottom: "10px",
  width: "360px",
  background: "rgba(10, 10, 20, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(68, 136, 255, 0.3)",
  borderRadius: "16px",
  padding: "0",
  color: "#e0e0e0",
  zIndex: 50,
  boxShadow: "0 0 40px rgba(68, 136, 255, 0.15)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const metricRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const TAB_STYLE = (active) => ({
  flex: 1,
  padding: "8px 4px",
  background: active ? "rgba(68, 136, 255, 0.15)" : "transparent",
  border: "none",
  borderBottom: active ? "2px solid #4488ff" : "2px solid transparent",
  color: active ? "#fff" : "#666",
  fontSize: "0.72rem",
  fontWeight: 600,
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  transition: "all 0.2s ease",
});

export default function OrganInfoPanel({ selectedOrgan, onClose, riskScores = {} }) {
  const data = ORGAN_DATA[selectedOrgan];
  const [activeTab, setActiveTab] = useState("current");

  if (!data) return null;

  const riskScore = riskScores[selectedOrgan] || 0.3;
  const riskLabel = riskScore > 0.7 ? "High Risk" : riskScore > 0.4 ? "Moderate Risk" : "Low Risk";
  const riskColor = riskScore > 0.7 ? "#ff2244" : riskScore > 0.4 ? "#ffaa00" : "#44ff88";

  return (
    <AnimatePresence>
      {selectedOrgan && (
        <motion.div
          style={panelStyle}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div style={{ padding: "20px 20px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.8rem" }}>{data.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#fff" }}>{data.name}</h3>
                  <span style={{ fontSize: "0.75rem", color: riskColor, fontWeight: 600 }}>
                    ● {riskLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "1px solid #333",
                  color: "#888",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Risk bar */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ height: "4px", background: "#1a1a2e", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${riskScore * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", background: riskColor, borderRadius: "2px" }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <button style={TAB_STYLE(activeTab === "current")} onClick={() => setActiveTab("current")}>
                Current
              </button>
              <button style={TAB_STYLE(activeTab === "history")} onClick={() => setActiveTab("history")}>
                Test History
              </button>
              <button style={TAB_STYLE(activeTab === "updates")} onClick={() => setActiveTab("updates")}>
                Updates
              </button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
            {/* === CURRENT TAB === */}
            {activeTab === "current" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Metrics */}
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Health Metrics
                  </h4>
                  {data.metrics.map((m, i) => (
                    <div key={i} style={metricRowStyle}>
                      <span style={{ fontSize: "0.85rem", color: "#aaa" }}>{m.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: statusColors[m.status] }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div>
                  <h4 style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Recommendations
                  </h4>
                  {data.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "0.8rem", color: "#bbb" }}>
                      <span style={{ color: "#4488ff" }}>→</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* === HISTORY TAB === */}
            {activeTab === "history" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Test History
                </h4>
                {data.history && data.history.length > 0 ? (
                  data.history.map((entry, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        paddingLeft: "16px",
                        paddingBottom: "14px",
                        marginBottom: "2px",
                        borderLeft: i < data.history.length - 1 ? "1px solid rgba(68,136,255,0.2)" : "1px solid transparent",
                      }}
                    >
                      {/* Timeline dot */}
                      <div style={{
                        position: "absolute",
                        left: "-4px",
                        top: "2px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: statusColors[entry.status],
                        boxShadow: `0 0 6px ${statusColors[entry.status]}`,
                      }} />
                      <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: "3px", fontFamily: "monospace" }}>
                        {entry.date}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#ddd", fontWeight: 600, marginBottom: "2px" }}>
                        {entry.test}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: statusColors[entry.status] }}>
                        {entry.result}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#555", fontSize: "0.85rem" }}>No test history available.</div>
                )}
              </motion.div>
            )}

            {/* === UPDATES TAB === */}
            {activeTab === "updates" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h4 style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Latest Updates
                </h4>
                {data.updates && data.updates.length > 0 ? (
                  data.updates.map((upd, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 12px",
                        marginBottom: "8px",
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${trendColors[upd.trend]}22`,
                        borderLeft: `3px solid ${trendColors[upd.trend]}`,
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.65rem", color: "#555", fontFamily: "monospace" }}>
                          {upd.date}
                        </span>
                        <span style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: trendColors[upd.trend],
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          textTransform: "uppercase",
                        }}>
                          {trendIcons[upd.trend]} {upd.trend}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#ccc", lineHeight: 1.4 }}>
                        {upd.change}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#555", fontSize: "0.85rem" }}>No updates available.</div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
