



// // "use client";

// // import React, { useEffect, useState } from "react";
// // import { useAuthContext } from "@/context/AuthContext";
// // import ProtectedRoute from "@/utilies/ProtectedRoute";
// // import Sidebar from "@/app/dashboard/components/Sidebar";
// // import http from "@/services/http";
// // import SaleModal from "../salemodel/page"; // correct path
// // import "../../../cssfiles/record.css";
// // import "../../../cssfiles/sidebarcomponents.css";
// // import "../../../cssfiles/agent.css";

// // interface Sale {
// //   _id: string;
// //   productType: string;
// //   productId: string;
// //   productDescription: string;
// //   price: number;
// //   broker: string;
// //   commission: number;
// //   agent: {
// //     _id: string;
// //     fullname: string;
// //     email: string;
// //   };
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // export default function SaleManagement() {
// //   const { user, logoutUser } = useAuthContext();
// //   const [sales, setSales] = useState<Sale[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [editingSale, setEditingSale] = useState<Sale | null>(null);
// //   const [selectedBroker, setSelectedBroker] = useState<string>("All");
// //   const [uniqueBrokers, setUniqueBrokers] = useState<string[]>([]);

// //   const fetchAllSales = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await http.get("/sales");
// //       if (res.data.success) {
// //         setSales(res.data.sales);

// //         const brokers = Array.from(
// //           new Set(res.data.sales.map((sale: Sale) => sale.broker))
// //         );
// //         setUniqueBrokers(brokers);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to fetch sales");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (user?.id) fetchAllSales();
// //   }, [user?.id]);

// //   const handleDelete = async (id: string) => {
// //     if (!confirm("Are you sure you want to delete this sale?")) return;
// //     try {
// //       await http.delete(`/sales/${id}`);
// //       setSales((prev) => prev.filter((s) => s._id !== id));
// //       alert("Sale deleted successfully!");
// //     } catch (err: any) {
// //       console.error(err);
// //       alert(err.response?.data?.message || "Failed to delete sale");
// //     }
// //   };

// //   const handleOpenModal = (sale?: Sale) => {
// //     setEditingSale(sale || null);
// //     setShowModal(true);
// //   };

// //   const handleCloseModal = () => {
// //     setShowModal(false);
// //     setEditingSale(null);
// //   };

// //   const handleResetFilter = () => {
// //     setSelectedBroker("All");
// //   };

// //   const filteredSales =
// //     selectedBroker === "All"
// //       ? sales
// //       : sales.filter((sale) => sale.broker === selectedBroker);

// //   if (!user) return <p>Loading...</p>;

// //   return (
// //     <ProtectedRoute allowedRoles={["admin", "manager", "assistant"]}>
// //       <div className="dashboard-container">
// //         <Sidebar activePage="Sale" />

// //         <main className="main-content">
// //           <div className="main-top">
// //             <h1 className="header">Sales Management</h1>
// //             <div className="top-right">
// //               <span className="profile-name">{user.fullname || user.email}</span>
// //               <button className="logout-btn" onClick={logoutUser}>
// //                 Logout
// //               </button>
// //             </div>
// //           </div>

// //           {/* Broker Filter */}
// //           <div className="filter-section">
// //             <label htmlFor="brokerFilter" className="filter-label">
// //               Filter by Broker:
// //             </label>
// //             <select
// //               id="brokerFilter"
// //               value={selectedBroker}
// //               onChange={(e) => setSelectedBroker(e.target.value)}
// //               className="filter-dropdown"
// //             >
// //               <option value="All">All</option>
// //               {uniqueBrokers.map((broker) => (
// //                 <option key={broker} value={broker}>
// //                   {broker}
// //                 </option>
// //               ))}
// //             </select>
// //             <button className="reset-filter-btn" onClick={handleResetFilter}>
// //               Reset Filter
// //             </button>
// //           </div>

// //           {/* Add Sale Button */}
// //           <div className="add-sale-section">
// //             <button className="add-sale-btn" onClick={() => handleOpenModal()}>
// //               Add Sale
// //             </button>
// //           </div>

