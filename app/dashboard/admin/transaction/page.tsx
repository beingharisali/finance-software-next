
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";
import Link from "next/link";
import moment from "moment";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";

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

  const [category, setCategory] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomCategory, setNewCustomCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async (
    selectedCategory = "",
    start = "",
    end = "",
    pageNum = 1
  ) => {
    try {
      setLoading(true);

      let url = `/transactions?page=${pageNum}&limit=${limit}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (start) url += `&startDate=${start}`;
      if (end) url += `&endDate=${end}`;

      const res = await http.get(url);
      const fetchedTransactions = (res.data.transactions as TransactionType[]) || [];

      setTransactions(fetchedTransactions);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);

      if (!selectedCategory && !start && !end) {
        const cats = fetchedTransactions.map((t) => t.category);
        setAllCategories([...new Set(cats)]);
      }
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
          <Link href="/dashboard/admin" className="nav-item">Dashboard</Link>
          <Link href="/dashboard/admin/adminmanagerrecord" className="nav-item">Manager Record</Link>
          <Link href="/dashboard/admin/adminagentrecord" className="nav-item">Agent Record</Link>
          <Link href="/dashboard/admin/adminbrokerrecord" className="nav-item">Broker Record</Link>
          <Link href="/dashboard/sidebarcomponent/transaction" className="nav-item active">Transaction</Link>
          <Link href="/dashboard/sidebarcomponent/payment" className="nav-item">Payment</Link>
          <Link href="/dashboard/sidebarcomponent/card" className="nav-item">Card</Link>
          <Link href="/dashboard/sidebarcomponent/insight" className="nav-item">Insights</Link>
          <Link href="/dashboard/sidebarcomponent/settings" className="nav-item">Settings</Link>
        </div>
      </nav>

      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Transactions</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        {/* FILTER ROW */}
        <div className="filter-row">
          <div className="category-section">
            <select
              title="filter"
              className="filter-select"
              value={category}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__add_custom__") {
                  setIsAddingCustom(true);
                  setCategory("");
                  return;
                }
                setCategory(value);
                fetchTransactions(value, startDate, endDate, 1);
              }}
            >
              <option disabled value="">Select Category</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
              <option value="__add_custom__">Add Custom Category</option>
            </select>

            {isAddingCustom && (
              <div className="custom-box">
                <input
                  type="text"
                  placeholder="Enter custom category..."
                  value={newCustomCategory}
                  onChange={(e) => setNewCustomCategory(e.target.value)}
                  className="custom-input"
                />
                <button
                  className="custom-add-btn"
                  onClick={() => {
                    if (!newCustomCategory.trim()) return;
                    setAllCategories((prev) => [...prev, newCustomCategory]);
                    setCategory(newCustomCategory);
                    fetchTransactions(newCustomCategory, startDate, endDate, 1);
                    setNewCustomCategory("");
                    setIsAddingCustom(false);
                  }}
                >
                  Add
                </button>
                <button
                  className="custom-cancel-btn"
                  onClick={() => {
                    setIsAddingCustom(false);
                    setNewCustomCategory("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="date-section">
            <input
              title="start-date"
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              title="end-date"
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="apply-btn"
              onClick={() => fetchTransactions(category, startDate, endDate, 1)}
            >
              Apply
            </button>
          </div>
        </div>

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
                    <td>{moment(txn.date).format("DD/MM/YYYY")}</td>
                    <td>{txn.description}</td>
                    <td>{txn.category}</td>
                    <td>{txn.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <div className="pagination-btns">
            <button
              className="prev-btn"
              disabled={page <= 1}
              onClick={() => fetchTransactions(category, startDate, endDate, page - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="next-btn"
              disabled={page >= totalPages}
              onClick={() => fetchTransactions(category, startDate, endDate, page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
