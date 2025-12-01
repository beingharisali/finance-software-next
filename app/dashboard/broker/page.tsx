
"use client";
import React, { useState } from "react";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/agent.css";
import { useAuthContext } from "@/context/AuthContext";
import SaleModal from "./saleform/saleforms";
import Sidebar from "@/app/dashboard/components/Sidebar";

export default function DashboardPage() {
  const { user, logoutUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar activePage={user?.role === "broker" ? "Dashboardagent" : "Dashboardadmin"} />

      <main className="main">
        <div className="main-top">
          <h1 className="header">Dashboard</h1>
          <div className="top-right">
            <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        <button className="add-sale-btn" onClick={() => setShowModal(true)}>Add Sale</button>

        {showModal && (
          <SaleModal onClose={() => setShowModal(false)} refreshSales={() => {}} />
        )}

        <section className="transactions">
          <h2>Sales</h2>
          <p>Sales created here will appear on the Sales page.</p>
        </section>
      </main>
    </div>
  );
}
