
// // "use client";
// // import React, { useEffect, useState } from "react";
// // import { useAuthContext } from "@/context/AuthContext";
// // import { fetchUsers } from "@/services/user.api";
// // import type { User } from "@/types/user";
// // import Link from "next/link";
// // import "../../../cssfiles/record.css";
// // import "../../../cssfiles/sidebarcomponents.css";
// // import Sidebar from "@/app/dashboard/components/Sidebar"; // Import Sidebar

// // export default function ManagerAgentRecord() {
// //   const { user, logoutUser } = useAuthContext();
// //   const [agents, setAgents] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const loadAgents = async () => {
// //       try {
// //         if (user) {
// //           const users = await fetchUsers("agent"); // fetch only agents
// //           setAgents(users);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching agents:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadAgents();
// //   }, [user]);

// //   if (!user) return <p>Loading...</p>;

// //   return (
// //     <div className="dashboard-container">
// //       {/* Sidebar */}
// //       <nav className="sidebar">
// //         <h1>Finance</h1>
// //         <div className="nav-list">
// //           <Link href="/dashboard/managers" className="nav-item"> Dashboard </Link>
// //           <Link href="/dashboard/managers/manageragentrecord" className="nav-item active">  Agent Record  </Link>
// //           <Link href="/dashboard/managers/managerbrokerrecord" className="nav-item">Broker Record  </Link>
// //           <Link href="/dashboard/managers/team" className="nav-item">  Team  </Link>
// //           <Link href="/dashboard/sidebarcomponent/transaction" className="nav-item">  Transactions </Link>
// //           <Link href="/dashboard/managers/reports" className="nav-item">  Reports </Link>
// //           <Link href="/dashboard/sidebarcomponents/settings" className="nav-item">Settings </Link>
// //         </div>
// //       </nav>

// //       {/* Main Content */}
// //       <main className="main-content">
// //         <div className="main-top">
// //           <h1 className="header">Agent Records</h1>
// //           <div className="top-right">
// //             <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
// //             <button className="logout-btn" onClick={logoutUser}>Logout</button>
// //           </div>
// //         </div>

// //         {/* Records Table */}
// //         <section className="record-section">
// //           {loading ? (
// //             <p className="loading-text">Loading...</p>
// //           ) : agents.length === 0 ? (
// //             <p className="no-records">No agents found.</p>
// //           ) : (
// //             <table className="record-table">
// //               <thead>
// //                 <tr>
// //                   <th>Name</th>
// //                   <th>Email</th>
// //                   <th>Role</th>
// //                   <th>Created At</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {agents.map((agent) => (
// //                   <tr key={agent.id}>
// //                     <td>{agent.fullname}</td>
// //                     <td>{agent.email}</td>
// //                     <td>{agent.role}</td>
// //                     <td>{agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "-"}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }

// "use client";
// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers } from "@/services/user.api";
// import type { User } from "@/types/user";
// import "../../../cssfiles/record.css";
// import "../../../cssfiles/sidebarcomponents.css";
// import Sidebar from "@/app/dashboard/components/Sidebar"; // Sidebar import

// export default function ManagerAgentRecord() {
//   const { user, logoutUser } = useAuthContext();
//   const [agents, setAgents] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadAgents = async () => {
//       try {
//         if (user) {
//           const users = await fetchUsers("agent"); // fetch only agents
//           setAgents(users);
//         }
//       } catch (error) {
//         console.error("Error fetching agents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAgents();
//   }, [user]);

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <Sidebar activePage="Agent Record" />

//       {/* Main Content */}
//       <main className="main-content">
//         <div className="main-top">
//           <h1 className="header">Agent Records</h1>
//           <div className="top-right">
//             <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
//             <button className="logout-btn" onClick={logoutUser}>Logout</button>
//           </div>
//         </div>

//         {/* Records Table */}
//         <section className="record-section">
//           {loading ? (
//             <p className="loading-text">Loading...</p>
//           ) : agents.length === 0 ? (
//             <p className="no-records">No agents found.</p>
//           ) : (
//             <table className="record-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Created At</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {agents.map((agent) => (
//                   <tr key={agent.id}>
//                     <td>{agent.fullname}</td>
//                     <td>{agent.email}</td>
//                     <td>{agent.role}</td>
//                     <td>{agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }
