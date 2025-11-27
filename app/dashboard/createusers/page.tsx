
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import http from "@/services/http";
import "../../cssfiles/register.css";

interface CreateUserProps {
  role?: "manager" | "agent" | "broker";
  onClose: () => void;
  editUser?: {
    id: string;
    fullname: string;
    email: string;
    role: string;
    phone?: string;
  };
}

export default function CreateUser({ role, onClose, editUser }: CreateUserProps) {
  const { user, registerUser, refreshProfile } = useAuthContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullname: editUser?.fullname || "",
    email: editUser?.email || "",
    password: "",
    role: editUser?.role || role || "agent",
    phone: editUser?.phone || "",
  });

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!user || !["admin", "manager"].includes(user.role)) {
      alert("Access denied!");
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allowedRoles = allowedRolesToCreate();
    if (!allowedRoles.includes(formData.role)) {
      alert(`${user?.role} cannot create/edit a ${formData.role}`);
      return;
    }

    try {
      setLoading(true);
      if (editUser) {
        await http.put(`/users/${editUser.id}`, formData);
        alert("User updated successfully!");
      } else {
        await registerUser(formData.fullname, formData.email, formData.password, formData.role, false);
        alert("User created successfully!");
      }
      setFormData({ fullname: "", email: "", password: "", role: role || "agent", phone: "" });
      onClose();
      refreshProfile();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editUser) return;
    if (!confirm(`Are you sure you want to delete ${editUser.fullname}?`)) return;

    try {
      setLoading(true);
      await http.delete(`/users/${editUser.id}`);
      alert("User deleted successfully!");
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.msg || "Failed to delete user!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="register-title">{editUser ? `Edit User: ${editUser.fullname}` : `Create New ${formData.role}`}</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Full Name" required className="register-input" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="register-input" />
          {!editUser && <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="register-input" />}
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone (optional)" className="register-input" />
          <select title="register-input" name="role" value={formData.role} onChange={handleChange} className="register-input">
            {allowedRolesToCreate().map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <div className="button-row">
            <button type="submit" disabled={loading} className="register-btn">{loading ? (editUser ? "Updating..." : "Creating...") : editUser ? "Update" : `Create ${formData.role}`}</button>
            <button type="button" onClick={onClose} className="close-btn">Cancel</button>
            {editUser && user.role === "admin" && <button type="button" onClick={handleDelete} disabled={loading} className="delete-btn">Delete</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
