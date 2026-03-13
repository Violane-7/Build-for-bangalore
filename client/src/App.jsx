import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GlassBody from "./pages/GlassBody";
import Exposome from "./pages/Exposome";
import Appointments from "./pages/Appointments";
import Grocery from "./pages/Grocery";
import GoalPlanner from "./pages/GoalPlanner";
import Wearable from "./pages/Wearable";
import Emergency from "./pages/Emergency";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/glass-body" element={<PrivateRoute><GlassBody /></PrivateRoute>} />
      <Route path="/exposome" element={<PrivateRoute><Exposome /></PrivateRoute>} />
      <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
      <Route path="/grocery" element={<Grocery />} />
      <Route path="/goals" element={<PrivateRoute><GoalPlanner /></PrivateRoute>} />
      <Route path="/wearable" element={<PrivateRoute><Wearable /></PrivateRoute>} />
      <Route path="/emergency" element={<PrivateRoute><Emergency /></PrivateRoute>} />
    </Routes>
  );
}
