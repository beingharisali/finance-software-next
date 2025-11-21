
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import moment from "moment";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";


import {
  fetchTransactions as getTransactions,
  addCategory,
  deleteCategory,
  TransactionType,
} from "@/services/transactionService";

export default function ManagerDashboardTransaction() {
  const { user, logoutUser } = useAuthContext();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [searchCategory, setSearchCategory] = useState("");

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomCategory, setNewCustomCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch transactions
  const fetchTransactions = async (
    selectedCategory = "",
    start = "",
    end = "",
    pageNum = 1
  ) => {
    try {
      setLoading(true);
      const res = await getTransactions(pageNum, limit, selectedCategory, start, end);
      const fetchedTransactions: TransactionType[] = res.transactions || [];

      setTransactions(fetchedTransactions);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);

      // FIX: safely extract categories
      if (!selectedCategory && !start && !end) {
        const cats = fetchedTransactions
          .map((t) => t.category)
          .filter((c): c is string => Boolean(c)); // only valid strings
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

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setIsAddingCustom(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  if (!user) return <p>Loading user...</p>;

  const resetFilters = () => {
    setSearchCategory("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setIsAddingCustom(false);
    setNewCustomCategory("");
    fetchTransactions("", "", "", 1);
  };

  const handleDeleteCategory = async (cat: string) => {
    try {
      const res = await deleteCategory(cat);
      if (res.success) {
        setAllCategories((prev) => prev.filter((c) => c !== cat));
        if (category === cat) setCategory("");
        setTransactions((prev) => prev.filter((txn) => txn.category !== cat));
        alert(res.msg);
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting category");
    }
  };

  const handleAddCustomCategory = async () => {
    if (!newCustomCategory.trim()) return;
    try {
      const res = await addCategory(newCustomCategory);
      if (res.success) {
        setAllCategories((prev) => [...prev, newCustomCategory]);
        setCategory(newCustomCategory);
        fetchTransactions(newCustomCategory, startDate, endDate, 1);
        setNewCustomCategory("");
        setIsAddingCustom(false);
        setDropdownOpen(false);
        alert(res.msg);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add category");
    }
  };

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

        {/* SEARCH FILTER */}
        <div className="filter-row">
          <div className="search-container search-center">
            <input
              type="text"
              placeholder="Search by category"
              className="search-input"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <button className="search-btn" onClick={() => fetchTransactions(searchCategory, startDate, endDate, 1)}>Search</button>
            <button className="reset-btn" onClick={resetFilters}>Reset</button>
          </div>
        </div>

        {/* CATEGORY + DATE FILTER */}
        <div className="filter-row">
          <div className="category-section" ref={dropdownRef}>
            <div className="custom-dropdown">
              <div className="dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {category || "Select Category"}
                <span className="dropdown-arrow">{dropdownOpen ? "▲" : "▼"}</span>
              </div>

              {dropdownOpen && (
                <div className="dropdown-list">
                  {allCategories.map((cat, idx) => (
                    <div className="dropdown-item" key={idx}>
                      <span
                        className="dropdown-text"
                        onClick={() => {
                          setCategory(cat);
                          fetchTransactions(cat, startDate, endDate, 1);
                          setDropdownOpen(false);
                        }}
                      >
                        {cat}
                      </span>
                      <span className="delete-btn" onClick={() => handleDeleteCategory(cat)}>×</span>
                    </div>
                  ))}

                  {/* ADD CUSTOM CATEGORY INLINE */}
                  <div className="dropdown-item">
                    {isAddingCustom ? (
                      <div className="custom-box">
                        <input
                          type="text"
                          value={newCustomCategory}
                          placeholder="New category..."
                          className="custom-input"
                          onChange={(e) => setNewCustomCategory(e.target.value)}
                        />
                        <button className="custom-add-btn" onClick={handleAddCustomCategory}>Add</button>
                        <button className="custom-cancel-btn" onClick={() => setIsAddingCustom(false)}>Cancel</button>
                      </div>
                    ) : (
                      <span className="add-custom" onClick={() => setIsAddingCustom(true)}>
                        + Add Custom Category
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="date-section">
            <input
              title="date"
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              title="date"
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button className="apply-btn" onClick={() => fetchTransactions(category || searchCategory, startDate, endDate, 1)}>Apply</button>
          </div>
        </div>

        {/* TRANSACTION TABLE */}
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
                {transactions.map((txn, idx) => (
                  <tr key={idx}>
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

        {/* PAGINATION */}
        <div className="pagination">
          <div className="pagination-btns">
            <button className="prev-btn" disabled={page <= 1} onClick={() => fetchTransactions(category || searchCategory, startDate, endDate, page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button className="next-btn" disabled={page >= totalPages} onClick={() => fetchTransactions(category || searchCategory, startDate, endDate, page + 1)}>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
