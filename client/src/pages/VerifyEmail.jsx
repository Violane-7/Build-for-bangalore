import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        setMessage("Verification token not found. Please check your email link.");
        return;
      }

      try {
        const response = await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to dashboard...");

        // Store token and redirect to dashboard
        localStorage.setItem("token", response.data.token);
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>Email Verification</h1>

        {status === "verifying" && (
          <div style={styles.verifying}>
            <div style={styles.spinner}></div>
            <p>{message}</p>
          </div>
        )}

        {status === "success" && (
          <div style={styles.success}>
            <div style={styles.checkmark}>✓</div>
            <p>{message}</p>
          </div>
        )}

        {status === "error" && (
          <div style={styles.error}>
            <div style={styles.errorIcon}>✕</div>
            <p>{message}</p>
            <button
              style={styles.button}
              onClick={() => navigate("/register")}
            >
              Back to Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  box: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
  },
  verifying: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #4CAF50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  success: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    color: "#4CAF50",
  },
  checkmark: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    color: "#f44336",
  },
  errorIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#f44336",
    color: "white",
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};
