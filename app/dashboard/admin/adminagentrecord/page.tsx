
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import Sidebar from "@/app/dashboard/components/Sidebar";
import ProtectedRoute from "@/utilies/ProtectedRoute"; 
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";

export default function ManagerAgentRecord() {
  const { user, logoutUser } = useAuthContext();
  const [assistants, setAssistants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssistants = async () => {
      try {
        if (user) {
          // FETCH ONLY ASSISTANTS
          const users = await fetchUsers("assistant");
          setAssistants(users);
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAssistants();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar activePage="Assistant Record" />

        {/* Main Content */}
        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Assistant Records</h1>
            <div className="top-right">
              <span className="profile-name">
                {user?.fullname || user?.email || "Guest"}
              </span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>

          <div className="record-wrapper">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : assistants.length === 0 ? (
              <p className="no-records">No Assistant found.</p>
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
                  {assistants.map((asst) => (
                    <tr key={asst._id}>
                      <td>{asst.fullname}</td>
                      <td>{asst.email}</td>
                      <td>{asst.role}</td>
                      <td>
                        {asst.createdAt
                          ? new Date(asst.createdAt).toLocaleDateString()
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
