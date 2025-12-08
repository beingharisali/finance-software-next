"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Chart, registerables } from "chart.js";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { useRouter } from "next/navigation";
import CreateUser from "../createusers/page";
import "../../cssfiles/admin.css";
import "../../cssfiles/sidebarcomponents.css";

Chart.register(...registerables);

export default function ManagerDashboard() {
  const { user, logoutUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "assistant" | "manager" | "broker" | ""
  >("");
  const router = useRouter();

  // Role-based protection
  useEffect(() => {
    if (!user) return;
    if (user.role !== "manager" && user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  const handleOpenModal = (role: "assistant" | "manager" | "broker") => {
    setSelectedRole(role);
    setShowModal(true);
  };

  useEffect(() => {
    let teamPerfChartInstance: Chart | null = null;
    let deptChartInstance: Chart | null = null;

    const teamPerfCtx = document.getElementById(
      "teamPerfChart"
    ) as HTMLCanvasElement;
    if (teamPerfCtx) {
      teamPerfChartInstance = new Chart(teamPerfCtx.getContext("2d")!, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Completed Tasks",
              data: [30, 45, 60, 50, 70, 65],
              borderColor: "#146985",
              backgroundColor: "rgba(20,104,133,0.2)",
              tension: 0.3,
            },
            {
              label: "Pending Tasks",
              data: [5, 10, 8, 12, 6, 7],
              borderColor: "#d9534f",
              backgroundColor: "rgba(217,83,79,0.2)",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    const deptCtx = document.getElementById("deptChart") as HTMLCanvasElement;
    if (deptCtx) {
      deptChartInstance = new Chart(deptCtx.getContext("2d")!, {
        type: "doughnut",
        data: {
          labels: ["Finance", "HR", "Operations", "Sales", "IT"],
          datasets: [
            {
              data: [40, 15, 20, 15, 10],
              backgroundColor: [
                "#146985",
                "#3b979a",
                "#6db7bc",
                "#9abec3",
                "#c2d7dc",
              ],
            },
          ],
        },
        options: {
          cutout: "70%",
          responsive: true,
          plugins: { legend: { position: "right" } },
        },
      });
    }

    return () => {
      teamPerfChartInstance?.destroy();
      deptChartInstance?.destroy();
    };
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar activePage="Dashboard" />

      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Dashboard</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>

        {showModal && selectedRole && (
          <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
        )}

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
      </main>
    </div>
  );
}
