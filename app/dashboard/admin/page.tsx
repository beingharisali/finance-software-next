
// // "use client";

// // import React, { useEffect, useState } from "react";
// // import ProtectedRoute from "@/utilies/ProtectedRoute";
// // import { useAuthContext } from "@/context/AuthContext";
// // import { Chart, registerables } from "chart.js";
// // import Link from "next/link";
// // import http from "@/services/http";

// // import CreateUser from "../createusers/page";
// // import UploadCSV from "../admin/uploadcsv/page";

// // import "../../cssfiles/admin.css";
// // import "../../cssfiles/sidebarcomponents.css";
// // import "../../cssfiles/uploadCSV.css";
// // import Sidebar from "@/app/dashboard/components/Sidebar"; 
// // Chart.register(...registerables);

// // interface TransactionType {
// //   transactionDate: string;
// //   transactionDescription: string;
// //   transactionType: string;
// //   amount: number;
// //   sortCode?: string;
// //   accountNumber?: string;
// //   balance?: number;
// // }

// // export default function AdminDashboard() {
// //   const [showModal, setShowModal] = useState(false);
// //   const [transactions, setTransactions] = useState<TransactionType[]>([]);
// //   const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
// //   const [graphFilter, setGraphFilter] = useState<"thisYear" | "lastYear" | "month" | "week">("thisYear");
// //   const { user, logoutUser } = useAuthContext();
// //   const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");

// //   const handleOpenModal = (role: "agent" | "manager" | "broker") => {
// //     setSelectedRole(role);
// //     setShowModal(true);
// //   };

// //   // Fetch transactions
// //   const fetchTransactions = async () => {
// //     try {
// //       const res = await http.get("/transactions");
// //       const data: TransactionType[] = res.data.transactions || [];
// //       data.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
// //       setTransactions(data);
// //     } catch (err) {
// //       console.error("Failed to fetch transactions", err);
// //       setTransactions([]);
// //     }
// //   };

// //   // Calculate totals
// //   const calculateCategoryTotals = () => {
// //     const totals: Record<string, number> = {};
// //     transactions.forEach(txn => {
// //       const val = Math.abs(txn.amount);
// //       const cat = txn.transactionType?.trim() || "Uncategorized";
// //       totals[cat] = (totals[cat] || 0) + val;
// //     });
// //     setCategoryTotals(totals);
// //   };

// //   useEffect(() => {
// //     fetchTransactions();
// //     const interval = setInterval(fetchTransactions, 10000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   useEffect(() => {
// //     if (transactions.length) calculateCategoryTotals();
// //   }, [transactions]);

// //   // Chart rendering
// //   useEffect(() => {
// //     let cashflowChart: Chart | null = null;

// //     const filteredTransactions = transactions.filter(txn => {
// //       const txnDate = new Date(txn.transactionDate);
// //       const currentYear = new Date().getFullYear();
// //       switch (graphFilter) {
// //         case "thisYear": return txnDate.getFullYear() === currentYear;
// //         case "lastYear": return txnDate.getFullYear() === currentYear - 1;
// //         case "month": return txnDate.getFullYear() === currentYear;
// //         case "week": return txnDate.getFullYear() === currentYear;
// //         default: return true;
// //       }
// //     });

// //     const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// //     const incomePerMonth = Array(12).fill(0);
// //     const expensePerMonth = Array(12).fill(0);
// //     const incomePerWeek = Array(52).fill(0);
// //     const expensePerWeek = Array(52).fill(0);

// //     filteredTransactions.forEach(txn => {
// //       const txnDate = new Date(txn.transactionDate);
// //       const monthIdx = txnDate.getMonth();
// //       const weekIdx = Math.floor((txnDate.getTime() - new Date(txnDate.getFullYear(),0,1).getTime())/(7*24*60*60*1000));
// //       if (txn.amount >= 0) {
// //         incomePerMonth[monthIdx] += txn.amount;
// //         incomePerWeek[weekIdx] += txn.amount;
// //       } else {
// //         expensePerMonth[monthIdx] += Math.abs(txn.amount);
// //         expensePerWeek[weekIdx] += Math.abs(txn.amount);
// //       }
// //     });

// //     const cashflowCtx = document.getElementById("cashflowChart") as HTMLCanvasElement;
// //     if (cashflowCtx) {
// //       const labels = graphFilter === "week" ? Array.from({length: 52}, (_, i) => `W${i+1}`) :
// //                      graphFilter === "month" ? months : months;
// //       const incomeData = graphFilter === "week" ? incomePerWeek : incomePerMonth;
// //       const expenseData = graphFilter === "week" ? expensePerWeek : expensePerMonth;

