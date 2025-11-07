
"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import "../cssfiles/login.css"; 

export default function LoginPage() {
  const { loginUser } = useAuthContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(formData.email, formData.password);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.msg || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label htmlFor="email" className="login-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="login-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="login-input"
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <a href="/register" className="login-link">Register here</a>
        </p>
      </div>
    </div>
  );
}
