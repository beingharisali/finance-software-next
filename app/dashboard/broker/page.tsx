
"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/components/Sidebar";
import SaleModal from "./saleform/saleforms";
import http from "@/services/http";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/agent.css";

export default function DashboardPage() {
  const { user, loading: userLoading, logoutUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [brokers, setBrokers] = useState([]);

  // Fetch brokers for admin
  useEffect(() => {
    const loadBrokers = async () => {
      if (user?.role !== "admin") return;
      try {
        const res = await http.get("/user/all?role=broker");
        setBrokers(res.data.users || []);
      } catch (err) {
        console.log("Failed to load brokers");
      }
    };
    loadBrokers();
  }, [user]);

  if (userLoading || !user) return <p>Loading user info...</p>;

  return (
    <div className="dashboard">
      <Sidebar
        activePage={
          user.role === "broker" ? "Dashboardagent" : "Dashboardadmin"
        }
      />

      <main className="main">
        <div className="main-top">
          <h1 className="header">Dashboard</h1>
          <div className="top-right">
            <span className="profile-name">
              {user.fullname || user.email}
            </span>
            <button className="logout-btn" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>

        <button className="add-sale-btn" onClick={() => setShowModal(true)}>
          Add Sale
        </button>

        {/* Sale Modal with PROPER props */}
        {showModal && (
          <SaleModal
            onClose={() => setShowModal(false)}
            refreshSales={() => {}}
            brokers={brokers} // REQUIRED FIX
          />
        )}
      </main>
    </div>
  );
}
