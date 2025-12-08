

"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import Sidebar from "@/app/dashboard/components/Sidebar";
import ProtectedRoute from "@/utilies/ProtectedRoute"; // Protected wrapper
import "../../cssfiles/record.css";
import "../../cssfiles/sidebarcomponents.css";

export default function ManagerBrokerRecord() {
  const { user, logoutUser } = useAuthContext();
  const [brokers, setBrokers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        if (user) {
          const users = await fetchUsers("broker"); // Admin ke data ka structure use
          setBrokers(users);
        }
      } catch (error) {
        console.error("Error fetching brokers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBrokers();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={[ "admin","manager", "assistant"]}>
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar activePage="Broker Record" />

        {/* Main Content */}
        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Broker Records</h1>
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
            ) : brokers.length === 0 ? (
              <p className="no-records">No brokers found.</p>
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
                  {brokers.map((broker) => (
                    <tr key={broker.id}>
                      <td>{broker.fullname}</td>
                      <td>{broker.email}</td>
                      <td>{broker.role}</td>
                      <td>
                        {broker.createdAt
                          ? new Date(broker.createdAt).toLocaleDateString()
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
