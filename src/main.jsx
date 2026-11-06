import React from "react";
import ReactDOM from "react-dom/client";
import App from "../Auto_Service_Hub_Frontend/src/App";
import { AuthProvider } from "../Auto_Service_Hub_Frontend/src/context/AuthContext";
import "../Auto_Service_Hub_Frontend/src/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);