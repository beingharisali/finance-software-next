
// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { Chart, registerables } from "chart.js";
// import Link from "next/link";
// import CreateUser from "../../createusers/page"; 

// import "../../cssfiles/admin.css";
// import "../../cssfiles/sidebarcomponents.css";

// Chart.register(...registerables);

// export default function AdminDashboard() {
//   const [showModal, setShowModal] = useState(false);
  
//   const { user, logoutUser } = useAuthContext();
  

//   const [selectedRole, setSelectedRole] = useState<"agent" | "manager" | "broker" | "">("");
// const handleOpenModal = (role: "agent" | "manager" | "broker") => {
//   setSelectedRole(role);
//   setShowModal(true);
// };


//   useEffect(() => {
//     let cashflowChart: Chart | null = null;

//     const cashflowCtx = document.getElementById("cashflowChart") as HTMLCanvasElement;
//     if (cashflowCtx) {
//       cashflowChart = new Chart(cashflowCtx.getContext("2d")!, {
//         type: "bar",
//         data: {
//           labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
//           datasets: [
//             {
//               label: "Income",
//               data: [3000,4000,6000,7000,6500,6300,7000,6000,8000,7200,7500,7800],
//               backgroundColor: '#146985',
//               stack: 'stack1',
//               borderRadius: 8,
//               barPercentage: 0.7
//             },
//             {
//               label: "Expense",
//               data: [-2500,-3000,-4000,-3500,-3200,-3000,-4000,-3500,-3800,-3700,-3600,-4000],
//               backgroundColor: '#000000',
//               stack: 'stack1',
//               borderRadius: 8,
//               barPercentage: 0.7
//             }
//           ]
//         },
//         options: {
//           responsive: true,
//           scales: {
//             y: {
//               stacked: true,
//               beginAtZero: true,
//               ticks: {
//                 callback: (value) => '$' + Math.abs(Number(value)).toLocaleString(),
//                 color: "#000",
//                 font: { weight: "bold" }
//               },
//               grid: { color: '#eee' }
//             },
//             x: {
//               stacked: true,
//               ticks: { color: '#146985', font: { weight: "bold" } },
//               grid: { display: false }
//             }
//           },
//           plugins: {
//             legend: {
//               labels: { color: '#146985', boxWidth: 18, padding: 24, font: { weight: "bold", size: 16 } }
//             },
//             tooltip: {
//               callbacks: {
//                 label: (ctx) => {
//                   const val = Math.abs(ctx.parsed.y as number);
//                   return ctx.dataset.label + ': $' + val.toLocaleString();
//                 }
//               }
//             }
//           }
//         }
//       });
//     }

//     return () => {
//       cashflowChart?.destroy();
//     };
//   }, []);

//   return (
//     <div className="dashboard-container">
//       <nav className="sidebar">
//         <h1>Finance</h1>
//         <div className="nav-list">
//           <Link href="/dashboard/sidebarcomponents" className="nav-item active">Dashboard</Link>
//           <Link href="/dashboard/admin/managerrecord" className="nav-item">Manager Record</Link>
//           <Link href="/dashboard/admin/agentrecord" className="nav-item">Agent Record</Link>
//           <Link href="/dashboard/admin/brokerrecord" className="nav-item">Broker Record</Link>
//           <Link href="/dashboard/sidebarcomponents/transactions" className="nav-item">Transaction</Link>
//           <Link href="/dashboard/sidebarcomponents/payments" className="nav-item">Payment</Link>
//           <Link href="/dashboard/sidebarcomponents/card" className="nav-item">Card</Link>
//           <Link href="/dashboard/sidebarcomponents/insight" className="nav-item">Insights</Link>
//           <Link href="/dashboard/sidebarcomponents/settings" className="nav-item">Settings</Link>
//         </div>
//       </nav>

//       <main className="main-content">
//         <div className="main-top">
//           <h1 className="header">Dashboard</h1>
//           <div className="top-right">
//             <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
//             <button className="logout-btn" onClick={logoutUser}>Logout</button>
//           </div>
//         </div>

//         <div className="register-buttons">
//           <button className="create-user" onClick={() => handleOpenModal("manager")}>Manager Create</button>
//           <button className="create-user" onClick={() => handleOpenModal("broker")}>Broker Create</button>
//           <button className="create-user" onClick={() => handleOpenModal("agent")}>Agent Create</button>
//         </div>

//         {showModal && selectedRole && (
//           <CreateUser role={selectedRole} onClose={() => setShowModal(false)} />
//         )}

//         {/* Cards Section */}
//         <section className="cards">
//           <div className="card">
//             <div className="card-title">Andrew Forbist</div>
//             <div className="card-value">562,000</div>
//             <div className="card-sub">EXP 11/29 | CVV 323</div>
//           </div>
//           <div className="card">
//             <div className="card-title">Total Income</div>
//             <div className="card-value">78,000</div>
//             <div className="card-change positive">+17.8%</div>
//           </div>
//           <div className="card">
//             <div className="card-title">Total Expense</div>
//             <div className="card-value">43,000</div>
//             <div className="card-change negative">-17.8%</div>
//           </div>
//           <div className="card">
//             <div className="card-title">Total Savings</div>
//             <div className="card-value">56,000</div>
//             <div className="card-change positive">+12.4%</div>
//           </div>
//         </section>

//         {/* Charts Section */}
//         <section className="charts">
//           <div className="chart-card">
//             <div className="chart-header">
//               <h2>Cashflow</h2>
//               <select title="year">
//                 <option>This Year</option>
//                 <option>Last Year</option>
//               </select>
//             </div>
//             <canvas id="cashflowChart"></canvas>
//           </div>
//         </section>

//         {/* Recent Transactions */}
//         <section className="transactions">
//           <h2>Recent Transactions</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th><th>Description</th><th>Amount</th><th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr><td>Nov 1</td><td>Salary</td><td className="positive">5,000</td><td>Completed</td></tr>
//               <tr><td>Nov 3</td><td>Groceries</td><td className="negative">320</td><td>Completed</td></tr>
//               <tr><td>Nov 5</td><td>Investment</td><td className="positive">1,200</td><td>Pending</td></tr>
//             </tbody>
//           </table>
//         </section>

//         {/* Saving Plans */}
//         <section className="saving-plans">
//           <div className="plan-card">
//             <h3>Retirement Plan</h3>
//             <p>Invest regularly to save for retirement.</p>
//             <div className="plan-value">12,000</div>
//           </div>
//           <div className="plan-card">
//             <h3>Emergency Fund</h3>
//             <p>Keep a fund for unexpected expenses.</p>
//             <div className="plan-value">5,500</div>
//           </div>
//           <div className="plan-card">
//             <h3>Vacation Fund</h3>
//             <p>Save for your dream vacation.</p>
//             <div className="plan-value">3,200</div>
//           </div>
//         </section>

//         {/* Account Activity */}
//         <section className="activity">
//           <h2>Account Activity</h2>
//           <div className="activity-grid">
//             <div className="activity-card">
//               <div>Transactions Today</div>
//               <div className="activity-value">12</div>
//             </div>
//             <div className="activity-card">
//               <div>New Messages</div>
//               <div className="activity-value">5</div>
//             </div>
//             <div className="activity-card">
//               <div>Pending Approvals</div>
//               <div className="activity-value">2</div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
