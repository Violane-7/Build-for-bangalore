import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORGAN_DATA = {
  heart: {
    name: "Heart",
    icon: "❤️",
    metrics: [
      { label: "Resting Heart Rate", value: "72 bpm", status: "normal" },
      { label: "Blood Pressure", value: "118/76 mmHg", status: "normal" },
      { label: "Cardiovascular Risk", value: "Low", status: "normal" },
    ],
    recommendations: [
      "Maintain aerobic activity at 150 min/week",
      "Monitor iron levels — women are more prone to anemia",
      "Track heart rate variability during menstrual cycle",
    ],
    history: [
      { date: "2026-03-10", test: "ECG", result: "Normal sinus rhythm", status: "normal" },
      { date: "2026-02-20", test: "Lipid Panel", result: "LDL 118 mg/dL — optimal", status: "normal" },
      { date: "2026-01-12", test: "Blood Pressure Check", result: "118/76 mmHg — normal", status: "normal" },
      { date: "2025-12-05", test: "Iron Panel", result: "Ferritin 28 ng/mL — low-normal", status: "warning" },
    ],
    updates: [
      { date: "2026-03-12", change: "Heart rate consistently in optimal range — great cardiovascular fitness", trend: "stable" },
      { date: "2025-12-08", change: "Ferritin levels low-normal — iron supplementation suggested", trend: "worsened" },
    ],
  },
  lungs: {
    name: "Lungs",
    icon: "🫁",
    metrics: [
      { label: "SpO2", value: "98%", status: "normal" },
      { label: "Respiratory Rate", value: "15/min", status: "normal" },
      { label: "Lung Capacity", value: "Good", status: "normal" },
    ],
    recommendations: [
      "Continue regular breathing exercises",
      "Avoid prolonged exposure to pollutants",
    ],
    history: [
      { date: "2026-03-08", test: "Pulse Oximetry", result: "SpO2 98%, stable", status: "normal" },
      { date: "2026-02-10", test: "Spirometry", result: "FEV1/FVC ratio 0.84 — normal", status: "normal" },
      { date: "2026-01-18", test: "Chest X-Ray", result: "No abnormalities detected", status: "normal" },
    ],
    updates: [
      { date: "2026-03-10", change: "Respiratory health excellent — lung function stable", trend: "stable" },
      { date: "2026-02-12", change: "Spirometry results improved with regular yoga practice", trend: "improved" },
    ],
  },
  liver: {
    name: "Liver",
    icon: "🫘",
    metrics: [
      { label: "ALT Level", value: "22 U/L", status: "normal" },
      { label: "AST Level", value: "20 U/L", status: "normal" },
      { label: "Liver Health", value: "Good", status: "normal" },
    ],
    recommendations: [
      "Maintain balanced diet with leafy greens",
      "Limit alcohol to 1 drink/day max",
      "Stay hydrated for optimal liver detox",
    ],
    history: [
      { date: "2026-03-05", test: "Liver Function Panel", result: "ALT 22, AST 20 — normal", status: "normal" },
      { date: "2026-01-25", test: "Liver Function Panel", result: "ALT 24, AST 22 — normal", status: "normal" },
      { date: "2025-12-10", test: "Abdominal Ultrasound", result: "Normal liver echogenicity", status: "normal" },
    ],
    updates: [
      { date: "2026-03-06", change: "Liver enzymes consistently normal — excellent liver health", trend: "stable" },
    ],
  },
  kidneyL: {
    name: "Left Kidney",
    icon: "🫘",
    metrics: [
      { label: "Creatinine", value: "0.8 mg/dL", status: "normal" },
      { label: "GFR", value: "98 mL/min", status: "normal" },
      { label: "Kidney Function", value: "Excellent", status: "normal" },
    ],
    recommendations: ["Stay hydrated — aim for 2L water/day", "Reduce sodium intake"],
    history: [
      { date: "2026-03-01", test: "Renal Function Panel", result: "Creatinine 0.8, GFR 98", status: "normal" },
      { date: "2026-01-10", test: "Urinalysis", result: "No proteinuria, no hematuria", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "GFR excellent at 98 mL/min — kidneys functioning optimally", trend: "stable" },
    ],
  },
  kidneyR: {
    name: "Right Kidney",
    icon: "🫘",
    metrics: [
      { label: "Creatinine", value: "0.8 mg/dL", status: "normal" },
      { label: "GFR", value: "98 mL/min", status: "normal" },
      { label: "Kidney Function", value: "Excellent", status: "normal" },
    ],
    recommendations: ["Stay hydrated — aim for 2L water/day", "Reduce sodium intake"],
    history: [
      { date: "2026-03-01", test: "Renal Function Panel", result: "Creatinine 0.8, GFR 98", status: "normal" },
      { date: "2026-01-10", test: "Urinalysis", result: "Clear — no abnormalities", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "Kidney function stable and healthy", trend: "stable" },
    ],
  },
  stomach: {
    name: "Stomach",
    icon: "🫄",
    metrics: [
      { label: "Gut Health Score", value: "8.1/10", status: "normal" },
      { label: "Metabolic Rate", value: "1,540 kcal", status: "normal" },
      { label: "Glycemic Control", value: "Good", status: "normal" },
    ],
    recommendations: [
      "Increase fiber intake to 25g/day",
      "Add probiotic-rich foods like yogurt",
    ],
    history: [
      { date: "2026-03-07", test: "H. Pylori Breath Test", result: "Negative", status: "normal" },
      { date: "2026-02-08", test: "Blood Glucose (Fasting)", result: "86 mg/dL — optimal", status: "normal" },
    ],
    updates: [
      { date: "2026-03-08", change: "Gut health score improved with probiotic supplementation", trend: "improved" },
    ],
  },
  digestive: {
    name: "Digestive System",
    icon: "🫗",
    metrics: [
      { label: "Digestive Efficiency", value: "85%", status: "normal" },
      { label: "Nutrient Absorption", value: "Good", status: "normal" },
      { label: "GI Inflammation", value: "Low", status: "normal" },
      { label: "Bowel Regularity", value: "Normal", status: "normal" },
    ],
    recommendations: [
      "Eat slowly and chew food thoroughly",
      "Include fermented foods",
      "Stay hydrated — water aids digestion",
    ],
    history: [
      { date: "2026-03-06", test: "Stool Analysis", result: "Normal flora", status: "normal" },
      { date: "2026-02-18", test: "Celiac Panel", result: "Negative", status: "normal" },
    ],
    updates: [
      { date: "2026-03-07", change: "Digestive efficiency improved with dietary changes", trend: "improved" },
    ],
  },
  brain: {
    name: "Brain",
    icon: "🧠",
    metrics: [
      { label: "Sleep Quality", value: "7.5/10", status: "normal" },
      { label: "Stress Level", value: "Mild", status: "normal" },
      { label: "Cognitive Score", value: "90/100", status: "normal" },
    ],
    recommendations: [
      "Maintain 7-8 hours of sleep",
      "Track mood changes across menstrual cycle",
      "Practice mindfulness 10 min/day",
    ],
    history: [
      { date: "2026-03-09", test: "Cognitive Assessment", result: "Score 90/100 — excellent", status: "normal" },
      { date: "2026-02-18", test: "Sleep Study", result: "REM sleep 22% — optimal", status: "normal" },
      { date: "2026-01-12", test: "Cortisol Level", result: "14 mcg/dL — normal", status: "normal" },
    ],
    updates: [
      { date: "2026-03-11", change: "Sleep quality stable — consistent sleep schedule helping", trend: "stable" },
      { date: "2026-02-20", change: "REM sleep now in optimal range", trend: "improved" },
    ],
  },
  eyes: {
    name: "Eyes",
    icon: "👁️",
    metrics: [
      { label: "Vision Score", value: "Good", status: "normal" },
      { label: "Screen Time", value: "7.5 hrs/day", status: "warning" },
      { label: "Eye Strain", value: "Mild", status: "normal" },
    ],
    recommendations: [
      "Follow 20-20-20 rule",
      "Use blue light filter after 8 PM",
      "Ensure adequate Vitamin A intake",
    ],
    history: [
      { date: "2026-03-04", test: "Visual Acuity Test", result: "20/20 both eyes", status: "normal" },
      { date: "2026-02-12", test: "Intraocular Pressure", result: "13 mmHg — normal", status: "normal" },
      { date: "2026-01-08", test: "Dry Eye Assessment", result: "No dryness detected", status: "normal" },
    ],
    updates: [
      { date: "2026-03-05", change: "Vision stable — eye health good", trend: "stable" },
    ],
  },
  uterus: {
    name: "Uterus",
    icon: "🩺",
    metrics: [
      { label: "Menstrual Cycle", value: "Regular (28 days)", status: "normal" },
      { label: "Endometrial Thickness", value: "8mm — normal", status: "normal" },
      { label: "Uterine Health", value: "Good", status: "normal" },
      { label: "Pap Smear", value: "Normal", status: "normal" },
    ],
    recommendations: [
      "Schedule annual gynecological exam",
      "Track menstrual cycle for pattern changes",
      "Maintain adequate iron intake during menstruation",
      "Consider HPV vaccination if not completed",
    ],
    history: [
      { date: "2026-03-01", test: "Pelvic Ultrasound", result: "Normal uterine size, no fibroids", status: "normal" },
      { date: "2026-02-15", test: "Pap Smear", result: "Normal cytology — no abnormal cells", status: "normal" },
      { date: "2025-12-10", test: "HPV Test", result: "Negative", status: "normal" },
      { date: "2025-09-20", test: "Pelvic Exam", result: "Normal findings", status: "normal" },
      { date: "2025-06-15", test: "Menstrual Assessment", result: "Regular 28-day cycle, normal flow", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "Uterine health excellent — no abnormalities on ultrasound", trend: "stable" },
      { date: "2026-02-16", change: "Pap smear clear — next screening in 3 years", trend: "stable" },
      { date: "2025-12-12", change: "HPV test negative — no cervical cancer risk factors", trend: "stable" },
    ],
  },
  ovaryL: {
    name: "Left Ovary",
    icon: "🔬",
    metrics: [
      { label: "Follicle Count", value: "12 — normal", status: "normal" },
      { label: "Ovarian Volume", value: "6.2 mL", status: "normal" },
      { label: "AMH Level", value: "3.2 ng/mL", status: "normal" },
      { label: "Ovulation", value: "Regular", status: "normal" },
    ],
    recommendations: [
      "Monitor ovulation if planning pregnancy",
      "Maintain healthy BMI for hormonal balance",
      "Include omega-3 fatty acids for ovarian health",
    ],
    history: [
      { date: "2026-03-01", test: "Transvaginal Ultrasound", result: "Normal follicle development, no cysts", status: "normal" },
      { date: "2026-01-20", test: "AMH Blood Test", result: "3.2 ng/mL — good ovarian reserve", status: "normal" },
      { date: "2025-11-15", test: "Hormonal Panel", result: "FSH 6.5, LH 5.8 — normal", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "Ovarian health stable — normal follicular activity", trend: "stable" },
      { date: "2026-01-22", change: "AMH indicates good ovarian reserve for age", trend: "stable" },
    ],
  },
  ovaryR: {
    name: "Right Ovary",
    icon: "🔬",
    metrics: [
      { label: "Follicle Count", value: "10 — normal", status: "normal" },
      { label: "Ovarian Volume", value: "5.8 mL", status: "normal" },
      { label: "AMH Level", value: "3.2 ng/mL", status: "normal" },
      { label: "Ovulation", value: "Regular", status: "normal" },
    ],
    recommendations: [
      "Monitor ovulation if planning pregnancy",
      "Maintain healthy BMI for hormonal balance",
      "Regular pelvic ultrasound every 1-2 years",
    ],
    history: [
      { date: "2026-03-01", test: "Transvaginal Ultrasound", result: "Normal size, no cysts", status: "normal" },
      { date: "2026-01-20", test: "Hormonal Panel", result: "Estradiol 45 pg/mL — normal for follicular phase", status: "normal" },
    ],
    updates: [
      { date: "2026-03-02", change: "Right ovary healthy — functioning normally", trend: "stable" },
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
  border: "1px solid rgba(200, 100, 255, 0.3)",
  borderRadius: "16px",
  padding: "0",
  color: "#e0e0e0",
  zIndex: 50,
  boxShadow: "0 0 40px rgba(200, 100, 255, 0.15)",
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
  background: active ? "rgba(200, 100, 255, 0.15)" : "transparent",
  border: "none",
  borderBottom: active ? "2px solid #c864ff" : "2px solid transparent",
  color: active ? "#fff" : "#666",
  fontSize: "0.72rem",
  fontWeight: 600,
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  transition: "all 0.2s ease",
});

export default function FemaleOrganInfoPanel({ selectedOrgan, onClose, riskScores = {} }) {
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
              <button onClick={onClose} style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: "8px", padding: "4px 10px", cursor: "pointer", fontSize: "0.8rem" }}>
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
              <button style={TAB_STYLE(activeTab === "current")} onClick={() => setActiveTab("current")}>Current</button>
              <button style={TAB_STYLE(activeTab === "history")} onClick={() => setActiveTab("history")}>Test History</button>
              <button style={TAB_STYLE(activeTab === "updates")} onClick={() => setActiveTab("updates")}>Updates</button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 20px" }}>
            {activeTab === "current" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Health Metrics</h4>
                  {data.metrics.map((m, i) => (
                    <div key={i} style={metricRowStyle}>
                      <span style={{ fontSize: "0.85rem", color: "#aaa" }}>{m.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: statusColors[m.status] }}>{m.value}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 8px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Recommendations</h4>
                  {data.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "0.8rem", color: "#bbb" }}>
                      <span style={{ color: "#c864ff" }}>→</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <h4 style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Test History</h4>
                {data.history?.map((entry, i) => (
                  <div key={i} style={{ position: "relative", paddingLeft: "16px", paddingBottom: "14px", borderLeft: i < data.history.length - 1 ? "1px solid rgba(200,100,255,0.2)" : "1px solid transparent" }}>
                    <div style={{ position: "absolute", left: "-4px", top: "2px", width: "8px", height: "8px", borderRadius: "50%", background: statusColors[entry.status], boxShadow: `0 0 6px ${statusColors[entry.status]}` }} />
                    <div style={{ fontSize: "0.65rem", color: "#555", marginBottom: "3px", fontFamily: "monospace" }}>{entry.date}</div>
                    <div style={{ fontSize: "0.82rem", color: "#ddd", fontWeight: 600, marginBottom: "2px" }}>{entry.test}</div>
                    <div style={{ fontSize: "0.78rem", color: statusColors[entry.status] }}>{entry.result}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "updates" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <h4 style={{ margin: "0 0 12px", fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Latest Updates</h4>
                {data.updates?.map((upd, i) => (
                  <div key={i} style={{ padding: "10px 12px", marginBottom: "8px", background: "rgba(255,255,255,0.03)", border: `1px solid ${trendColors[upd.trend]}22`, borderLeft: `3px solid ${trendColors[upd.trend]}`, borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.65rem", color: "#555", fontFamily: "monospace" }}>{upd.date}</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: trendColors[upd.trend], textTransform: "uppercase" }}>{trendIcons[upd.trend]} {upd.trend}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#ccc", lineHeight: 1.4 }}>{upd.change}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
