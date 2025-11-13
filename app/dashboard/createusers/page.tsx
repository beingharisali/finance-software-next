
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import "../../cssfiles/register.css";

interface CreateUserProps {
  role: "manager" | "agent" | "broker"; 
  onClose: () => void;
}

export default function CreateUser({ role, onClose }: CreateUserProps) {
  const { user, registerUser } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Determine which roles current user can create
  const allowedRolesToCreate = () => {
    if (!user) return [];
    switch (user.role) {
      case "admin":
        return ["manager", "agent", "broker"];
      case "manager":
        return ["agent", "broker"];
      default:
        return [];
    }
  };

  // Access control: only Admin or Manager can open modal
  useEffect(() => {
    if (!user || !["admin", "manager"].includes(user.role)) {
      alert("Access denied! Only Admin or Manager can create users.");
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allowedRoles = allowedRolesToCreate();


    if (!allowedRoles.includes(role)) {
      alert(`${user?.role} cannot create a ${role}`);
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData.fullname, formData.email, formData.password, role, false);
      alert(`${role} created successfully!`);
      setFormData({ fullname: "", email: "", password: "" });
      onClose();
      console.log("testing");
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="register-title">Create New {role}</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="register-input"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="register-input"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="register-input"
          />
          <div className="button-row">
            <button type="submit" disabled={loading} className="register-btn">
              {loading ? "Creating..." : `Create ${role}`}
            </button>
            <button type="button" onClick={onClose} className="close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
