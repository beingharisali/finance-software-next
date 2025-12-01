
"use client";

import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/components/Sidebar";

export default function CompanyCostPage() {
  const { user, logoutUser } = useAuthContext();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar activePage="Deals" />

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar */}
        <div className="main-top">
          <h1 className="header">Deals page</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email || "Guest"}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        {/* Main section */}
        <section className="content-section">
          <h2>Deals page</h2>
          <p>This is the Deals page content.</p>
        </section>
      </main>
    </div>
  );
}
