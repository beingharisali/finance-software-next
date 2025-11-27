
"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { Chart, registerables } from "chart.js";
import Link from "next/link";
import http from "@/services/http";

import CreateUser from "../createusers/page";
import UploadCSV from "../admin/uploadcsv/page";

import "../../cssfiles/admin.css";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/uploadCSV.css";
import Sidebar from "@/app/dashboard/components/Sidebar"; 
Chart.register(...registerables);

interface TransactionType {
  transactionDate: string;
  transactionDescription: string;
  transactionType: string;
  amount: number;
  sortCode?: string;
  accountNumber?: string;
  balance?: number;
}

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [graphFilter, setGraphFilter] = useState<"thisYear" | "lastYear" | "month" | "week">("thisYear");
  const { user, logoutUser } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");

  const handleOpenModal = (role: "agent" | "manager" | "broker") => {
    setSelectedRole(role);
    setShowModal(true);
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await http.get("/transactions");
      const data: TransactionType[] = res.data.transactions || [];
      data.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    }
  };

  // Calculate totals
  const calculateCategoryTotals = () => {
    const totals: Record<string, number> = {};
    transactions.forEach(txn => {
      const val = Math.abs(txn.amount);
      const cat = txn.transactionType?.trim() || "Uncategorized";
      totals[cat] = (totals[cat] || 0) + val;
    });
    setCategoryTotals(totals);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (transactions.length) calculateCategoryTotals();
  }, [transactions]);

  // Chart rendering
  useEffect(() => {
    let cashflowChart: Chart | null = null;

    const filteredTransactions = transactions.filter(txn => {
      const txnDate = new Date(txn.transactionDate);
      const currentYear = new Date().getFullYear();
      switch (graphFilter) {
        case "thisYear": return txnDate.getFullYear() === currentYear;
        case "lastYear": return txnDate.getFullYear() === currentYear - 1;
        case "month": return txnDate.getFullYear() === currentYear;
        case "week": return txnDate.getFullYear() === currentYear;
        default: return true;
      }
    });

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const incomePerMonth = Array(12).fill(0);
    const expensePerMonth = Array(12).fill(0);
    const incomePerWeek = Array(52).fill(0);
    const expensePerWeek = Array(52).fill(0);

    filteredTransactions.forEach(txn => {
      const txnDate = new Date(txn.transactionDate);
      const monthIdx = txnDate.getMonth();
      const weekIdx = Math.floor((txnDate.getTime() - new Date(txnDate.getFullYear(),0,1).getTime())/(7*24*60*60*1000));
      if (txn.amount >= 0) {
        incomePerMonth[monthIdx] += txn.amount;
        incomePerWeek[weekIdx] += txn.amount;
      } else {
        expensePerMonth[monthIdx] += Math.abs(txn.amount);
        expensePerWeek[weekIdx] += Math.abs(txn.amount);
      }
    });

    const cashflowCtx = document.getElementById("cashflowChart") as HTMLCanvasElement;
    if (cashflowCtx) {
      const labels = graphFilter === "week" ? Array.from({length: 52}, (_, i) => `W${i+1}`) :
                     graphFilter === "month" ? months : months;
      const incomeData = graphFilter === "week" ? incomePerWeek : incomePerMonth;
      const expenseData = graphFilter === "week" ? expensePerWeek : expensePerMonth;

      cashflowChart = new Chart(cashflowCtx.getContext("2d")!, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Income", data: incomeData, backgroundColor: '#146985', stack: 'stack1', borderRadius: 8, barPercentage: 0.7 },
            { label: "Expense", data: expenseData, backgroundColor: '#ff4d4f', stack: 'stack1', borderRadius: 8, barPercentage: 0.7 }
          ]
        },
        options: {
          responsive: true,
          scales: { y: { stacked: true, beginAtZero: true, ticks: { callback: (v) => Number(v).toLocaleString() } }, x: { stacked: true } }
        }
      });
    }

    return () => { cashflowChart?.destroy(); };
  }, [transactions, graphFilter]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="dashboard-container">
          <Sidebar activePage="Dashboard" />


        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Dashboard</h1>
            <div className="top-right">
              <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
              <button className="logout-btn" onClick={logoutUser}>Logout</button>
            </div>
          </div>

          {/* CSV Upload */}
          <div className="upload-csv-section">
            <UploadCSV onUploadSuccess={fetchTransactions} />
          </div>

      

          {showModal && selectedRole && (
            <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
          )}

          {/* Cards Section */}
          <section className="cards">
            {Object.entries(categoryTotals).map(([cat, total], idx) => (
              <div className="card" key={idx}>
                <div className="card-title">{cat}</div>
                <div className="card-value">{total.toLocaleString()}</div>
              </div>
            ))}
          </section>

          {/* Charts Section */}
          <section className="charts">
            <div className="chart-card">
              <div className="chart-header">
                <h2>Cashflow</h2>
                <select title="graph" value={graphFilter} onChange={(e) => setGraphFilter(e.target.value as any)}>
                  <option value="thisYear">This Year</option>
                  <option value="lastYear">Last Year</option>
                  <option value="month">Month-wise</option>
                  <option value="week">Week-wise</option>
                </select>
              </div>
              <canvas id="cashflowChart"></canvas>
            </div>
          </section>

          {/* Recent Transactions */}
          <section className="transactions">
            <h2>Recent Transactions</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Description</th><th>Amount</th><th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((txn, idx) => (
                  <tr key={idx}>
                    <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
                    <td>{txn.transactionDescription}</td>
                    <td className={txn.amount >= 0 ? "positive" : "negative"}>{Math.abs(txn.amount).toLocaleString()}</td>
                    <td>{txn.transactionType || "Uncategorized"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
