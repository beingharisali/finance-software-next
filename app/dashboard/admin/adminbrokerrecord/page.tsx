
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import Link from "next/link";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";

export default function ManagerBrokerRecord() {
  const { user, logoutUser } = useAuthContext();
  const [brokers, setBrokers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        if (user) {
          const users = await fetchUsers("broker");
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
    <div className="dashboard-container">
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/dashboard/admin" className="nav-item"> Dashboard</Link>
          <Link href="/dashboard/admin/adminmanagerrecord" className="nav-item">Manager Record</Link>
          <Link  href="/dashboard/admin/adminagentrecord"  className="nav-item">Agent Record </Link>
          <Link href="/dashboard/admin/adminbrokerrecord" className="nav-item active">Broker Record</Link>
          <Link href="/dashboard/sidebarcomponent/transaction" className="nav-item">Transaction</Link>
          <Link href="/dashboard/sidebarcomponent/payment" className="nav-item">Payment</Link>
          <Link href="/dashboard/sidebarcomponent/card" className="nav-item"> Card</Link>
          <Link href="/dashboard/sidebarcomponent/insight" className="nav-item">Insights</Link>
          <Link href="/dashboard/sidebarcomponent/settings" className="nav-item">Settings</Link>
        </div>
      </nav>

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
                      {new Date(broker.createdAt || "").toLocaleDateString()}
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