// //           {/* Sales Table */}
// //           {loading ? (
// //             <p>Loading sales...</p>
// //           ) : filteredSales.length === 0 ? (
// //             <p>No sales recorded yet.</p>
// //           ) : (
// //             <table className="record-table">
// //               <thead>
// //                 <tr>
// //                   <th>Agent</th>
// //                   <th>Product Type</th>
// //                   <th>Product ID</th>
// //                   <th>Description</th>
// //                   <th>Price</th>
// //                   <th>Commission</th>
// //                   <th>Broker</th>
// //                   <th>Date</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredSales.map((sale) => (
// //                   <tr key={sale._id}>
// //                     <td>{sale.agent?.fullname || sale.agent?.email || "N/A"}</td>
// //                     <td>{sale.productType}</td>
// //                     <td>{sale.productId}</td>
// //                     <td>{sale.productDescription}</td>
// //                     <td>{sale.price}</td>
// //                     <td>{sale.commission}</td>
// //                     <td>{sale.broker}</td>
// //                     <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
// //                     <td>
// //                       <button onClick={() => handleOpenModal(sale)}>Edit</button>
// //                       <button onClick={() => handleDelete(sale._id)}>Delete</button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           )}

// //           {/* Sale Modal */}
// //           {showModal && (
// //             <SaleModal
// //               onClose={handleCloseModal}
// //               refreshSales={fetchAllSales}
// //               editingSale={editingSale}
// //             />
// //           )}
// //         </main>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import Sidebar from "@/app/dashboard/components/Sidebar";
import http from "@/services/http";
import SaleModal from "../salemodel/page"; // adjust path if needed
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/agent.css";

interface Sale {
  _id: string;
  productType: string;
  productId: string;
  productDescription: string;
  price: number;
  commission: number;
  broker: string;
  agent?: {
    _id: string;
    fullname: string;
    email: string;
  };
  createdAt: string;
}

