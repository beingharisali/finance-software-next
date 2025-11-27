
// "use client";
// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers } from "@/services/user.api";
// import type { User } from "@/types/user";
// import Link from "next/link";
// import "../../../cssfiles/record.css";
// import "../../../cssfiles/sidebarcomponents.css";
// import Sidebar from "@/app/dashboard/components/Sidebar"; // Sidebar import

// export default function ManagerBrokerRecord() {
//   const { user, logoutUser } = useAuthContext();
//   const [brokers, setBrokers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadBrokers = async () => {
//       try {
//         if (user) {
//           const users = await fetchUsers("broker");
//           setBrokers(users);
//         }
//       } catch (error) {
//         console.error("Error fetching brokers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadBrokers();
//   }, [user]);

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <nav className="sidebar">
//         <h1>Finance</h1>
//         <div className="nav-list">
//           <Link href="/dashboard/managers" className="nav-item">Dashboard</Link>
//           <Link href="/dashboard/managers/manageragentrecord" className="nav-item">Agent Record</Link>
//           <Link href="/dashboard/managers/managerbrokerrecord" className="nav-item active">Broker Record</Link>
//           <Link href="/dashboard/managers/team" className="nav-item">Team</Link>
//           <Link href="/dashboard/sidebarcomponent/transaction" className="nav-item">Transactions</Link>
//           <Link href="/dashboard/managers/reports" className="nav-item">Reports</Link>
//           <Link href="/dashboard/sidebarcomponents/settings" className="nav-item">Settings</Link>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Top Bar */}
//         <div className="main-top">
//           <h1 className="header">Broker Records</h1>
//           <div className="top-right">
//             <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
//             <button className="logout-btn" onClick={logoutUser}>Logout</button>
//           </div>
//         </div>

//         {/* Records Table */}
//         <section className="record-section">
//           {loading ? (
//             <p className="loading-text">Loading...</p>
//           ) : brokers.length === 0 ? (
//             <p className="no-records">No brokers found.</p>
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
//                 {brokers.map((broker) => (
//                   <tr key={broker.id}>
//                     <td>{broker.fullname}</td>
//                     <td>{broker.email}</td>
//                     <td>{broker.role}</td>
//                     <td>{broker.createdAt ? new Date(broker.createdAt).toLocaleDateString() : "-"}</td>
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
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { useRouter } from "next/navigation";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";

export default function ManagerBrokerRecord() {
  const { user, logoutUser } = useAuthContext();
  const [brokers, setBrokers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "manager" && user.role !== "admin") router.replace("/unauthorized");
  }, [user, router]);

  useEffect(() => {
    const loadBrokers = async () => {
      try { if(user) { const users = await fetchUsers("broker"); setBrokers(users); } }
      catch (error) { console.error("Error fetching brokers:", error); }
      finally { setLoading(false); }
    };
    loadBrokers();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar activePage="Broker Record" />

      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Broker Records</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        <section className="record-section">
          {loading ? <p className="loading-text">Loading...</p> :
            brokers.length === 0 ? <p className="no-records">No brokers found.</p> :
              <table className="record-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Created At</th></tr></thead>
                <tbody>
                  {brokers.map(broker => (
                    <tr key={broker.id}>
                      <td>{broker.fullname}</td>
                      <td>{broker.email}</td>
                      <td>{broker.role}</td>
                      <td>{broker.createdAt ? new Date(broker.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </section>
      </main>
    </div>
  );
}
