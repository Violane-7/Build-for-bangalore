import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { VitalsProvider } from "./context/VitalsContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VitalsProvider>
          <App />
        </VitalsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