export default function SaleManagement() {
  const { user, logoutUser } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<string>("All");
  const [uniqueBrokers, setUniqueBrokers] = useState<string[]>([]);

  // Fetch all sales
  const fetchAllSales = async () => {
    try {
      setLoading(true);
      const res = await http.get("/sales", { withCredentials: true });
      console.log("Sales response:", res.data);

      // Support backend returning array or { success, sales }
      const salesData: Sale[] = res.data.sales || res.data;
      setSales(salesData);

      // Extract unique brokers
      const brokers = Array.from(
        new Set(
          salesData.map((sale) =>
            typeof sale.broker === "string" ? sale.broker : sale.broker?.fullname
          )
        )
      );
      setUniqueBrokers(brokers);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchAllSales();
  }, [user?._id]);

  // Delete sale
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      await http.delete(`/sales/${id}`, { withCredentials: true });
      setSales((prev) => prev.filter((s) => s._id !== id));
      alert("Sale deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete sale");
    }
  };

  // Modal handlers
  const handleOpenModal = (sale?: Sale) => {
    setEditingSale(sale || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSale(null);
  };

  // Broker filter
  const handleResetFilter = () => setSelectedBroker("All");

  const filteredSales =
    selectedBroker === "All"
      ? sales
      : sales.filter(
          (sale) =>
            sale.broker === selectedBroker ||
            (sale.broker && typeof sale.broker !== "string" && sale.broker.fullname === selectedBroker)
        );

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "assistant"]}>
      <div className="dashboard-container">
        <Sidebar activePage="Sale" />

        <main className="main-content">
          <div className="main-top">
            <h1 className="header">Sales Management</h1>
            <div className="top-right">
              <span className="profile-name">{user.fullname || user.email}</span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>

          {/* Broker Filter */}
          <div className="filter-section">
            <label htmlFor="brokerFilter" className="filter-label">
              Filter by Broker:
            </label>
            <select
              id="brokerFilter"
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="filter-dropdown"
            >
              <option value="All">All</option>
              {uniqueBrokers.map((broker) => (
                <option key={broker} value={broker}>
                  {broker}
                </option>
              ))}
            </select>
            <button className="reset-filter-btn" onClick={handleResetFilter}>
              Reset Filter
            </button>
          </div>

          {/* Add Sale Button */}
          <div className="add-sale-section">
            <button className="add-sale-btn" onClick={() => handleOpenModal()}>
              Add Sale
            </button>
          </div>

          {/* Sales Table */}
          {loading ? (
            <p>Loading sales...</p>
          ) : filteredSales.length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            <table className="record-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Product Type</th>
                  <th>Product ID</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Commission</th>
                  <th>Broker</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.agent?.fullname || sale.agent?.email || "N/A"}</td>
                    <td>{sale.productType}</td>
                    <td>{sale.productId}</td>
                    <td>{sale.productDescription}</td>
                    <td>{sale.price}</td>
                    <td>{sale.commission}</td>
                    <td>
                      {typeof sale.broker === "string"
                        ? sale.broker
                        : sale.broker?.fullname || "N/A"}
                    </td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleOpenModal(sale)}>Edit</button>
                      <button onClick={() => handleDelete(sale._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Sale Modal */}
          {showModal && (
            <SaleModal
              onClose={handleCloseModal}
              refreshSales={fetchAllSales}
              editingSale={editingSale}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import ProtectedRoute from "@/utilies/ProtectedRoute";
// import Sidebar from "@/app/dashboard/components/Sidebar";
// import http from "@/services/http";
// import "../../../cssfiles/record.css";
// import "../../../cssfiles/sidebarcomponents.css";

// interface User {
//   _id: string;
//   fullname: string;
//   email: string;
//   role?: string;
// }

// interface Sale {
//   _id: string;
//   productType: string;
//   productId: string;
//   productDescription: string;
//   price: number;
//   commission: number;
//   broker: User | string; // populated broker object or ObjectId
//   createdAt: string;
// }

// export default function SaleManagement() {
//   const { user, logoutUser } = useAuthContext();
//   const [sales, setSales] = useState<Sale[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBroker, setSelectedBroker] = useState<string>("All");
//   const [uniqueBrokers, setUniqueBrokers] = useState<User[]>([]);

//   // Fetch all sales
//   const fetchAllSales = async () => {
//     try {
//       setLoading(true);
//       const res = await http.get("/sales", { withCredentials: true });
//       const salesData: Sale[] = res.data.sales || [];
//       setSales(salesData);

//       if (["admin", "manager", "assistant"].includes(user.role)) {
//         // Extract unique brokers for filter dropdown
//         const brokers: User[] = Array.from(
//           new Map(
//             salesData.map((sale) => [
//               typeof sale.broker === "object" ? sale.broker._id : sale.broker,
//               typeof sale.broker === "object"
//                 ? sale.broker
//                 : { _id: sale.broker, fullname: sale.broker, email: "" },
//             ])
//           ).values()
//         );
//         setUniqueBrokers(brokers);
//       }
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to fetch sales");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?._id) fetchAllSales();
//   }, [user?._id]);

//   const handleResetFilter = () => setSelectedBroker("All");

//   const filteredSales =
//     selectedBroker === "All"
//       ? sales
//       : sales.filter(
//           (sale) =>
//             (typeof sale.broker === "object" ? sale.broker._id : sale.broker) === selectedBroker
//         );

//   if (!user) return <p>Loading user info...</p>;

//   return (
//     <ProtectedRoute allowedRoles={["admin", "manager", "assistant", "broker"]}>
//       <div className="dashboard-container">
//         <Sidebar activePage="Sale" />

//         <main className="main-content">
//           <div className="main-top">
//             <h1 className="header">Sales Management</h1>
//             <div className="top-right">
//               <span className="profile-name">{user.fullname || user.email}</span>
//               <button className="logout-btn" onClick={logoutUser}>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Broker Filter - only for Admin/Manager/Assistant */}
//           {["admin", "manager", "assistant"].includes(user.role) && (
//             <div className="filter-section">
//               <label htmlFor="brokerFilter" className="filter-label">
//                 Filter by Broker:
//               </label>
//               <select
//                 id="brokerFilter"
//                 value={selectedBroker}
//                 onChange={(e) => setSelectedBroker(e.target.value)}
//                 className="filter-dropdown"
//               >
//                 <option value="All">All</option>
//                 {uniqueBrokers.map((broker) => (
//                   <option key={broker._id} value={broker._id}>
//                     {broker.fullname}
//                   </option>
//                 ))}
//               </select>
//               <button className="reset-filter-btn" onClick={handleResetFilter}>
//                 Reset Filter
//               </button>
//             </div>
//           )}

//           {/* Sales Table */}
//           {loading ? (
//             <p>Loading sales...</p>
//           ) : filteredSales.length === 0 ? (
//             <p>No sales recorded yet.</p>
//           ) : (
//             <table className="record-table">
//               <thead>
//                 <tr>
//                   <th>Product Type</th>
//                   <th>Product ID</th>
//                   <th>Description</th>
//                   <th>Price</th>
//                   <th>Commission</th>
//                   <th>Broker</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSales.map((sale) => (
//                   <tr key={sale._id}>
//                     <td>{sale.productType}</td>
//                     <td>{sale.productId}</td>
//                     <td>{sale.productDescription}</td>
//                     <td>{sale.price}</td>
//                     <td>{sale.commission}</td>
//                     <td>
//                       {typeof sale.broker === "object" ? sale.broker.fullname : sale.broker}
//                     </td>
//                     <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }
