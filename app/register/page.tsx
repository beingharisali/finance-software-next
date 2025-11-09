
"use client";

import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "../cssfiles/register.css"; 

export default function RegisterPage() {
  const { registerUser } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "agent",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      await registerUser(
        formData.fullname,  
        formData.email,
        formData.password,
        formData.role as any
      );
      alert("Registered Successfully!");
      router.push("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Register</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          onChange={handleChange}
          className="register-input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="register-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="register-input"
          required
        />

        <select
          aria-label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="register-select"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="agent">Agent</option>
        </select>

        <button type="submit" className="register-btn">
          Register
        </button>

        <p className="register-footer">
          Already have an account?{" "}
          <a href="/login" className="register-link">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
