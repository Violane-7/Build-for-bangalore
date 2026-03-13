import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HealthCharts from "../components/Dashboard/HealthCharts";

// ─── Mock health data (replace with real API calls) ───────────────────────────
const STATS = [
  { label: "Heart Rate", value: 72, unit: "bpm", icon: "❤️", color: "#ef4444", bg: "rgba(239,68,68,0.12)", trend: "+2", trendUp: true },
  { label: "Daily Steps", value: 8420, unit: "steps", icon: "👟", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", trend: "+340", trendUp: true },
  { label: "Sleep", value: 7.2, unit: "hrs", icon: "🌙", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", trend: "-0.3", trendUp: false },
  { label: "Calories", value: 1840, unit: "kcal", icon: "🔥", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", trend: "+120", trendUp: true },
];

const FEATURE_CARDS = [
  { to: "/glass-body", label: "Digital Twin", desc: "Explore your 3D body model", icon: "🫀", color: "#06b6d4", glow: "rgba(6,182,212,0.25)" },
  { to: "/exposome", label: "Exposome Radar", desc: "Track environmental risks", icon: "🌍", color: "#10b981", glow: "rgba(16,185,129,0.25)" },
  { to: "/appointments", label: "Appointments", desc: "Book & manage doctor visits", icon: "🏥", color: "#6366f1", glow: "rgba(99,102,241,0.25)" },
  { to: "/grocery", label: "Grocery Scanner", desc: "Scan food for nutrition info", icon: "🥗", color: "#f59e0b", glow: "rgba(245,158,11,0.25)" },
  { to: "/goals", label: "Goal Planner", desc: "Set & track health goals", icon: "🎯", color: "#ec4899", glow: "rgba(236,72,153,0.25)" },
  { to: "/wearable", label: "Wearable Panel", desc: "Sync device health data", icon: "⌚", color: "#8b5cf6", glow: "rgba(139,92,246,0.25)" },
  { to: "/emergency", label: "Emergency SOS", desc: "One-tap emergency alert", icon: "🚨", color: "#ef4444", glow: "rgba(239,68,68,0.25)" },
];

const HEALTH_ALERTS = [
  { type: "warning", msg: "Hydration below target — drink 2 more glasses today", icon: "💧" },
  { type: "success", msg: "Step goal 84% complete — keep going!", icon: "✅" },
  { type: "info", msg: "Appointment with Dr. Priya scheduled for tomorrow", icon: "📅" },
];

const SCORE_COLOR = (s) => (s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444");

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (start === end) return;
    const dur = 1200;
    const step = Math.ceil(dur / (end - start));
    const timer = setInterval(() => {
      start += Math.ceil(end / 60);
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{typeof value === "number" && value % 1 !== 0 ? display.toFixed(1) : display.toLocaleString()}</span>;
}

// ─── Radial health score ring ─────────────────────────────────────────────────
function HealthScoreRing({ score }) {
  const r = 54; const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = SCORE_COLOR(score);
  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#2a2a2a" strokeWidth="10" />
        <motion.circle
          cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeLinecap="round"
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - fill }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "1.8rem", fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: "0.65rem", color: "#888", letterSpacing: "0.05em", textTransform: "uppercase" }}>Health Score</span>
      </div>
    </div>
  );
}

// ─── Current time ─────────────────────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e0e0e0", fontVariantNumeric: "tabular-nums" }}>
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
      <div style={{ fontSize: "0.8rem", color: "#888" }}>
        {days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()} {now.getFullYear()}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const healthScore = 76;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e0e0e0", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #0f0f1e 0%, #1a1040 50%, #0f1a2e 100%)",
          borderBottom: "1px solid #1e2040",
          padding: "2rem 2.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          {/* Left — greeting */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", fontWeight: 800, color: "#fff",
              boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>{greeting()},</p>
              <h1 style={{ margin: "0.15rem 0 0", fontSize: "1.6rem", fontWeight: 800, background: "linear-gradient(90deg,#a5b4fc,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {user?.name || "User"} 👋
              </h1>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#666" }}>
                {user?.gender ? `${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)} • ` : ""}Let's check on your health today
              </p>
            </div>
          </div>

          {/* Center — health score ring */}
          <HealthScoreRing score={healthScore} />

          {/* Right — clock + logout */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
            <LiveClock />
            <button
              onClick={logout}
              style={{
                background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)",
                color: "#f87171", padding: "0.35rem 0.9rem", borderRadius: "8px",
                cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "0.25rem", padding: "1rem 2.5rem 0", borderBottom: "1px solid #1a1a2a", background: "#0a0a0f" }}>
        {["overview", "analytics", "features"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.55rem 1.25rem", border: "none", borderRadius: "8px 8px 0 0",
              cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
              textTransform: "capitalize", transition: "all 0.2s",
              background: activeTab === tab ? "#1a1a2e" : "transparent",
              color: activeTab === tab ? "#a5b4fc" : "#666",
              borderBottom: activeTab === tab ? "2px solid #6366f1" : "2px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Page Body ── */}
      <div style={{ padding: "2rem 2.5rem" }}>
        <AnimatePresence mode="wait">

          {/* ══ OVERVIEW TAB ══ */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.color}33`,
                      borderRadius: "16px",
                      padding: "1.25rem 1.5rem",
                      position: "relative",
                      overflow: "hidden",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                        <p style={{ margin: "0.4rem 0 0", fontSize: "1.9rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                          <AnimatedNumber value={s.value} /> <span style={{ fontSize: "0.85rem", color: "#aaa", fontWeight: 400 }}>{s.unit}</span>
                        </p>
                      </div>
                      <span style={{ fontSize: "2rem" }}>{s.icon}</span>
                    </div>
                    <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ fontSize: "0.7rem", color: s.trendUp ? "#4ade80" : "#f87171", background: s.trendUp ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", padding: "0.15rem 0.5rem", borderRadius: "99px" }}>
                        {s.trendUp ? "▲" : "▼"} {s.trend}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#555" }}>vs yesterday</span>
                    </div>
                    {/* Decorative circle */}
                    <div style={{ position: "absolute", right: -20, bottom: -20, width: 80, height: 80, borderRadius: "50%", background: s.color, opacity: 0.06 }} />
                  </motion.div>
                ))}
              </div>

              {/* Charts row */}
              <HealthCharts />

              {/* Alerts */}
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#ccc", margin: "0 0 1rem" }}>Health Alerts</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {HEALTH_ALERTS.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.85rem 1.1rem",
                        borderRadius: "10px",
                        background: a.type === "warning" ? "rgba(245,158,11,0.08)" : a.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(99,102,241,0.08)",
                        border: `1px solid ${a.type === "warning" ? "rgba(245,158,11,0.2)" : a.type === "success" ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)"}`,
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{a.icon}</span>
                      <span style={{ fontSize: "0.85rem", color: "#ccc" }}>{a.msg}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ ANALYTICS TAB ══ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <HealthCharts fullView />
            </motion.div>
          )}

          {/* ══ FEATURES TAB ══ */}
          {activeTab === "features" && (
            <motion.div key="features" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#888", margin: "0 0 1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>All Features</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.25rem" }}>
                {FEATURE_CARDS.map((card, i) => (
                  <motion.div
                    key={card.to}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.35 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                  >
                    <Link to={card.to} style={{ display: "block", textDecoration: "none" }}>
                      <div style={{
                        padding: "1.5rem",
                        borderRadius: "16px",
                        background: "#0f0f1e",
                        border: `1px solid ${card.color}33`,
                        boxShadow: `0 4px 24px ${card.glow}`,
                        transition: "border-color 0.2s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.75rem" }}>
                          <div style={{ fontSize: "2rem", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${card.color}18`, borderRadius: "12px" }}>
                            {card.icon}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: "#e0e0e0", fontSize: "0.95rem" }}>{card.label}</p>
                            <p style={{ margin: "0.15rem 0 0", fontSize: "0.75rem", color: "#666" }}>{card.desc}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: card.color, fontSize: "0.8rem", fontWeight: 600 }}>
                          Open <span style={{ fontSize: "0.75rem" }}>→</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Feature quick-strip (always visible on overview) ── */}
      {activeTab === "overview" && (
        <div style={{ padding: "0 2.5rem 2.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#888", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Access</h3>
          <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {FEATURE_CARDS.map((card) => (
              <Link key={card.to} to={card.to} style={{ textDecoration: "none", flexShrink: 0 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "10px",
                    background: `${card.color}12`,
                    border: `1px solid ${card.color}30`,
                    color: card.color, fontSize: "0.82rem", fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{card.icon}</span> {card.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
