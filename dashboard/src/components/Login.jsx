import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(username, password);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>CartSync Dashboard</h1>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
          Admin Login
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#999",
          }}
        ></p>
      </div>
    </div>
  );
};

export default Login;
