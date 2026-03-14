import { useState } from "react";
import Navbar from "../components/Shared/Navbar";
import GlassBodyViewer from "../components/GlassBody/GlassBodyViewer";
import GlassBodyViewerFemale from "../components/GlassBody/GlassBodyViewerFemale";

const toggleContainerStyle = {
  position: "absolute",
  top: "80px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 20,
  display: "flex",
  alignItems: "center",
  gap: "0",
  background: "rgba(10, 10, 20, 0.85)",
  backdropFilter: "blur(16px)",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "4px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

const toggleBtnStyle = (active, color) => ({
  padding: "8px 20px",
  border: "none",
  borderRadius: "8px",
  background: active ? `${color}20` : "transparent",
  color: active ? "#fff" : "#666",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.5px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  position: "relative",
  overflow: "hidden",
  ...(active && {
    boxShadow: `0 0 20px ${color}30`,
    border: `1px solid ${color}40`,
  }),
});

export default function GlassBody() {
  const [gender, setGender] = useState("male");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#060612" }}>
      <Navbar />
      <div style={{ flex: 1, position: "relative" }}>
        {gender === "male" ? <GlassBodyViewer /> : <GlassBodyViewerFemale />}

        {/* Gender Toggle */}
        <div style={toggleContainerStyle}>
          <button
            style={toggleBtnStyle(gender === "male", "#4488ff")}
            onClick={() => setGender("male")}
          >
            <span style={{ fontSize: "1rem" }}>♂</span>
            Male
          </button>
          <button
            style={toggleBtnStyle(gender === "female", "#c864ff")}
            onClick={() => setGender("female")}
          >
            <span style={{ fontSize: "1rem" }}>♀</span>
            Female
          </button>
        </div>
      </div>
    </div>
  );
}
