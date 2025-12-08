"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import Sidebar from "@/app/dashboard/components/Sidebar";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";

export default function ManagerRecord() {
  const { user, logoutUser } = useAuthContext();
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        if (user) {
          const users = await fetchUsers("manager"); // Fetch managers
          setManagers(users);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadManagers();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar activePage="Manager Record" />

        {/* Main Content */}
        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Manager Records</h1>
            <div className="top-right">
              <span className="profile-name">
                {user?.fullname || user?.email || "Guest"}
              </span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>

          <div className="record-section">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : managers.length === 0 ? (
              <p className="no-records">No managers found.</p>
            ) : (
              <table className="record-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager._id}>
                      <td>{manager.fullname}</td>
                      <td>{manager.email}</td>
                      <td>{manager.role}</td>
                      <td>
                        {manager.createdAt
                          ? new Date(manager.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
