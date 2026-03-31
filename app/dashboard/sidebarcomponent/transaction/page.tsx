"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { format, parse } from "date-fns";
// import moment from "moment";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";
import "../../../cssfiles/transactionCategory.css";
import {
  fetchTransactions as getTransactions,
  TransactionType,
  updateTransactionCategory,
} from "@/services/transactionService";

import {
  fetchCustomCategories,
  addCustomCategory,
  deleteCustomCategory,
} from "@/services/category";
import Sidebar from "@/app/dashboard/components/Sidebar";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import { FaBell } from "react-icons/fa";
import moment from "moment";

export default function ManagerDashboardTransaction() {
  const { user, logoutUser } = useAuthContext();
  // New state for notification dropdown
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [uncategorizedCounts, setUncategorizedCounts] = useState<{
    [key: string]: number;
  }>({});
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnassigned, setTotalUnassigned] = useState(0);
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

  // ---------------- POPUP STATES --------------------
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [selectedNewCategory, setSelectedNewCategory] = useState("");
  const fetchAllTransactionsForNotifications = async () => {
    try {
      // Fetch all transactions without pagination (use a large limit)
      const res = await getTransactions(1, 1000000);
      const allTxns: TransactionType[] = res.transactions || [];

      const counts: { [key: string]: number } = {};
      let total = 0;
      allTxns.forEach((txn) => {
        if (!txn.category || txn.category.toLowerCase() === "uncategorised") {
      
          const type = txn.transactionType || "Uncategorised";
          counts[type] = (counts[type] || 0) + 1;
          total++;
        }
      });

      setUncategorizedCounts(counts);
      setTotalUnassigned(total);
    } catch (error) {
      console.error(
        "Failed to fetch all transactions for notifications",
        error,
      );
    }
  };
  // ---------------- HELPER FUNCTION ----------------

  function swapDayMonth(date: string | Date | number | undefined) {
    if (!date) return "-";

    try {
      let d: Date;

      if (typeof date === "string") {
        // ISO string
        d = parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", new Date());
        if (isNaN(d.getTime())) {
          d = parse(date, "d/M/yyyy", new Date());
        }
      } else if (typeof date === "number") {
        // Excel serial number to JS Date
        // Excel date 1 = 1900-01-01, but Excel mistakenly considers 1900 as leap year
        const excelStartDate = new Date(1899, 11, 30);
        d = new Date(excelStartDate.getTime() + date * 24 * 60 * 60 * 1000);
      } else {
        // Already a Date object
        d = date;
      }

      if (isNaN(d.getTime())) return "-"; 

      return format(d, "dd/MM/yyyy"); 
    } catch (error) {
      return "-";
    }
  }
  // ---------------------- FETCH TRANSACTIONS ----------------------
  const fetchTransactions = async (
    selectedCategory = "",
    start = "",
    end = "",
    pageNum = 1,
    searchCategory = "",
  ) => {
    try {
      setLoading(true);
      const res = await getTransactions(
        pageNum,
        limit,
        selectedCategory,
        start,
        end,
        
      );
      const fetchedTransactions: TransactionType[] = res.transactions || [];

      const transactionsCleaned = fetchedTransactions.map((txn) => ({
        ...txn,
        category:
          txn.category &&
          txn.category.trim() !== "" &&
          txn.category.trim().toLowerCase() !== "uncategorised"
            ? txn.category
            : "",
      }));
      // only new add
      // fix
//    const transactionsCleaned = fetchedTransactions.map((txn) => ({
//   ...txn,
//   category:
//     txn.category &&
//     txn.category.trim() !== "" &&
//     txn.category.trim().toLowerCase() !== "uncategorised"
//       ? txn.category
//       : txn.transactionType || "",
// }));

      // ----- Filter by transactionType if searchCategory is not empty -----

      // const filteredTransactions = searchCategory
      //   ? transactionsCleaned.filter((txn) =>
      //       txn.transactionType
      //         ?.toLowerCase()
      //         .includes(searchCategory.toLowerCase()),
      //     )
      //   : transactionsCleaned;
      const filteredTransactions = searchCategory
  ? transactionsCleaned.filter((txn) =>
      txn.transactionDescription
        ?.toLowerCase()
        .includes(searchCategory.toLowerCase()),
    )
  : transactionsCleaned;

      setTransactions(filteredTransactions);

      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);

      const txnCategories = transactionsCleaned
        .map((t) => t.category)
        .filter(Boolean);
      const txnTypes = transactionsCleaned
        .map((t) => t.transactionType)
        .filter(Boolean);
      setAllCategories((prev) => [
        ...new Set([...prev, ...txnCategories, ...txnTypes]),
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

      if (res.categories && Array.isArray(res.categories)) {
        const safeCategories = res.categories.filter(
          (c): c is string => typeof c === "string" && c.trim() !== "",
        );

        setAllCategories((prev) => [
          ...new Set([...(prev || []), ...safeCategories]),
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch custom categories", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllTransactionsForNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTransactions().then(() => fetchCategories());
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    fetchTransactions("", "", "", 1);
  };

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

  const handleDeleteCategory = async (cat: string) => {
    try {
      const res = await deleteCustomCategory(cat);
      if (res.success) {
        setAllCategories((prev) => prev.filter((c) => c !== cat));
        setTransactions((prev) =>
          prev.map((t) => (t.category === cat ? { ...t, category: "" } : t)),
        );
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

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="dashboard-container">
        <Sidebar activePage="Transaction" />

        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Transactions</h1>
            <div className="top-right">
              <span className="profile-name">
                {user.fullname || user.email}
              </span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
              {/* notification */}
              <div className="relative inline-block">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow flex items-center gap-2"
                >
                  <FaBell /> Notifications
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b font-semibold text-gray-700">
                      Uncategorised Transactions: {totalUnassigned}
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2">
                      {Object.keys(uncategorizedCounts).length > 0 ? (
                        Object.entries(uncategorizedCounts).map(
                          ([type, count], index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setCategory("Uncategorised");
                                fetchTransactions(
                                  "Uncategorised",
                                  startDate,
                                  endDate,
                                  1,
                                );
                                setNotificationOpen(false);
                              }}
                            >
                              {/* Serial number */}
                              <span className="text-gray-500 mr-2">
                                {index + 1}.
                              </span>

                              {/* Type name */}
                              <span className="text-gray-700 font-medium flex-1">
                                {type}
                              </span>

                              {/* Count of uncategorized transactions */}
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                {count}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-black text-center py-3">
                          All Transaction categorised
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SEARCH FILTER */}
          <div className="filter-row text-black">
            <div className="search-container search-center">
              <input
                type="text"
                placeholder="Search by Transaction Description"
                className="search-input"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
              <button
                className="search-btn"
                // onClick={() =>
                //   fetchTransactions(searchCategory, startDate, endDate, 1)
                // }
                onClick={() =>
  fetchTransactions(category, startDate, endDate, 1, searchCategory)
}
              >
                Search
              </button>

              <button className="reset-btn" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>

          {/* CATEGORY + DATE FILTER */}
          <div className="filter-row text-black">
            <div className="category-section" ref={dropdownRef}>
              <div className="custom-dropdown">
                <div
                  className="dropdown-header"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {category || "Select Category"}
                  <span className="dropdown-arrow">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
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

                        <span
                          className="delete-btn"
                          onClick={() => handleDeleteCategory(cat)}
                        >
                          ×
                        </span>
                      </div>
                    ))}

                    <div className="dropdown-item">
                      {isAddingCustom ? (
                        <div className="custom-box">
                          <input
                            type="text"
                            value={newCustomCategory}
                            placeholder="New category..."
                            className="custom-input"
                            onChange={(e) =>
                              setNewCustomCategory(e.target.value)
                            }
                          />
                          <button
                            className="custom-add-btn"
                            onClick={handleAddCustomCategory}
                          >
                            Add
                          </button>
                          <button
                            className="custom-cancel-btn"
                            onClick={() => setIsAddingCustom(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span
                          className="add-custom"
                          onClick={() => setIsAddingCustom(true)}
                        >
                          + Add Custom Category
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="date-section">
              <span className="text-sm">From:</span>
              <input
                title="date"
                type="date"
                className="date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-sm">To:</span>
              <input
                title="date "
                type="date"
                className="date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button
                className="apply-btn"
                onClick={() =>
                  fetchTransactions(
                    category || searchCategory,
                    startDate,
                    endDate,
                    1,
                  )
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
                    <th className="text-right">Amount</th>
                    <th>Category</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((txn) => {
                    console.log("txn.transactionDate", txn.transactionDate);
                    return (
                      <tr
                        key={txn._id}
                        onDoubleClick={() => {
                          setSelectedTransaction(txn);
                          setShowPopup(true);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                      
                        <td>{swapDayMonth(txn.transactionDate)}</td>
                        <td>{txn.transactionDescription || "-"}</td>
                        <td>{txn.transactionType || "-"}</td>
                        {/* <td className="text-right ">{txn.amount || 0}</td> */}
                        <td
                          className="text-right"
                          style={{
                            color: txn.amount < 0 ? "red" : "green",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          £{Number(txn.amount).toFixed(2)}
                        </td>

                        <td className="category-column">
                          <select
                            title="category-dropdown"
                            // value={txn.category || ""}
                            // value={txn.category || txn.transactionType || ""}
                            value={txn.category || ""}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              setSelectedTransaction(txn);
                              setSelectedNewCategory(newCat);
                              setShowPopup(true);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            {allCategories.map((cat, idx) => (
                              <option key={idx} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
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
                onClick={() =>
                  fetchTransactions(
                    category || searchCategory,
                    startDate,
                    endDate,
                    page - 1,
                  )
                }
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                className="next-btn"
                disabled={page >= totalPages}
                onClick={() =>
                  fetchTransactions(
                    category || searchCategory,
                    startDate,
                    endDate,
                    page + 1,
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ---------------- POPUP ---------------- */}
      {showPopup && selectedTransaction && (
        <div className="fullpage-overlay">
          <div className="transaction-detail-page">
            <h2>Transaction Details</h2>

            {/* <p>
        <b>Date:</b>{" "}
        {selectedTransaction.transactionDate
          ? moment(selectedTransaction.transactionDate).format("DD/MM/YYYY")
          : "-"}
      </p> */}
            {/* <p> */}
            {/* <b>Date:</b> {swapDayMonth(selectedTransaction.transactionDate)}
</p> */}
            <p>
              <b>Date:</b> {swapDayMonth(selectedTransaction.transactionDate)}
            </p>
            <p>
              <b>Description:</b>{" "}
              {selectedTransaction.transactionDescription || "-"}
            </p>
            <p>
              <b>Type:</b> {selectedTransaction.transactionType || "-"}
            </p>
            <p>
              <b>Amount:</b> {selectedTransaction.amount || 0}
            </p>

            {/* Category Dropdown */}
            <div className="category-column">
              <select
                title="category-dropdown"
                value={selectedTransaction.category || ""}
                onChange={(e) => setSelectedNewCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {allCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="popup-buttons">
              <button
                className="popup-btn single"
                onClick={async () => {
                  try {
                    const res = await updateTransactionCategory(
                      selectedTransaction._id,
                      selectedNewCategory,
                    );
                    if (res.success) {
                      setTransactions((prev) =>
                        prev.map((t) =>
                          t._id === selectedTransaction._id
                            ? { ...t, category: selectedNewCategory }
                            : t,
                        ),
                      );
                      fetchAllTransactionsForNotifications();
                      alert("Category updated for this transaction.");
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Error updating category");
                  }
                  setShowPopup(false);
                }}
              >
                Only This Transaction
              </button>

              <button
                className="popup-btn all"
                onClick={async () => {
                  try {
                    const res = await updateTransactionCategory(
                      selectedTransaction._id,
                      selectedNewCategory,
                      true,
                    );
                    if (res.success) {
                      setTransactions((prev) =>
                        prev.map((t) =>
                          t.transactionDescription ===
                          selectedTransaction.transactionDescription
                            ? { ...t, category: selectedNewCategory }
                            : t,
                        ),
                      );
                      fetchAllTransactionsForNotifications();
                      alert(
                        "Category updated for all future transactions with same description.",
                      );
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Error updating category");
                  }
                  setShowPopup(false);
                }}
              >
                All Future Transactions
              </button>

              <button
                className="popup-btn cancel"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
