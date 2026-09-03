import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("Developer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple navigation based on role
    if (role === "Developer") {
      navigate("/developer/dashboard");
    } else if (role === "QA Engineer") {
      navigate("/qa/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>AI-POWERED PLATFORM</h2>
        <h1>SMART.<br/>GARAGE.<br/>AI.</h1>
        <p>
          Manage every aspect of your workshop — customers, jobs, inventory,
          billing and AI insights.
        </p>
      </div>

      <div className="login-right">
        <h2>SMARTGARAGE AI CRM</h2>
        <p>Select your role to continue.</p>

        <div className="role-select">
          <label>
            <input
              type="radio"
              value="Developer"
              checked={role === "Developer"}
              onChange={(e) => setRole(e.target.value)}
            />
            Developer
          </label>
          <label>
            <input
              type="radio"
              value="QA Engineer"
              checked={role === "QA Engineer"}
              onChange={(e) => setRole(e.target.value)}
            />
            QA Engineer
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-btn">
            ACCESS PLATFORM →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
