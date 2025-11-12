"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Chart, registerables } from "chart.js";
import Link from "next/link";
import "../../cssfiles/admin.css";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/agent.css"; // reuse agent.css for table styling
import http from "@/services/http";

interface Sale {
  _id: string;
  productType: string;
  productId: string;
  productDescription: string;
  price: number;
  broker: string;
  commission: number;
  agent: string;
  createdAt: string;
  updatedAt: string;
}

Chart.register(...registerables);

export default function BrokerDashboard() {
  const { user, logoutUser } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch broker-specific sales
  const fetchSales = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await http.get(`/sales?broker=${user.email}`);
      if (res.data.success) setSales(res.data.sales);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();

    // Charts setup
    let teamPerfChartInstance: Chart | null = null;
    let deptChartInstance: Chart | null = null;

    const teamPerfCtx = document.getElementById("teamPerfChart") as HTMLCanvasElement;
    if (teamPerfCtx) {
      teamPerfChartInstance = new Chart(teamPerfCtx.getContext("2d")!, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun"],
          datasets: [
            {
              label: "Completed Tasks",
              data: [20,35,50,40,60,55],
              borderColor: "#146985",
              backgroundColor: "rgba(20,104,133,0.2)",
              tension: 0.3,
            },
            {
              label: "Pending Tasks",
              data: [3,7,5,8,4,6],
              borderColor: "#d9534f",
              backgroundColor: "rgba(217,83,79,0.2)",
              tension: 0.3,
            }
          ]
        },
        options: { responsive: true, plugins: { legend: { position: "top" } }, scales: { y: { beginAtZero: true } } }
      });
    }

    const deptCtx = document.getElementById("deptChart") as HTMLCanvasElement;
    if (deptCtx) {
      deptChartInstance = new Chart(deptCtx.getContext("2d")!, {
        type: "doughnut",
        data: {
          labels: ["Finance","HR","Operations","Sales","IT"],
          datasets: [{ data: [40,15,20,15,10], backgroundColor: ["#146985","#3b979a","#6db7bc","#9abec3","#c2d7dc"] }]
        },
        options: { cutout: "70%", responsive: true, plugins: { legend: { position: "right" } } }
      });
    }

    return () => {
      teamPerfChartInstance?.destroy();
      deptChartInstance?.destroy();
    };
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/broker/dashboard" className="nav-item active">Dashboard</Link>
          <Link href="/broker/sales" className="nav-item">My Sales</Link>
          <Link href="/broker/transactions" className="nav-item">Transactions</Link>
          <Link href="/broker/payments" className="nav-item">Payment</Link>
          <Link href="/broker/card" className="nav-item">Card</Link>
          <Link href="/broker/insight" className="nav-item">Insights</Link>
          <Link href="/broker/settings" className="nav-item">Settings</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Broker Dashboard</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="cards">
          <div className="card">
            <div className="card-title">My Sales</div>
            <div className="card-value">{sales.length}</div>
            <div className="card-sub">Total</div>
          </div>
          <div className="card">
            <div className="card-title">Completed</div>
            <div className="card-value">{sales.filter(s => s.price > 0).length}</div>
            <div className="card-change positive">+10%</div>
          </div>
          <div className="card">
            <div className="card-title">Pending</div>
            <div className="card-value">{sales.filter(s => s.price === 0).length}</div>
            <div className="card-change negative">-2%</div>
          </div>
          <div className="card">
            <div className="card-title">Commission</div>
            <div className="card-value">${sales.reduce((a,b) => a + b.commission,0)}</div>
            <div className="card-change positive">+5%</div>
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

        {/* Broker's Sales Table */}
        <section className="transactions">
          <h2>My Sales</h2>
          {sales.length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            <table className="record-table">
              <thead>
                <tr>
                  <th>Product Type</th>
                  <th>Product ID</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Commission</th>
                  <th>Agent</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale._id}>
                    <td>{sale.productType}</td>
                    <td>{sale.productId}</td>
                    <td>{sale.productDescription}</td>
                    <td>{sale.price}</td>
                    <td>{sale.commission}</td>
                    <td>{sale.agent}</td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
