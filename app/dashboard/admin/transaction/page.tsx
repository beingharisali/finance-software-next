
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

  const [category, setCategory] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // NEW STATES FOR CUSTOM CATEGORY INPUT
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomCategory, setNewCustomCategory] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const fetchTransactions = async (selectedCategory = "", pageNum = 1) => {
    try {
      setLoading(true);

      const url = selectedCategory
        ? `/transactions?category=${selectedCategory}&page=${pageNum}&limit=${limit}`
        : `/transactions?page=${pageNum}&limit=${limit}`;

      const res = await http.get(url);

      setTransactions(res.data.transactions || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);

      // extract all categories ONLY on initial load
      if (!selectedCategory) {
        const cats = res.data.transactions?.map((t: any) => t.category) || [];
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
    if (user) fetchTransactions(); // load all
  }, [user]);

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/dashboard/admin" className="nav-item"> Dashboard</Link>
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

      {/* Main Content */}
      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Transactions</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        {/* CATEGORY DROPDOWN + CUSTOM INPUT */}
        <div className="search-container">
          <select
            title="category-dropdown"
            className="search-input"
            value={category}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "__add_custom__") {
                setIsAddingCustom(true);
                setCategory("");
                return;
              }

              setCategory(value);
              fetchTransactions(value, 1);
            }}
          >
            <option disabled value="">
              Select Category
            </option>

            {allCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}

            <option value="__add_custom__" >
               Add Custom Category
            </option>
          </select>

          {/* Custom Category Input Field */}
          {isAddingCustom && (
            <div className="custom-input-wrapper">
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
                  fetchTransactions(newCustomCategory, 1);

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

        {/* RECORD TABLE */}
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

        {/* PAGINATION */}
        <div className="pagination">
          <div className="pagination-btns">
            <button
              className="prev-btn"
              disabled={page <= 1}
              onClick={() => fetchTransactions(category, page - 1)}
            >
              Previous
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              className="next-btn"
              disabled={page >= totalPages}
              onClick={() => fetchTransactions(category, page + 1)}
            >
              Next
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