// //       cashflowChart = new Chart(cashflowCtx.getContext("2d")!, {
// //         type: "bar",
// //         data: {
// //           labels,
// //           datasets: [
// //             { label: "Income", data: incomeData, backgroundColor: '#146985', stack: 'stack1', borderRadius: 8, barPercentage: 0.7 },
// //             { label: "Expense", data: expenseData, backgroundColor: '#ff4d4f', stack: 'stack1', borderRadius: 8, barPercentage: 0.7 }
// //           ]
// //         },
// //         options: {
// //           responsive: true,
// //           scales: { y: { stacked: true, beginAtZero: true, ticks: { callback: (v) => Number(v).toLocaleString() } }, x: { stacked: true } }
// //         }
// //       });
// //     }

// //     return () => { cashflowChart?.destroy(); };
// //   }, [transactions, graphFilter]);

// //   return (
// //     <ProtectedRoute allowedRoles={["admin"]}>
// //       <div className="dashboard-container">
// //           <Sidebar activePage="Dashboard" />


// //         <main className="main-content">
// //           <div className="main-top">
// //             <h1 className="header">Dashboard</h1>
// //             <div className="top-right">
// //               <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
// //               <button className="logout-btn" onClick={logoutUser}>Logout</button>
// //             </div>
// //           </div>

// //           {/* CSV Upload */}
// //           {/* csv upload */}
// //           <div className="upload-csv-section">
// //             <UploadCSV onUploadSuccess={fetchTransactions} />
// //           </div>

      

// //           {showModal && selectedRole && (
// //             <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
// //           )}

// //           {/* Cards Section */}
// //           <section className="cards">
// //             {Object.entries(categoryTotals).map(([cat, total], idx) => (
// //               <div className="card" key={idx}>
// //                 <div className="card-title">{cat}</div>
// //                 <div className="card-value">{total.toLocaleString()}</div>
// //               </div>
// //             ))}
// //           </section>

// //           {/* Charts Section */}
// //           <section className="charts">
// //             <div className="chart-card">
// //               <div className="chart-header">
// //                 <h2>Cashflow</h2>
// //                 <select title="graph" value={graphFilter} onChange={(e) => setGraphFilter(e.target.value as any)}>
// //                   <option value="thisYear">This Year</option>
// //                   <option value="lastYear">Last Year</option>
// //                   <option value="month">Month-wise</option>
// //                   <option value="week">Week-wise</option>
// //                 </select>
// //               </div>
// //               <canvas id="cashflowChart"></canvas>
// //             </div>
// //           </section>

