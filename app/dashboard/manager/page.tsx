
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

import { Chart, registerables } from "chart.js";
import "../../cssfiles/admin.css"; 
import Link from "next/link";
import "../../cssfiles/sidebarcomponents.css"

Chart.register(...registerables);

export default function ManagerDashboard() {
    const { user, logoutUser } = useAuthContext();

useEffect(() => {
  let teamPerfChartInstance: Chart | null = null;
  let deptChartInstance: Chart | null = null;

  // Team Performance Chart
  const teamPerfCtx = document.getElementById("teamPerfChart") as HTMLCanvasElement;
  if (teamPerfCtx) {
    teamPerfChartInstance = new Chart(teamPerfCtx.getContext("2d")!, {
      type: "line",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun"],
        datasets: [
          {
            label: "Completed Tasks",
            data: [30,45,60,50,70,65],
            borderColor: "#146985",
            backgroundColor: "rgba(20,104,133,0.2)",
            tension: 0.3,
          },
          {
            label: "Pending Tasks",
            data: [5,10,8,12,6,7],
            borderColor: "#d9534f",
            backgroundColor: "rgba(217,83,79,0.2)",
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Department Allocation Doughnut
  const deptCtx = document.getElementById("deptChart") as HTMLCanvasElement;
  if (deptCtx) {
    deptChartInstance = new Chart(deptCtx.getContext("2d")!, {
      type: "doughnut",
      data: {
        labels: ["Finance","HR","Operations","Sales","IT"],
        datasets: [{
          data: [40,15,20,15,10],
          backgroundColor: ["#146985","#3b979a","#6db7bc","#9abec3","#c2d7dc"]
        }]
      },
      options: { cutout: "70%", responsive: true, plugins: { legend: { position: "right" } } }
    });
  }

  return () => {
    teamPerfChartInstance?.destroy();
    deptChartInstance?.destroy();
  };
}, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/dashboard/manager" className="nav-item active">Dashboard</Link>
          <Link href="/dashboard/manager/team" className="nav-item">Team</Link>
          <Link href="/dashboard/sidebarcomponents/transactions" className="nav-item">Transactions</Link>
          <Link href="/dashboard/manager/reports" className="nav-item">Reports</Link>
          <Link href="/dashboard/sidebarcomponents/settings" className="nav-item">Settings</Link>
        </div>
         
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-top">
  <h1 className="header">Dashboard</h1>
  <div className="top-right">
    <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
    <button className="logout-btn" onClick={logoutUser}>Logout</button>
  </div>
</div>

        {/* Summary Cards */}
        <section className="cards">
          <div className="card">
            <div className="card-title">Team Members</div>
            <div className="card-value">12</div>
            <div className="card-sub">Active</div>
          </div>
          <div className="card">
            <div className="card-title">Tasks Completed</div>
            <div className="card-value">560</div>
            <div className="card-change positive">+12%</div>
          </div>
          <div className="card">
            <div className="card-title">Pending Tasks</div>
            <div className="card-value">45</div>
            <div className="card-change negative">-5%</div>
          </div>
          <div className="card">
            <div className="card-title">Team Performance</div>
            <div className="card-value">95%</div>
            <div className="card-change positive">+8%</div>
          </div>
        </section>

        {/* Charts */}
        <section className="charts">
          <div className="chart-card">
            <h2>Team Performance</h2>
            <canvas id="teamPerfChart"></canvas>
          </div>

          <div className="chart-card">
            <h2>Department Allocation</h2>
            <canvas id="deptChart"></canvas>
          </div>
        </section>

        {/* Recent Team Transactions */}
        <section className="transactions">
          <h2>Recent Team Transactions</h2>
          <table>
            <thead>
              <tr><th>Date</th><th>Member</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>Nov 1</td><td>John D</td><td className="positive">$1,200</td><td>Completed</td></tr>
              <tr><td>Nov 2</td><td>Jane S</td><td className="negative">-$300</td><td>Pending</td></tr>
              <tr><td>Nov 4</td><td>Mike P</td><td className="positive">$2,500</td><td>Completed</td></tr>
            </tbody>
          </table>
        </section>

        {/* Pending Approvals */}
        <section className="activity">
          <h2>Pending Approvals</h2>
          <div className="activity-grid">
            <div className="activity-card">
              <div>Expense Approvals</div>
              <div className="activity-value">3</div>
            </div>
            <div className="activity-card">
              <div>Leave Requests</div>
              <div className="activity-value">2</div>
            </div>
            <div className="activity-card">
              <div>New Tasks</div>
              <div className="activity-value">5</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
