import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem 2rem",
  background: "#111",
  borderBottom: "1px solid #222",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const linkStyle = {
  color: "#ccc",
  textDecoration: "none",
  fontSize: "0.9rem",
  marginLeft: "1.5rem",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={navStyle}>
      <Link to="/dashboard" style={{ color: "#fff", fontWeight: "bold", textDecoration: "none" }}>
        PranexusAI
      </Link>
      {user && (
        <div>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/glass-body" style={linkStyle}>Body</Link>
          <Link to="/exposome" style={linkStyle}>Exposome</Link>
          <Link to="/appointments" style={linkStyle}>Appointments</Link>
          <Link to="/grocery" style={linkStyle}>Grocery</Link>
          <Link to="/goals" style={{ ...linkStyle, color: "#22c55e" }}>💰 EMI Goals</Link>
          <Link to="/wearable" style={linkStyle}>Wearable</Link>
          <Link to="/chat" style={linkStyle}>Chat</Link>
          <Link to="/emergency" style={{ ...linkStyle, color: "#ff6666" }}>SOS</Link>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "1.5rem", background: "none", border: "1px solid #444", color: "#aaa", padding: "0.3rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