// //           {/* Recent Transactions */}
// //           <section className="transactions">
// //             <h2>Recent Transactions</h2>
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>Date</th><th>Description</th><th>Amount</th><th>Category</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {transactions.slice(0, 5).map((txn, idx) => (
// //                   <tr key={idx}>
// //                     <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
// //                     <td>{txn.transactionDescription}</td>
// //                     <td className={txn.amount >= 0 ? "positive" : "negative"}>{Math.abs(txn.amount).toLocaleString()}</td>
// //                     <td>{txn.transactionType || "Uncategorized"}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </section>
// //         </main>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }
// // "use client";

// // import React, { useEffect, useState } from "react";
// // import ProtectedRoute from "@/utilies/ProtectedRoute";
// // import { useAuthContext } from "@/context/AuthContext";
// // import { Chart, registerables } from "chart.js";
// // import http from "@/services/http";

// // import CreateUser from "../createusers/page";
// // import UploadCSV from "../admin/uploadcsv/page";

// // import "../../cssfiles/admin.css";
// // import "../../cssfiles/sidebarcomponents.css";
// // import "../../cssfiles/uploadCSV.css";
// // import Sidebar from "@/app/dashboard/components/Sidebar"; 
// // Chart.register(...registerables);

// // interface TransactionType {
// //   transactionDate: string;
// //   transactionDescription: string;
// //   transactionType: string;
// //   amount: number;
// // }

// // export default function AdminDashboard() {
// //   const [showModal, setShowModal] = useState(false);
// //   const [transactions, setTransactions] = useState<TransactionType[]>([]);
// //   const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
// //   const [graphFilter, setGraphFilter] = useState<"thisYear" | "lastYear" | "month" | "week">("thisYear");

// //   const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
// //   const [tempDateRange, setTempDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

// //   const { user, logoutUser } = useAuthContext();
// //   const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");

// //   const handleOpenModal = (role: "agent" | "manager" | "broker") => {
// //     setSelectedRole(role);
// //     setShowModal(true);
// //   };

// //   const handleTempDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setTempDateRange(prev => ({ ...prev, [name]: value }));
// //   };

// //   const applyDateRange = () => {
// //     setDateRange({ ...tempDateRange });
// //   };

// //   const fetchTransactions = async () => {
// //     try {
// //       const res = await http.get("/transactions");
// //       const data: TransactionType[] = res.data.transactions || [];
// //       data.sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
// //       setTransactions(data);
// //     } catch (err) {
// //       console.error("Failed to fetch transactions", err);
// //       setTransactions([]);
// //     }
// //   };

// //   const calculateCategoryTotals = () => {
// //     const totals: Record<string, number> = {};
// //     transactions.forEach(txn => {
// //       const txnDate = new Date(txn.transactionDate);
// //       let include = true;
// //       if (dateRange.from) include = include && txnDate >= new Date(dateRange.from);
// //       if (dateRange.to) include = include && txnDate <= new Date(dateRange.to);
// //       if (!include) return;

// //       const val = Math.abs(txn.amount);
// //       const cat = txn.transactionType?.trim() || "Uncategorized";
// //       totals[cat] = (totals[cat] || 0) + val;
// //     });
// //     setCategoryTotals(totals);
// //   };

// //   useEffect(() => {
// //     fetchTransactions();
// //     const interval = setInterval(fetchTransactions, 10000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   useEffect(() => {
// //     calculateCategoryTotals();
// //   }, [transactions, dateRange]);

// //   useEffect(() => {
// //     let cashflowChart: Chart | null = null;

// //     const filteredTransactions = transactions.filter(txn => {
// //       const txnDate = new Date(txn.transactionDate);
// //       let include = true;
// //       if (dateRange.from) include = include && txnDate >= new Date(dateRange.from);
// //       if (dateRange.to) include = include && txnDate <= new Date(dateRange.to);
// //       return include;
// //     });

// //     if (!filteredTransactions.length) return;

// //     // Determine labels: daily if <= 31 days, monthly otherwise
// //     const fromDate = dateRange.from ? new Date(dateRange.from) : new Date(filteredTransactions[0].transactionDate);
// //     const toDate = dateRange.to ? new Date(dateRange.to) : new Date(filteredTransactions[filteredTransactions.length - 1].transactionDate);
// //     const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));

// //     let labels: string[] = [];
// //     let incomeData: number[] = [];
// //     let expenseData: number[] = [];

// //     if (diffDays <= 31) {
// //       // daily
// //       const dayMap: Record<string, { income: number; expense: number }> = {};
// //       for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
// //         const label = d.toISOString().split("T")[0];
// //         labels.push(label);
// //         dayMap[label] = { income: 0, expense: 0 };
// //       }
// //       filteredTransactions.forEach(txn => {
// //         const label = new Date(txn.transactionDate).toISOString().split("T")[0];
// //         if (txn.amount >= 0) dayMap[label].income += txn.amount;
// //         else dayMap[label].expense += txn.amount; // keep negative for downward bar
// //       });
// //       labels.forEach(l => {
// //         incomeData.push(dayMap[l].income);
// //         expenseData.push(-dayMap[l].expense); // negative for downward
// //       });
// //     } else {
// //       // monthly
// //       const monthMap: Record<string, { income: number; expense: number }> = {};
// //       let d = new Date(fromDate);
// //       while (d <= toDate) {
// //         const label = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}`;
// //         labels.push(label);
// //         monthMap[label] = { income: 0, expense: 0 };
// //         d.setMonth(d.getMonth() + 1);
// //       }
// //       filteredTransactions.forEach(txn => {
// //         const td = new Date(txn.transactionDate);
// //         const label = `${td.getFullYear()}-${("0" + (td.getMonth() + 1)).slice(-2)}`;
// //         if (txn.amount >= 0) monthMap[label].income += txn.amount;
// //         else monthMap[label].expense += txn.amount;
// //       });
// //       labels.forEach(l => {
// //         incomeData.push(monthMap[l].income);
// //         expenseData.push(-monthMap[l].expense); // negative for downward
// //       });
// //     }

// //     const ctx = document.getElementById("cashflowChart") as HTMLCanvasElement;
// //     if (ctx) {
// //       cashflowChart = new Chart(ctx.getContext("2d")!, {
// //         type: "bar",
// //         data: {
// //           labels,
// //           datasets: [
// //             { label: "Income", data: incomeData, backgroundColor: "#146985", stack: "stack1", borderRadius: 4 },
// //             { label: "Expense", data: expenseData, backgroundColor: "#ff4d4f", stack: "stack1", borderRadius: 4 }
// //           ]
// //         },
// //         options: {
// //           responsive: true,
// //           scales: {
// //             y: {
// //               stacked: true,
// //               ticks: {
// //                 callback: (value) => Math.abs(Number(value)).toLocaleString()
// //               }
// //             },
// //             x: { stacked: true }
// //           }
// //         }
// //       });
// //     }

// //     return () => cashflowChart?.destroy();
// //   }, [transactions, dateRange, graphFilter]);

// //   return (
// //     <ProtectedRoute allowedRoles={["admin"]}>
// //       <div className="dashboard-container">
// //         <Sidebar activePage="Dashboard" />

// //         <main className="main-content">
// //           <div className="main-top">
// //             <h1 className="header">Dashboard</h1>
// //             <div className="top-right">
// //               <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
// //               <button className="logout-btn" onClick={logoutUser}>Logout</button>
// //             </div>
// //           </div>

// //           <div className="upload-csv-section">
// //             <UploadCSV onUploadSuccess={fetchTransactions} />
// //           </div>

// //           {showModal && selectedRole && (
// //             <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
// //           )}

// //           <section className="cards">
// //             {Object.entries(categoryTotals).map(([cat, total], idx) => (
// //               <div className="card" key={idx}>
// //                 <div className="card-title">{cat}</div>
// //                 <div className="card-value">{total.toLocaleString()}</div>
// //               </div>
// //             ))}
// //           </section>

// //           <section className="charts">
// //             <div className="chart-card">
// //               <div className="chart-header">
// //                 <h2>Cashflow</h2>
// //                 <div className="filters">
// //                   <select title="graph" value={graphFilter} onChange={e => setGraphFilter(e.target.value as any)}>
// //                     <option value="thisYear">This Year</option>
// //                     <option value="lastYear">Last Year</option>
// //                     <option value="month">Month-wise</option>
// //                     <option value="week">Week-wise</option>
// //                   </select>

// //                   <label>From: <input type="date" name="from" value={tempDateRange.from} onChange={handleTempDateChange} /></label>
// //                   <label>To: <input type="date" name="to" value={tempDateRange.to} onChange={handleTempDateChange} /></label>
// //                   <button onClick={applyDateRange}>Apply</button>
// //                 </div>
// //               </div>
// //               <canvas id="cashflowChart"></canvas>
// //             </div>
// //           </section>

// //           <section className="transactions">
// //             <h2>Recent Transactions</h2>
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>Date</th><th>Description</th><th>Amount</th><th>Category</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {transactions.slice(0, 5).map((txn, idx) => (
// //                   <tr key={idx}>
// //                     <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
// //                     <td>{txn.transactionDescription}</td>
// //                     <td className={txn.amount >= 0 ? "positive" : "negative"}>{Math.abs(txn.amount).toLocaleString()}</td>
// //                     <td>{txn.transactionType || "Uncategorized"}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </section>
// //         </main>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }
// // "use client";

// // import React, { useEffect, useState } from "react";
// // import ProtectedRoute from "@/utilies/ProtectedRoute";
// // import { useAuthContext } from "@/context/AuthContext";
// // import { Chart, registerables } from "chart.js";
// // import http from "@/services/http";

// // import CreateUser from "../createusers/page";
// // import UploadCSV from "../admin/uploadcsv/page";

// // import "../../cssfiles/admin.css";
// // import "../../cssfiles/sidebarcomponents.css";
// // import "../../cssfiles/uploadCSV.css";
// // import Sidebar from "@/app/dashboard/components/Sidebar"; 
// // Chart.register(...registerables);

// // interface TransactionType {
// //   transactionDate: string;
// //   transactionDescription: string;
// //   transactionType: string;
// //   amount: number;
// // }

// // export default function AdminDashboard() {
// //   const [showModal, setShowModal] = useState(false);
// //   const [transactions, setTransactions] = useState<TransactionType[]>([]);
// //   const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
// //   const [graphFilter, setGraphFilter] = useState<"thisYear" | "lastYear" | "month" | "week">("thisYear");

// //   const { user, logoutUser } = useAuthContext();
// //   const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");

// //   // Date filter state
// //   const [tempDateRange, setTempDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
// //   const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

// //   const handleOpenModal = (role: "agent" | "manager" | "broker") => {
// //     setSelectedRole(role);
// //     setShowModal(true);
// //   };

// //   const handleTempDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setTempDateRange(prev => ({ ...prev, [name]: value }));
// //   };

// //   const applyDateRange = () => {
// //     setDateRange({ ...tempDateRange });
// //   };

// //   const resetDateRange = () => {
// //     setDateRange({ from: "", to: "" });
// //     setTempDateRange({ from: "", to: "" });
// //   };

// //   // Fetch transactions from backend
// //   const fetchTransactions = async () => {
// //     try {
// //       const res = await http.get("/transactions");
// //       const data: TransactionType[] = res.data.transactions || [];
// //       data.sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
// //       setTransactions(data);
// //     } catch (err) {
// //       console.error("Failed to fetch transactions", err);
// //       setTransactions([]);
// //     }
// //   };

// //   // Calculate category totals based on current date range
// //   const calculateCategoryTotals = () => {
// //     const totals: Record<string, number> = {};
// //     transactions.forEach(txn => {
// //       const txnDate = new Date(txn.transactionDate);
// //       let include = true;
// //       if (dateRange.from) include = include && txnDate >= new Date(dateRange.from);
// //       if (dateRange.to) include = include && txnDate <= new Date(dateRange.to);
// //       if (!include) return;

// //       const val = Math.abs(txn.amount);
// //       const cat = txn.transactionType?.trim() || "Uncategorized";
// //       totals[cat] = (totals[cat] || 0) + val;
// //     });
// //     setCategoryTotals(totals);
// //   };

// //   useEffect(() => {
// //     fetchTransactions();
// //     const interval = setInterval(fetchTransactions, 10000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   useEffect(() => {
// //     calculateCategoryTotals();
// //   }, [transactions, dateRange]);

// //   // Render cashflow chart
// //   useEffect(() => {
// //     let cashflowChart: Chart | null = null;

// //     const filteredTransactions = transactions.filter(txn => {
// //       const txnDate = new Date(txn.transactionDate);
// //       let include = true;
// //       if (dateRange.from) include = include && txnDate >= new Date(dateRange.from);
// //       if (dateRange.to) include = include && txnDate <= new Date(dateRange.to);
// //       return include;
// //     });

// //     if (!filteredTransactions.length) return;

// //     // Group transactions by exact date
// //     const dateMap: Record<string, { income: number; expense: number }> = {};
// //     filteredTransactions.forEach(txn => {
// //       const dateKey = new Date(txn.transactionDate).toISOString().split("T")[0];
// //       if (!dateMap[dateKey]) dateMap[dateKey] = { income: 0, expense: 0 };
// //       if (txn.amount >= 0) dateMap[dateKey].income += txn.amount;
// //       else dateMap[dateKey].expense += Math.abs(txn.amount); // store as positive
// //     });

// //     const labels = Object.keys(dateMap).sort();
// //     const incomeData = labels.map(l => dateMap[l].income);
// //     const expenseData = labels.map(l => -dateMap[l].expense); // negative for downward flow

// //     const maxIncome = Math.max(...incomeData);
// //     const maxExpense = Math.max(...expenseData.map(v => Math.abs(v)));

// //     const ctx = document.getElementById("cashflowChart") as HTMLCanvasElement;
// //     if (ctx) {
// //       cashflowChart = new Chart(ctx.getContext("2d")!, {
// //         type: "bar",
// //         data: {
// //           labels,
// //           datasets: [
// //             { label: "Income", data: incomeData, backgroundColor: "#146985", stack: "stack1", borderRadius: 4 },
// //             { label: "Expense", data: expenseData, backgroundColor: "#ff4d4f", stack: "stack1", borderRadius: 4 }
// //           ]
// //         },
// //         options: {
// //           responsive: true,
// //           scales: {
// //             y: {
// //               stacked: true,
// //               min: -maxExpense * 1.2,
// //               max: maxIncome * 1.2,
// //               ticks: {
// //                 callback: (v) => Math.abs(Number(v)).toLocaleString()
// //               }
// //             },
// //             x: { stacked: true }
// //           },
// //           plugins: {
// //             tooltip: {
// //               callbacks: {
// //                 label: function (context) {
// //                   const val = context.raw as number;
// //                   return `${context.dataset.label}: ${Math.abs(val).toLocaleString()}`;
// //                 }
// //               }
// //             }
// //           }
// //         }
// //       });
// //     }

// //     return () => cashflowChart?.destroy();
// //   }, [transactions, dateRange, graphFilter]);

// //   return (
// //     <ProtectedRoute allowedRoles={["admin"]}>
// //       <div className="dashboard-container">
// //         <Sidebar activePage="Dashboard" />

// //         <main className="main-content">
// //           <div className="main-top">
// //             <h1 className="header">Dashboard</h1>
// //             <div className="top-right">
// //               <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
// //               <button className="logout-btn" onClick={logoutUser}>Logout</button>
// //             </div>
// //           </div>

// //           <div className="upload-csv-section">
// //             <UploadCSV onUploadSuccess={fetchTransactions} />
// //           </div>

// //           {showModal && selectedRole && (
// //             <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
// //           )}

// //           <section className="cards">
// //             {Object.entries(categoryTotals).map(([cat, total], idx) => (
// //               <div className="card" key={idx}>
// //                 <div className="card-title">{cat}</div>
// //                 <div className="card-value">{total.toLocaleString()}</div>
// //               </div>
// //             ))}
// //           </section>

// //           <section className="charts">
// //             <div className="chart-card">
// //               <div className="chart-header">
// //                 <h2>Cashflow</h2>
// //                 <div className="filters">
// //                   {/* <select title="graph" value={graphFilter} onChange={e => setGraphFilter(e.target.value as any)}>
// //                     <option value="thisYear">This Year</option>
// //                     <option value="lastYear">Last Year</option>
// //                     <option value="month">Month-wise</option>
// //                     <option value="week">Week-wise</option>
// //                   </select> */}

// //                   <label>From: <input type="date" name="from" value={tempDateRange.from} onChange={handleTempDateChange} /></label>
// //                   <label>To: <input type="date" name="to" value={tempDateRange.to} onChange={handleTempDateChange} /></label>
// //                   <button onClick={applyDateRange}>Apply</button>
// //                   <button onClick={resetDateRange}>Reset</button>
// //                 </div>
// //               </div>
// //               <canvas id="cashflowChart"></canvas>
// //             </div>
// //           </section>

// //           <section className="transactions">
// //             <h2>Recent Transactions</h2>
// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>Date</th><th>Description</th><th>Amount</th><th>Category</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {transactions.slice(0, 5).map((txn, idx) => (
// //                   <tr key={idx}>
// //                     <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
// //                     <td>{txn.transactionDescription}</td>
// //                     <td className={txn.amount >= 0 ? "positive" : "negative"}>{Math.abs(txn.amount).toLocaleString()}</td>
// //                     <td>{txn.transactionType || "Uncategorized"}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </section>
// //         </main>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }
// "use client";

// import React, { useEffect, useState } from "react";
// import ProtectedRoute from "@/utilies/ProtectedRoute";
// import { useAuthContext } from "@/context/AuthContext";
// import { Chart, registerables } from "chart.js";
// import http from "@/services/http";

// import CreateUser from "../createusers/page";
// import UploadCSV from "../admin/uploadcsv/page";

// import "../../cssfiles/admin.css";
// import "../../cssfiles/sidebarcomponents.css";
// import "../../cssfiles/uploadCSV.css";
// import Sidebar from "@/app/dashboard/components/Sidebar"; 
// Chart.register(...registerables);

// interface TransactionType {
//   transactionDate: string;
//   transactionDescription: string;
//   transactionType: string;
//   amount: number;
// }

// export default function AdminDashboard() {
//   const [showModal, setShowModal] = useState(false);
//   const [transactions, setTransactions] = useState<TransactionType[]>([]);
//   const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
//   const [graphFilter, setGraphFilter] = useState<"thisYear" | "lastYear" | "month" | "week" | "none">("thisYear");

//   const { user, logoutUser } = useAuthContext();
//   const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");

//   // Date filter state
//   const [tempDateRange, setTempDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
//   const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

//   const handleOpenModal = (role: "agent" | "manager" | "broker") => {
//     setSelectedRole(role);
//     setShowModal(true);
//   };

//   const handleTempDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setTempDateRange(prev => ({ ...prev, [name]: value }));
//   };

//   const applyDateRange = () => {
//     setDateRange({ ...tempDateRange });
//     setGraphFilter("none"); // prioritize calendar range
//   };

//   const resetDateRange = () => {
//     setDateRange({ from: "", to: "" });
//     setTempDateRange({ from: "", to: "" });
//     setGraphFilter("thisYear");
//   };

//   // Fetch transactions from backend
//   const fetchTransactions = async () => {
//     try {
//       const res = await http.get("/transactions");
//       const data: TransactionType[] = res.data.transactions || [];
//       data.sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
//       setTransactions(data);
//     } catch (err) {
//       console.error("Failed to fetch transactions", err);
//       setTransactions([]);
//     }
//   };

//   // Calculate category totals
//   const calculateCategoryTotals = () => {
//     const totals: Record<string, number> = {};
//     const nowYear = new Date().getFullYear();

//     transactions.forEach(txn => {
//       const txnDate = new Date(txn.transactionDate);

//       // Calendar filter
//       if (dateRange.from && txnDate < new Date(dateRange.from)) return;
//       if (dateRange.to && txnDate > new Date(dateRange.to)) return;

//       // Graph filter
//       if (!dateRange.from && !dateRange.to) {
//         switch (graphFilter) {
//           case "thisYear": if (txnDate.getFullYear() !== nowYear) return; break;
//           case "lastYear": if (txnDate.getFullYear() !== nowYear - 1) return; break;
//           case "month": if (txnDate.getFullYear() !== nowYear) return; break;
//           case "week": if (txnDate.getFullYear() !== nowYear) return; break;
//           case "none": break;
//         }
//       }

//       const cat = txn.transactionType?.trim() || "Uncategorized";
//       totals[cat] = (totals[cat] || 0) + Math.abs(txn.amount);
//     });

//     setCategoryTotals(totals);
//   };

//   useEffect(() => {
//     fetchTransactions();
//     const interval = setInterval(fetchTransactions, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     calculateCategoryTotals();
//   }, [transactions, dateRange, graphFilter]);

//   // Render cashflow chart
//   useEffect(() => {
//     let chart: Chart | null = null;
//     const now = new Date();
//     const nowYear = now.getFullYear();

//     const filtered = transactions.filter(txn => {
//       const txnDate = new Date(txn.transactionDate);

//       // Apply calendar filter first
//       if (dateRange.from && txnDate < new Date(dateRange.from)) return false;
//       if (dateRange.to && txnDate > new Date(dateRange.to)) return false;

//       // Graph filter (only if calendar filter not used)
//       if (!dateRange.from && !dateRange.to && graphFilter !== "none") {
//         switch (graphFilter) {
//           case "thisYear": if (txnDate.getFullYear() !== nowYear) return false; break;
//           case "lastYear": if (txnDate.getFullYear() !== nowYear - 1) return false; break;
//           case "month": if (txnDate.getFullYear() !== nowYear) return false; break;
//           case "week": if (txnDate.getFullYear() !== nowYear) return false; break;
//         }
//       }

//       return true;
//     });

//     const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//     const incomeMonth = Array(12).fill(0);
//     const expenseMonth = Array(12).fill(0);
//     const incomeWeek = Array(52).fill(0);
//     const expenseWeek = Array(52).fill(0);

//     filtered.forEach(txn => {
//       const d = new Date(txn.transactionDate);
//       const m = d.getMonth();
//       const w = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (7 * 86400 * 1000));

//       if (txn.amount >= 0) {
//         incomeMonth[m] += txn.amount;
//         incomeWeek[w] += txn.amount;
//       } else {
//         expenseMonth[m] += Math.abs(txn.amount);
//         expenseWeek[w] += Math.abs(txn.amount);
//       }
//     });

//     const ctx = document.getElementById("cashflowChart") as HTMLCanvasElement;
//     if (ctx) {
//       const labels = graphFilter === "week" ? Array.from({ length: 52 }, (_, i) => `W${i+1}`) :
//                      graphFilter === "month" ? months : months;
//       const incomeData = graphFilter === "week" ? incomeWeek : incomeMonth;
//       const expenseData = graphFilter === "week" ? expenseWeek : expenseMonth;

//       chart = new Chart(ctx, {
//         type: "bar",
//         data: {
//           labels,
//           datasets: [
//             { label: "Income", data: incomeData, backgroundColor: "#146985", stack: "stack1", borderRadius: 4 },
//             { label: "Expense", data: expenseData.map(v => -v), backgroundColor: "#ff4d4f", stack: "stack1", borderRadius: 4 }
//           ]
//         },
//         options: {
//           responsive: true,
//           scales: {
//             y: {
//               stacked: true,
//               min: -Math.max(...expenseData) * 1.2,
//               max: Math.max(...incomeData) * 1.2,
//               ticks: {
//                 callback: (v) => Math.abs(Number(v)).toLocaleString()
//               }
//             },
//             x: { stacked: true }
//           },
//           plugins: {
//             tooltip: {
//               callbacks: {
//                 label: (context) => `${context.dataset.label}: ${Math.abs(context.raw as number).toLocaleString()}`
//               }
//             }
//           }
//         }
//       });
//     }

//     return () => chart?.destroy();
//   }, [transactions, dateRange, graphFilter]);

//   return (
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <div className="dashboard-container">
//         <Sidebar activePage="Dashboard" />

//         <main className="main-content">
//           <div className="main-top">
//             <h1 className="header">Dashboard</h1>
//             <div className="top-right">
//               <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
//               <button className="logout-btn" onClick={logoutUser}>Logout</button>
//             </div>
//           </div>

//           <div className="upload-csv-section">
//             <UploadCSV onUploadSuccess={fetchTransactions} />
//           </div>

//           {showModal && selectedRole && (
//             <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
//           )}

//           {/* ===== CARDS ===== */}
//           <section className="cards">
//             {Object.entries(categoryTotals).map(([cat, total], idx) => (
//               <div className="card" key={idx}>
//                 <div className="card-title">{cat}</div>
//                 <div className="card-value">{total.toLocaleString()}</div>
//               </div>
//             ))}
//           </section>

//           {/* ===== CASHFLOW CHART ===== */}
//           <section className="charts">
//             <div className="chart-card">
//               <div className="chart-header">
//                 <h2>Cashflow</h2>
//                 <div className="filters">
//                   <select value={graphFilter} onChange={e => setGraphFilter(e.target.value as any)}>
//                     <option value="thisYear">This Year</option>
//                     <option value="lastYear">Last Year</option>
//                     <option value="month">Month-wise</option>
//                     <option value="week">Week-wise</option>
//                     <option value="none">By Date Range</option>
//                   </select>

//                   <label>From: <input type="date" name="from" value={tempDateRange.from} onChange={handleTempDateChange} /></label>
//                   <label>To: <input type="date" name="to" value={tempDateRange.to} onChange={handleTempDateChange} /></label>
//                   <button onClick={applyDateRange}>Apply</button>
//                   <button onClick={resetDateRange}>Reset</button>
//                 </div>
//               </div>
//               <canvas id="cashflowChart"></canvas>
//             </div>
//           </section>

//           {/* ===== RECENT TRANSACTIONS ===== */}
//           <section className="transactions">
//             <h2>Recent Transactions</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Date</th><th>Description</th><th>Amount</th><th>Category</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactions.slice(0,5).map((txn, idx) => (
//                   <tr key={idx}>
//                     <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
//                     <td>{txn.transactionDescription}</td>
//                     <td className={txn.amount >=0 ? "positive" : "negative"}>{Math.abs(txn.amount).toLocaleString()}</td>
//                     <td>{txn.transactionType || "Uncategorized"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </section>
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }


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
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [graphFilter, setGraphFilter] = useState<"thisYear" | "lastYear" | "month" | "week" | "none">("thisYear");

  const { user, logoutUser } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");

  // Date filter state for chart only
  const [tempDateRange, setTempDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });

  const handleOpenModal = (role: "agent" | "manager" | "broker") => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleTempDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDateRange(prev => ({ ...prev, [name]: value }));
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
      data.sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    }
  };

  // Calculate category totals for cards (ALL transactions, no filter)
  const calculateCategoryTotals = () => {
    const totals: Record<string, number> = {};
    transactions.forEach(txn => {
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

    const filtered = transactions.filter(txn => {
      const txnDate = new Date(txn.transactionDate);

      // Calendar filter
      if (dateRange.from && txnDate < new Date(dateRange.from)) return false;
      if (dateRange.to && txnDate > new Date(dateRange.to)) return false;

      // Graph filter
      if (!dateRange.from && !dateRange.to && graphFilter !== "none") {
        switch (graphFilter) {
          case "thisYear": if (txnDate.getFullYear() !== nowYear) return false; break;
          case "lastYear": if (txnDate.getFullYear() !== nowYear - 1) return false; break;
          case "month": if (txnDate.getFullYear() !== nowYear) return false; break;
          case "week": if (txnDate.getFullYear() !== nowYear) return false; break;
        }
      }
      return true;
    });

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const incomeMonth = Array(12).fill(0);
    const expenseMonth = Array(12).fill(0);
    const incomeWeek = Array(52).fill(0);
    const expenseWeek = Array(52).fill(0);

    filtered.forEach(txn => {
      const d = new Date(txn.transactionDate);
      const m = d.getMonth();
      const w = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (7 * 86400 * 1000));

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
      const labels = graphFilter === "week" ? Array.from({ length: 52 }, (_, i) => `W${i+1}`) :
                     graphFilter === "month" ? months : months;
      const incomeData = graphFilter === "week" ? incomeWeek : incomeMonth;
      const expenseData = graphFilter === "week" ? expenseWeek : expenseMonth;

      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Income", data: incomeData, backgroundColor: "#146985", stack: "stack1", borderRadius: 4 },
            { label: "Expense", data: expenseData.map(v => -v), backgroundColor: "#ff4d4f", stack: "stack1", borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              stacked: true,
              min: -Math.max(...expenseData) * 1.2,
              max: Math.max(...incomeData) * 1.2,
              ticks: {
                callback: (v) => Math.abs(Number(v)).toLocaleString()
              }
            },
            x: { stacked: true }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${Math.abs(context.raw as number).toLocaleString()}`
              }
            }
          }
        }
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
              <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
              <button className="logout-btn" onClick={logoutUser}>Logout</button>
            </div>
          </div>

          <div className="upload-csv-section">
            <UploadCSV onUploadSuccess={fetchTransactions} />
          </div>

          {showModal && selectedRole && (
            <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
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
                  <select value={graphFilter} onChange={e => setGraphFilter(e.target.value as any)}>
                    <option value="thisYear">This Year</option>
                    <option value="lastYear">Last Year</option>
                    <option value="month">Month-wise</option>
                    <option value="week">Week-wise</option>
                    <option value="none">By Date Range</option>
                  </select>

                  <label>From: <input type="date" name="from" value={tempDateRange.from} onChange={handleTempDateChange} /></label>
                  <label>To: <input type="date" name="to" value={tempDateRange.to} onChange={handleTempDateChange} /></label>
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
                  <th>Date</th><th>Description</th><th>Amount</th><th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0,5).map((txn, idx) => (
                  <tr key={idx}>
                    <td>{new Date(txn.transactionDate).toLocaleDateString()}</td>
                    <td>{txn.transactionDescription}</td>
                    <td className={txn.amount >=0 ? "positive" : "negative"}>{Math.abs(txn.amount).toLocaleString()}</td>
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
// last