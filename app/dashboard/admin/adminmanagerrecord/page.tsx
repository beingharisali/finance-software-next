
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import Link from "next/link";
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
          const users = await fetchUsers("manager");
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
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/dashboard/admin" className="nav-item">Dashboard</Link>
           <Link href="/dashboard/admin/usermanagement" className="nav-item">User Management</Link>
         
          <Link href="/dashboard/admin/adminmanagerrecord" className="nav-item active">Manager Record</Link>
          <Link href="/dashboard/admin/adminagentrecord" className="nav-item"> Agent Record</Link>
          <Link href="/dashboard/admin/adminbrokerrecord" className="nav-item" >Broker Record </Link>
          <Link href="/dashboard/sidebarcomponent/transaction" className="nav-item"> Transaction </Link>
          <Link href="/dashboard/sidebarcomponent/payment" className="nav-item">    Payment    </Link>
          <Link href="/dashboard/sidebarcomponent/card" className="nav-item">Card</Link>
          <Link href="/dashboard/sidebarcomponent/insight" className="nav-item">Insights</Link>
          <Link href="/dashboard/sidebarcomponent/settings" className="nav-item">  Settings</Link>
        </div>
      </nav>

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
                  <tr key={manager.id}>
                    <td>{manager.fullname}</td>
                    <td>{manager.email}</td>
                    <td>{manager.role}</td>
                    <td>
                      {new Date(manager.createdAt || "").toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
