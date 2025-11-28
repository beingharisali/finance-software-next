
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import moment from "moment";

import "../../cssfiles/record.css";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/transactionfilters.css";
import "../../cssfiles/transactionCategory.css"; 

import {
  fetchTransactions as getTransactions,
  TransactionType,
  updateTransactionCategory
} from "@/services/transactionService";

import {
  fetchCustomCategories,
  addCustomCategory,
  deleteCustomCategory,
} from "@/services/category";

import Sidebar from "@/app/dashboard/components/Sidebar";
import ProtectedRoute from "@/utilies/ProtectedRoute";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState("");

  // ---------------------- FETCH TRANSACTIONS ----------------------
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

      // Combine transaction categories & custom categories
      // const txnCategories = fetchedTransactions
      //   .map((t) => t.category)
      //   .filter(Boolean);

      // setAllCategories((prev) => [...new Set([...txnCategories, ...prev])]);
      // Categories from transactions
const txnCategories = fetchedTransactions
  .map((t) => t.category)
  .filter(Boolean);

// Transaction Types ALSO added to dropdown
const txnTypes = fetchedTransactions
  .map((t) => t.transactionType)
  .filter(Boolean);

// Combine: categories + types + previous custom categories
setAllCategories((prev) => [
  ...new Set([...txnCategories, ...txnTypes, ...prev])
]);

    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- FETCH CUSTOM CATEGORIES ----------------------
  const fetchCategories = async () => {
    try {
      const res = await fetchCustomCategories();
      if (res.success && res.categories) {
        setAllCategories((prev) => [...new Set([...prev, ...res.categories])]);
      }
    } catch (error) {
      console.error("Failed to fetch custom categories", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions().then(() => fetchCategories());
    }

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

  // ---------------------- RESET FILTERS ----------------------
  const resetFilters = () => {
    setSearchCategory("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setIsAddingCustom(false);
    setNewCustomCategory("");
    fetchTransactions("", "", "", 1).then(() => fetchCategories());
  };

  // ---------------------- ADD CUSTOM CATEGORY ----------------------
  const handleAddCustomCategory = async () => {
    if (!newCustomCategory.trim()) return;
    try {
      const res = await addCustomCategory(newCustomCategory.trim());
      if (res.success) {
        setAllCategories((prev) => [...prev, newCustomCategory.trim()]);
        setCategory(newCustomCategory.trim());
        setNewCustomCategory("");
        setIsAddingCustom(false);
        setDropdownOpen(false);
        alert(res.msg);
      } else {
        alert(res.msg);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add category");
    }
  };

  // ---------------------- DELETE CATEGORY ----------------------
  const handleDeleteCategory = async (cat: string) => {
    try {
      const res = await deleteCustomCategory(cat);
      if (res.success) {
        setAllCategories((prev) => prev.filter((c) => c !== cat));
        if (category === cat) setCategory("");
        alert(res.msg);
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting category");
    }
  };

  // ---------------------- SAVE EDIT CATEGORY ----------------------
  const saveCategory = async (txnId: string) => {
    if (!editingCategory) return;
    try {
      const res = await updateTransactionCategory(txnId, editingCategory);
      if (res.success) {
        setTransactions((prev) =>
          prev.map((txn) =>
            txn._id === txnId ? { ...txn, category: editingCategory } : txn
          )
        );
        setEditingId(null);
        setEditingCategory("");
        alert("Category updated successfully");
      } else {
        alert("Failed to update category");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating category");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="dashboard-container">
        <Sidebar activePage="Transaction" />
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
              <button
                className="search-btn"
                onClick={() =>
                  fetchTransactions(searchCategory, startDate, endDate, 1)
                }
              >
                Search
              </button>
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

                    {/* ADD CUSTOM CATEGORY */}
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

            {/* DATE FILTER */}
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
              <button
                className="apply-btn"
                onClick={() =>
                  fetchTransactions(category || searchCategory, startDate, endDate, 1)
                }
              >
                Apply
              </button>
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
                    <th>Transaction Date</th>
                    <th>Description</th>
                    <th>Transaction Type</th>
                    <th>Amount</th>
                    <th>Sort Code</th>
                    <th>Account Number</th>
                    <th>Balance</th>
                    <th>Category / Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn.transactionDate ? moment(txn.transactionDate).format("DD/MM/YYYY") : "-"}</td>
                      <td>{txn.transactionDescription || "-"}</td>
                      <td>{txn.transactionType || "-"}</td>
                      <td>{txn.amount || 0}</td>
                      <td>{txn.sortCode || "-"}</td>
                      <td>{txn.accountNumber || "-"}</td>
                      <td>{txn.balance || 0}</td>
                      <td className="category-column">
                        {editingId === txn._id ? (
                          <div className="edit-wrapper">
                            <input
                              title="editcategory"
                              type="text"
                              value={editingCategory}
                              onChange={(e) => setEditingCategory(e.target.value)}
                              className="edit-input"
                            />
                            <div className="edit-btns">
                              <button className="save-btn" onClick={() => saveCategory(txn._id)}>Save</button>
                              <button className="txn-edit-btn-cancle" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="view-wrapper">
                            <span>{txn.category || "-"}</span>
                            <button className="txn-edit-btn" onClick={() => {
                              setEditingId(txn._id);
                              setEditingCategory(txn.category || "");
                            }}>Edit</button>
                          </div>
                        )}
                      </td>
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
                onClick={() => fetchTransactions(category || searchCategory, startDate, endDate, page - 1)}
              >
                Previous
              </button>

              <span>Page {page} of {totalPages}</span>

              <button
                className="next-btn"
                disabled={page >= totalPages}
                onClick={() => fetchTransactions(category || searchCategory, startDate, endDate, page + 1)}
              >
                Next
              </button>
            </div>
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
