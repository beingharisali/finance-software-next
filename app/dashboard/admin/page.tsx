"use client";

import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import { useAuthContext } from "@/context/AuthContext";
import { Chart, registerables } from "chart.js";
import http from "@/services/http";
import moment from "moment";
import { fetchCustomCategories } from "@/services/category";
import CreateUser from "../createusers/page";
import UploadCSV from "../admin/uploadcsv/page";
import "../../cssfiles/admin.css";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/uploadCSV.css";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { TransactionType } from "@/services/transactionService";
Chart.register(...registerables);

interface Client {
  clientNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  extraInfo?: string;
  dateOfBirth: string;
}

interface Deal {
  _id?: string;
  ref: string;
  date: string;
  broker: string;
  client: string;
  products: string[];
  status: string;
  commission?: number;
}
export default function AdminDashboard() {
  // date month
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  
   // Dropdown for client deals
    const [showClientDeals, setShowClientDeals] = useState(false);
    const [selectedClientDealsList, setSelectedClientDealsList] = useState<Deal[]>([]);
  // nottification
  // NEW: for category click modal
  const [clickedCategoryTransactions, setClickedCategoryTransactions] =
    useState<TransactionType[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [recentlyUploadedIds, setRecentlyUploadedIds] = useState<Set<string>>(
    new Set(),
  );
  const [graphCategory, setGraphCategory] = useState<string>("All");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>(
    {},
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
  // ---------------- POPUP STATES --------------------
  const [uncategorizedCounts, setUncategorizedCounts] = useState<Record<string, number>>({});
const [totalUnassigned, setTotalUnassigned] = useState(0);

const fetchAllTransactionsForNotifications = async () => {
  try {
    const res = await http.get("/transactions"); // or getTransactions(1, 1000000)
    const allTxns: TransactionType[] = res.data.transactions || [];

    const counts: { [key: string]: number } = {};
    let total = 0;
    allTxns.forEach((txn) => {
      if (!txn.category || txn.category.toLowerCase() === "uncategorised") {
        const type = txn.transactionType || "Uncategorised";
        counts[type] = (counts[type] || 0) + 1;
        total++;
      }
    });

    const [showPopup, setShowPopup] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [selectedNewCategory, setSelectedNewCategory] = useState("");
   
    setUncategorizedCounts(counts);
    setTotalUnassigned(total);
  } catch (error) {
    console.error("Failed to fetch all transactions for notifications", error);
  }
};
 const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const fetchClients = async () => {
    try {
      const res = await http.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Fetch clients error:", err);
      alert("Failed to fetch clients");
    }
  };

  const fetchDeals = async () => {
    try {
      const res = await http.get("/deals");
      setDeals(res.data);
    } catch (err) {
      console.error("Fetch deals error:", err);
      alert("Failed to fetch deals");
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDeals();
  }, []);
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
    setGraphFilter("none");
  };

  const resetDateRange = () => {
    // date range reset
    setDateRange({ from: "", to: "" });
    setTempDateRange({ from: "", to: "" });

    // graph filter reset
    setGraphFilter("thisYear");

    // category filter reset
    setGraphCategory("All");
    setSelectedMonth("all");
  };
  //  handle click on category card
  // const handleCategoryClick = (category: string) => {
  //   const filteredTxns = getFilteredTransactions().filter(
  //     (txn) =>
  //       (txn.transactionType?.trim() || txn.category || "Uncategorized") ===
  //       category,
  //   );
  //   setClickedCategoryTransactions(filteredTxns);
  //   setShowCategoryModal(true);
  // };
  const handleCategoryClick = (category: string) => {
  const filteredTxns = getFilteredTransactions().filter((txn) => {
    const cats = [txn.transactionType?.trim(), txn.category?.trim()].filter(Boolean);
    return cats.includes(category);
  });

  setClickedCategoryTransactions(filteredTxns);
  setShowCategoryModal(true);
};
  const fetchTransactions = async () => {
    try {
      const res = await http.get("/transactions");
      const data: TransactionType[] = res.data.transactions || [];
      data.sort(
        (a, b) =>
          moment(b.transactionDate, "DD/MM/YYYY").valueOf() -
          moment(a.transactionDate, "DD/MM/YYYY").valueOf(),
      );

      // Set all categories (category + transactionType)
      const txnCategories = data.map((t) => t.category).filter(Boolean);
      const txnTypes = data.map((t) => t.transactionType).filter(Boolean);
      setAllCategories((prev) =>
        Array.from(new Set([...prev, ...txnCategories, ...txnTypes])),
      );
// Fetch clients
  const fetchClients = async () => {
    try {
      const res = await http.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Fetch clients error:", err);
      alert("Failed to fetch clients");
    }
  };

  
      // Detect newly uploaded transactions
      const oldTransactions = transactions;
      const newIds = new Set<string>();
      data.forEach((tx) => {
        const id = `${tx.transactionDate}-${tx.transactionDescription}-${tx.amount}-${tx.transactionType || "none"}`;
        if (
          !oldTransactions.find(
            (t) =>
              `${t.transactionDate}-${t.transactionDescription}-${t.amount}-${t.transactionType || "none"}` ===
              id,
          )
        ) {
          newIds.add(id);
        }
      });
      setRecentlyUploadedIds(newIds);

      // Update state
     
      setTransactions((prev) => {
  const allTxns = [...prev, ...data];
  const uniqueTxns = Array.from(new Map(
    allTxns.map(tx => [`${tx.transactionDate}-${tx.transactionDescription}-${tx.amount}-${tx.transactionType || 'none'}`, tx])
  ).values());

  return uniqueTxns.sort((a,b) =>
    new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );
});

    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
      setAllCategories([]);
      setRecentlyUploadedIds(new Set());
    }
  };
  // Add this function inside AdminDashboard component

  const fetchAllCategories = async () => {
    try {
      //  Transaction types from existing transactions
      const txnTypes = transactions
        .map((t) => t.transactionType?.trim())
        .filter(Boolean);

      //  Custom categories from backend
      const res = await fetchCustomCategories();
      const customCats: string[] =
        res.categories?.filter((c: string) => c?.trim()) || [];

      //  Merge and remove duplicates
      const mergedCategories = Array.from(
        new Set([...txnTypes, ...customCats]),
      );

      //  Add all option at start
      // setAllCategories(["All", ...mergedCategories]);
      setAllCategories((prev) =>
        Array.from(new Set(["All", ...prev, ...mergedCategories])),
      );
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setAllCategories(["All"]);
    }
  };

  useEffect(() => {
    fetchTransactions().then(fetchAllCategories);
  }, []); // sirf component mount pe fetch hoga

  const calculateCategoryTotals = () => {
    const totals: Record<string, number> = {};

    // Initialize all categories
    allCategories.forEach((cat) => {
      if (cat !== "All") totals[cat] = 0;
    });

    const filteredTxns = getFilteredTransactions();

    filteredTxns.forEach((txn) => {
      const cats = [txn.transactionType?.trim(), txn.category?.trim()].filter(
        Boolean,
      );
      cats.forEach((cat) => {
        totals[cat] = (totals[cat] || 0) + Math.abs(txn.amount);
      });
    });

    totals["All"] = filteredTxns.reduce(
      (sum, tx) => sum + Math.abs(tx.amount),
      0,
    );

    setCategoryTotals(totals);
  };
  const uniqueCategories = [
    "All",
    ...new Set(
      transactions.map((t) => t.transactionType?.trim()).filter(Boolean),
    ),
  ];

  useEffect(() => {
    calculateCategoryTotals();
  }, [transactions]);

  useEffect(() => {
    let chart: Chart | null = null;
    const nowYear = new Date().getFullYear();

    const filtered = transactions.filter((txn) => {
      const txnDate = new Date(txn.transactionDate);

      if (graphCategory !== "All") {
        const cats = [txn.transactionType?.trim(), txn.category?.trim()].filter(
          Boolean,
        );
        if (!cats.includes(graphCategory)) return false;
      }
      // Calendar filter
      if (dateRange.from && txnDate < new Date(dateRange.from)) return false;
      if (dateRange.to && txnDate > new Date(dateRange.to)) return false;

      // Graph filter

      if (!dateRange.from && !dateRange.to && graphFilter !== "none") {
        switch (graphFilter) {
          case "thisYear":
            if (txnDate.getFullYear() !== nowYear) return;
            break;

          case "lastYear":
            if (txnDate.getFullYear() >= nowYear) return false;
            //         case "lastYear":
            // if (txnDate.getFullYear() !== nowYear - 1) return false;
            break;
          case "month":
          case "week":
            break;
        }
        // MONTH FILTER
        if (selectedMonth !== "all") {
          if (txnDate.getMonth() !== selectedMonth) return false;
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
          (7 * 86400 * 1000),
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
                    context.raw as number,
                  ).toLocaleString()}`,
              },
            },
          },
        },
      });
    }

    return () => chart?.destroy();
  }, [transactions, dateRange, graphFilter, graphCategory, selectedMonth]);
  const getFilteredTransactions = () => {
    const nowYear = new Date().getFullYear();
    return transactions.filter((txn) => {
      const txnDate = new Date(txn.transactionDate);

      // Category filter (graphCategory dropdown)
      if (graphCategory !== "All") {
        // const cat =
        //   txn.transactionType?.trim() || txn.category || "Uncategorized";
        // if (cat !== graphCategory) return false;
        const cats = [txn.transactionType?.trim(), txn.category?.trim()].filter(
          Boolean,
        );
        if (!cats.includes(graphCategory)) return false;
      }

      // Date range filter
      if (dateRange.from && txnDate < new Date(dateRange.from)) return false;
      if (dateRange.to && txnDate > new Date(dateRange.to)) return false;

      // Graph filter (thisYear, lastYear, month/week)
      if (!dateRange.from && !dateRange.to && graphFilter !== "none") {
        switch (graphFilter) {
          case "thisYear":
            if (txnDate.getFullYear() !== nowYear) return false;
            break;
          case "lastYear":
            // if (txnDate.getFullYear() !== nowYear - 1) return false;
            if (txnDate.getFullYear() >= nowYear) return false;
            break;
          case "month":
          case "week":
            break;
        }
      }
      // month filter
      if (selectedMonth !== "all") {
        if (txnDate.getMonth() !== selectedMonth) return false;
      }

      return true;
    });
  };

  // NEW: calculate totals for selected date range
  const filteredTxns = getFilteredTransactions();
  const totalIncome = filteredTxns
    .filter((tx) => tx.amount >= 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = filteredTxns
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="dashboard-container">
        <Sidebar activePage="Dashboard" />

        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Dashboard</h1>

            <div className="top-right flex items-center gap-4">
               <div
              className="relative bg-[#0f526a] text-white px-4 py-2 rounded flex items-center gap-3 cursor-pointer"
              onClick={() => setShowClientDeals(!showClientDeals)}
            >
              <span className="font-semibold">Client Deals</span>
            </div>

            {showClientDeals && (
              <div className="absolute top-16 right-44 bg-white text-black shadow-lg rounded w-[350px] z-50">
                <div className="p-3 border-b font-semibold text-lg">
                  Clients Deals Summary
                </div>

                <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                  {clients.map((client) => {
                    const clientDeals = deals.filter(
                      (d) => d.client.toString() === client.clientNumber.toString()
                    );
                    const dealCount = clientDeals.length;

                    const isExpanded =
                      selectedClientDealsList.length > 0 &&
                      selectedClientDealsList[0]?.client.toString() ===
                        client.clientNumber.toString();

                    return (
                      <div
                        key={client.clientNumber}
                        className="border rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                      >
                        {/* Client header */}
                        <div
                          className="flex justify-between items-center p-3 cursor-pointer"
                          onClick={() =>
                            setSelectedClientDealsList(isExpanded ? [] : clientDeals)
                          }
                        >
                          <span className="font-medium">
                            {client.firstName} {client.lastName}
                          </span>
                          <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                            {dealCount}
                          </span>
                        </div>

                        {/* Expanded deals */}
                        {isExpanded && selectedClientDealsList.length > 0 && (
                          <div className="border-t bg-white p-2">
                            <div className="grid grid-cols-3 font-semibold text-sm mb-1">
                              <span>Reference No</span>
                              <span>Date</span>
                              <span>Status</span>
                            </div>

                            {selectedClientDealsList.map((deal) => (
                              <div
                                key={deal._id}
                                className="grid grid-cols-3 text-sm p-1 border-b hover:bg-gray-50 transition"
                              >
                                <span>{deal.ref}</span>
                                <span>
                                  {new Date(deal.date).toLocaleDateString("en-GB")}
                                </span>
                                <span>{deal.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
              <span className="profile-name">
                {user?.fullname || user?.email || "Guest"}
              </span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
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
          Object.entries(uncategorizedCounts).map(([type, count], index) => (
            <div
              key={index}
              className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setGraphCategory("Uncategorised"); // show Uncategorized in graph/cards
                handleCategoryClick("Uncategorised"); // open modal with transactions
                setNotificationOpen(false);
              }}
            >
              <span className="text-gray-500 mr-2">{index + 1}.</span>
              <span className="text-gray-700 font-medium flex-1">{type}</span>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{count}</span>
            </div>
          ))
        ) : (
          <div className="text-black text-center py-3">
            All Transactions Categorised
          </div>
        )}
      </div>
    </div>
  )}
</div>
            </div>
          </div>

          <div className="upload-csv-section">
            <UploadCSV
              onUploadSuccess={() =>
                fetchTransactions().then(fetchAllCategories)
              }
            />
          </div>
          {/* NEW: Total Income & Expense */}
          <div className="total-summary bg-white text-black p-4 rounded shadow-md mb-4 flex justify-between w-full max-w-lg">
            <div>Total Income: £{totalIncome.toLocaleString()}</div>
            <div>Total Expense: £{totalExpense.toLocaleString()}</div>
          </div>

          {showModal && selectedRole && (
            <CreateUser
              role={selectedRole}
              onClose={() => setShowModal(false)}
            />
          )}

          {/* ===== CARDS (ALL transactions, NOT filtered) ===== */}

          <section className="cards text-black w-full h-80 overflow-y-auto flex flex-col gap-4 p-4">
            {(dateRange.from || dateRange.to
              ? [
                  ...new Set(
                    getFilteredTransactions().map(
                      (tx) =>
                        tx.transactionType?.trim() ||
                        tx.category ||
                        "Uncategorized",
                    ),
                  ),
                ]
              : allCategories
            )
              .filter((cat) => cat && cat !== "All")
              .filter((cat) => graphCategory === "All" || cat === graphCategory)
              .map((cat) => {
                const txns = getFilteredTransactions().filter((tx) => {
                  const cats = [
                    tx.transactionType?.trim(),
                    tx.category?.trim(),
                  ].filter(Boolean);
                  return cats.includes(cat);
                });

                const total = txns.reduce(
                  (sum, tx) => sum + Math.abs(tx.amount),
                  0,
                );

                const hasRecentlyUploaded = txns.some((tx) =>
                  recentlyUploadedIds.has(
                    `${tx.transactionDate}-${tx.transactionDescription}-${tx.amount}-${tx.transactionType || "none"}`,
                  ),
                );

                const isUncategorized = cat === "Uncategorized";

                const highlightClass = isUncategorized
                  ? "highlight-uncategorized-card"
                  : hasRecentlyUploaded
                    ? "highlight-uploaded-card"
                    : "";

                return (
                  <div
                    className={`card ${highlightClass} w-full bg-white rounded-lg shadow-md flex flex-col justify-between p-4 cursor-pointer`}
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <div className="card-title">{cat}</div>

                    <div className="card-value">£{total.toLocaleString()}</div>
                  </div>
                );
              })}
          </section>

          {showCategoryModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h2 className="modal-title text-black">
                  Transactions for{" "}
                  {clickedCategoryTransactions[0]?.transactionType ||
                    clickedCategoryTransactions[0]?.category ||
                    "Uncategorized"}
                </h2>
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-black">
                    {clickedCategoryTransactions.map((txn, idx) => (
                      <tr key={idx}>
                        <td>
                          {new Date(txn.transactionDate).toLocaleDateString()}
                        </td>
                        <td>{txn.transactionDescription}</td>
                        <td
                          className={txn.amount >= 0 ? "positive" : "negative"}
                        >
                          £{Math.abs(txn.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="modal-actions">
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== CASHFLOW CHART (FILTERED) ===== */}

          <section className="charts w-full px-4 sm:px-6 lg:px-8">
            <div className="chart-card w-full bg-white rounded-lg shadow-md p-4">
              <div className="chart-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className=" text-black text-2xl font-bold">Cashflow</h2>

                <div className="filters flex flex-wrap gap-2 items-center mb-4">
                  <select
                    title="category-filter"
                    className="years-dropdown text-black border border-gray-400 rounded-md px-2 py-1  min-w-[120px] "
                    value={graphCategory}
                    onChange={(e) => setGraphCategory(e.target.value)}
                  >
                    {allCategories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                    {allCategories
                      .filter((cat) => cat && cat !== "All")
                      .filter(
                        (cat) =>
                          graphCategory === "All" || cat === graphCategory,
                      )
                      .map((cat) => {
                        const txns = getFilteredTransactions().filter((tx) =>
                          [tx.transactionType?.trim(), tx.category].includes(
                            cat,
                          ),
                        );

                        const total = txns.reduce(
                          (sum, tx) => sum + Math.abs(tx.amount),
                          0,
                        );

                        const hasRecentlyUploaded = txns.some((tx) =>
                          recentlyUploadedIds.has(
                            `${tx.transactionDate}-${tx.transactionDescription}-${tx.amount}-${tx.transactionType || "none"}`,
                          ),
                        );

                        const isUncategorized = cat === "Uncategorized";

                        const highlightClass = isUncategorized
                          ? "highlight-uncategorized-card"
                          : hasRecentlyUploaded
                            ? "highlight-uploaded-card"
                            : "";

                        return (
                          <div
                            className={`card ${highlightClass} w-full bg-white rounded-lg shadow-md flex flex-col justify-between p-4 cursor-pointer`}
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                          >
                            <div className="card-title">{cat}</div>
                            <div className="card-value">
                              £{total.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                  </select>
                  <select
                    title="dropdown"
                    className="years-dropdown text-black border border-gray-400 rounded-md px-2 py-1 min-w-[120px] flex-1 sm:flex-auto "
                    value={graphFilter}
                    onChange={(e) => setGraphFilter(e.target.value as any)}
                  >
                    <option value="thisYear">This Year</option>
                    <option value="lastYear">Last Year</option>
                    <option value="month">Month-wise</option>
                    <option value="week">Week-wise</option>
                  </select>
                  {/* MONTH DROPDOWN (NEW) */}
                  <select
                  title="month"
                    className="years-dropdown text-black border border-gray-400 rounded-md px-2 py-1 min-w-[120px] flex-1 sm:flex-auto"
                    value={selectedMonth}
                    onChange={(e) =>
                      setSelectedMonth(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value),
                      )
                    }
                  >
                    <option value="all">All Months</option>
                    <option value="0">Jan</option>
                    <option value="1">Feb</option>
                    <option value="2">Mar</option>
                    <option value="3">Apr</option>
                    <option value="4">May</option>
                    <option value="5">Jun</option>
                    <option value="6">Jul</option>
                    <option value="7">Aug</option>
                    <option value="8">Sep</option>
                    <option value="9">Oct</option>
                    <option value="10">Nov</option>
                    <option value="11">Dec</option>
                  </select>

                  <label className="flex flex-col text-sm flex-1 sm:flex-auto">
                    From:{" "}
                    <input
                      type="date"
                      name="from"
                      value={tempDateRange.from}
                      onChange={handleTempDateChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-full sm:w-auto"
                    />
                  </label>
                  <label className="flex flex-col text-sm flex-1 sm:flex-auto">
                    To:{" "}
                    <input
                      type="date"
                      name="to"
                      value={tempDateRange.to}
                      onChange={handleTempDateChange}
                      className="border border-gray-400 rounded-md px-2 py-1 w-full sm:w-auto"
                    />
                  </label>
                  <button
                    className="bg-blue-600 text-white rounded-md px-3 py-1 hover:bg-blue-700"
                    onClick={applyDateRange}
                  >
                    Apply
                  </button>
                  <button
                    className="bg-gray-300 text-black rounded-md px-3 py-1 hover:bg-gray-400"
                    onClick={resetDateRange}
                  >
                    Reset
                  </button>
                </div>
              </div>
              <canvas id="cashflowChart"></canvas>
            </div>
          </section>

          {/* ===== RECENT TRANSACTIONS ===== */}
          <section className="transactions">
            <h2 className="text-black text-2xl font-bold">
              Recent Transactions
            </h2>
            <table className="text-black ">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                  <th>Category</th>
                </tr>
              </thead>

              <tbody>
                {transactions.slice(0, 5).map((txn, idx) => (
                  <tr key={idx} className="border-b last:border-none">
                    <td className="px-4 py-2 text-left">
                      {txn.transactionDate
                        ? moment(txn.transactionDate).format("DD/MMM/YYYY")
                        : "-"}
                    </td>

                    <td className="px-4 py-2 text-left">
                      {txn.transactionDescription || "-"}
                    </td>

                    <td
                      className={`px-4 py-2 text-right ${
                        Number(txn.amount) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      £
                      {txn.amount !== undefined && txn.amount !== null
                        ? Number(txn.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "0.00"}
                    </td>

                    <td className="px-4 py-2 text-left">
                      {txn.category || txn.transactionType || "Uncategorized"}
                    </td>
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
