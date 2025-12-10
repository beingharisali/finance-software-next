"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { Chart, registerables } from "chart.js";
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
}

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {}
  );
  const [graphFilter, setGraphFilter] = useState<
    "thisYear" | "lastYear" | "month" | "week" | "none"
  >("thisYear");

  const { user, logoutUser } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<
    "assistant" | "manager" | "broker" | ""
  >("");

  // Date filter state for chart only
  const [tempDateRange, setTempDateRange] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  const handleOpenModal = (role: "assistant" | "manager" | "broker") => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleTempDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const applyDateRange = () => {
    setDateRange({ ...tempDateRange });
    setGraphFilter("none"); // prioritize calendar range
  };

  const resetDateRange = () => {
    setDateRange({ from: "", to: "" });
    setTempDateRange({ from: "", to: "" });
    setGraphFilter("thisYear");
  };

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const res = await http.get("/transactions");
      const data: TransactionType[] = res.data.transactions || [];
      data.sort(
        (a, b) =>
          new Date(a.transactionDate).getTime() -
          new Date(b.transactionDate).getTime()
      );
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    }
  };

  // Calculate category totals for cards (ALL transactions, no filter)
  const calculateCategoryTotals = () => {
    const totals: Record<string, number> = {};
    transactions.forEach((txn) => {
      const cat = txn.transactionType?.trim() || "Uncategorized";
      totals[cat] = (totals[cat] || 0) + Math.abs(txn.amount);
    });
    setCategoryTotals(totals);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateCategoryTotals();
  }, [transactions]);

  // Render cashflow chart (applies filters)
  useEffect(() => {
    let chart: Chart | null = null;
    const nowYear = new Date().getFullYear();

    const filtered = transactions.filter((txn) => {
      const txnDate = new Date(txn.transactionDate);

      // Calendar filter
      if (dateRange.from && txnDate < new Date(dateRange.from)) return false;
      if (dateRange.to && txnDate > new Date(dateRange.to)) return false;

      // Graph filter
      if (!dateRange.from && !dateRange.to && graphFilter !== "none") {
        switch (graphFilter) {
          case "thisYear":
            if (txnDate.getFullYear() !== nowYear) return false;
            break;
          case "lastYear":
            if (txnDate.getFullYear() !== nowYear - 1) return false;
            break;
          case "month":
            if (txnDate.getFullYear() !== nowYear) return false;
            break;
          case "week":
            if (txnDate.getFullYear() !== nowYear) return false;
            break;
        }
      }
      return true;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const incomeMonth = Array(12).fill(0);
    const expenseMonth = Array(12).fill(0);
    const incomeWeek = Array(52).fill(0);
    const expenseWeek = Array(52).fill(0);

    filtered.forEach((txn) => {
      const d = new Date(txn.transactionDate);
      const m = d.getMonth();
      const w = Math.floor(
        (d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) /
          (7 * 86400 * 1000)
      );

      if (txn.amount >= 0) {
        incomeMonth[m] += txn.amount;
        incomeWeek[w] += txn.amount;
      } else {
        expenseMonth[m] += Math.abs(txn.amount);
        expenseWeek[w] += Math.abs(txn.amount);
      }
    });

    const ctx = document.getElementById("cashflowChart") as HTMLCanvasElement;
    if (ctx) {
      const labels =
        graphFilter === "week"
          ? Array.from({ length: 52 }, (_, i) => `W${i + 1}`)
          : graphFilter === "month"
          ? months
          : months;
      const incomeData = graphFilter === "week" ? incomeWeek : incomeMonth;
      const expenseData = graphFilter === "week" ? expenseWeek : expenseMonth;

      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "#146985",
              stack: "stack1",
              borderRadius: 4,
            },
            {
              label: "Expense",
              data: expenseData.map((v) => -v),
              backgroundColor: "#ff4d4f",
              stack: "stack1",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              stacked: true,
              min: -Math.max(...expenseData) * 1.2,
              max: Math.max(...incomeData) * 1.2,
              ticks: {
                callback: (v) => Math.abs(Number(v)).toLocaleString(),
              },
            },
            x: { stacked: true },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${Math.abs(
                    context.raw as number
                  ).toLocaleString()}`,
              },
            },
          },
        },
      });
    }

    return () => chart?.destroy();
  }, [transactions, dateRange, graphFilter]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="dashboard-container">
        <Sidebar activePage="Dashboard" />

        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Dashboard</h1>
            <div className="top-right">
              <span className="profile-name">
                {user?.fullname || user?.email || "Guest"}
              </span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>

          <div className="upload-csv-section">
            <UploadCSV onUploadSuccess={fetchTransactions} />
          </div>

          {showModal && selectedRole && (
            <CreateUser
              role={selectedRole}
              onClose={() => setShowModal(false)}
            />
          )}

          {/* ===== CARDS (ALL transactions, NOT filtered) ===== */}
          <section className="cards">
            {Object.entries(categoryTotals).map(([cat, total], idx) => (
              <div className="card" key={idx}>
                <div className="card-title">{cat}</div>
                <div className="card-value">{total.toLocaleString()}</div>
              </div>
            ))}
          </section>

          {/* ===== CASHFLOW CHART (FILTERED) ===== */}
          <section className="charts">
            <div className="chart-card">
              <div className="chart-header">
                <h2>Cashflow</h2>
                <div className="filters">
                  <select
                  title="dropdown"
                    className="years-dropdown"
                    value={graphFilter}
                    onChange={(e) => setGraphFilter(e.target.value as any)}
                  >
                    <option value="thisYear">This Year</option>
                    <option value="lastYear">Last Year</option>
                    <option value="month">Month-wise</option>
                    <option value="week">Week-wise</option>
                    {/* <option value="none">By Date Range</option> */}
                  </select>

                  <label>
                    From:{" "}
                    <input
                      type="date"
                      name="from"
                      value={tempDateRange.from}
                      onChange={handleTempDateChange}
                    />
                  </label>
                  <label>
                    To:{" "}
                    <input
                      type="date"
                      name="to"
                      value={tempDateRange.to}
                      onChange={handleTempDateChange}
                    />
                  </label>
                  <button onClick={applyDateRange}>Apply</button>
                  <button onClick={resetDateRange}>Reset</button>
                </div>
              </div>
              <canvas id="cashflowChart"></canvas>
            </div>
          </section>

          {/* ===== RECENT TRANSACTIONS ===== */}
          <section className="transactions">
            <h2>Recent Transactions</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((txn, idx) => (
                  <tr key={idx}>
                    <td>
                      {new Date(txn.transactionDate).toLocaleDateString()}
                    </td>
                    <td>{txn.transactionDescription}</td>
                    <td className={txn.amount >= 0 ? "positive" : "negative"}>
                      {Math.abs(txn.amount).toLocaleString()}
                    </td>
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
