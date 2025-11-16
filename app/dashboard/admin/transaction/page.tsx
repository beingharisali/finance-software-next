
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";
import Link from "next/link";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";

interface TransactionType {
  date: string;
  description: string;
  category: string;
  amount: number;
}

export default function ManagerDashboardTransaction() {
  const { user, logoutUser } = useAuthContext();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState("");

  const fetchTransactions = async (category = "") => {
    try {
      setLoading(true);
      const url = category
        ? `/transactions?category=${category}`
        : "/transactions";

      const res = await http.get(url);
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);


  if (!user) return <p>Loading user...</p>;

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/dashboard/admin" className="nav-item"> Dashboard</Link>
          <Link href="/dashboard/admin/adminmanagerrecord" className="nav-item">Manager Record</Link>
          <Link href="/dashboard/admin/adminagentrecord" className="nav-item">Agent Record </Link>
          <Link href="/dashboard/admin/adminbrokerrecord" className="nav-item">Broker Record</Link>
          <Link href="/dashboard/sidebarcomponent/transaction" className="nav-item active">Transaction</Link>
          <Link href="/dashboard/sidebarcomponent/payment" className="nav-item">Payment</Link>
          <Link href="/dashboard/sidebarcomponent/card" className="nav-item">Card</Link>
          <Link href="/dashboard/sidebarcomponent/insight" className="nav-item">Insights</Link>
          <Link href="/dashboard/sidebarcomponent/settings" className="nav-item">Settings</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Transactions</h1>
          <div className="top-right">
            <span className="profile-name">
              {user.fullname || user.email || "Guest"}
            </span>
            <button className="logout-btn" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>
 {/* start Search bar  */}
        <div className="search-container" >
          <input
            type="text"
            placeholder="Search by category (e.g., Office)"
            className="search-input"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}/>
          <button className="search-btn"
            onClick={() => fetchTransactions(searchCategory)}>Search</button>
             <button
              className="reset-btn"
             onClick={() => {
              setSearchCategory("");
              fetchTransactions();
            }}  > Reset </button>
        </div>
        {/* end searchbutton */}
        <div className="record-wrapper">
          {loading ? (
            <p className="loading-text">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="no-records">No transactions found.</p>
          ) : (
            <table className="record-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td>{txn.date}</td>
                    <td>{txn.description}</td>
                    <td>{txn.category}</td>
                    <td>{txn.amount}</td>
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
