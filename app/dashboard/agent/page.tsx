
"use client";

import React, { useEffect, useState } from "react";
import "../../cssfiles/sidebarcomponents.css"
import "../../cssfiles/agent.css";
import { useAuthContext } from "@/context/AuthContext";
import SaleModal from "./saleform";
import http from "@/services/http";
import Link from "next/link";

// interface Sale {
//   _id: string;
//   saleName: string;
//   productName: string;
//   description?: string;
//   price?: number;
//   clientName?: string;
//   rating?: number;
//   review?: string;
//   date: string;
// }
interface Sale {
  _id: string;
  productType: string;
  productId: string;
  productDescription: string;
  price: number;
  broker: string;
  commission: number;
  agent: string;
  createdAt: string; // for date
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, logoutUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch agent's sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await http.get("/sales");
      if (res.data.success) setSales(res.data.sales);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h1>Finance</h1>
        <div className="nav-list">
          <Link href="/dashboard/sidebarcomponents" className="nav-item active">Dashboard</Link>
          <Link href="/dashboard/sidebarcomponents/transactions" className="nav-item">Transaction</Link>
          <Link href="/dashboard/sidebarcomponents/payments" className="nav-item">Payment</Link>
          <Link href="/dashboard/sidebarcomponents/card" className="nav-item">Card</Link>
          <Link href="/dashboard/sidebarcomponents/insight" className="nav-item">Insights</Link>
          <Link href="/dashboard/sidebarcomponents/settings" className="nav-item">Settings</Link>
        </div>
        
      </nav>

      <main className="main">
<div className="main-top">
  <h1 className="header">Dashboard</h1>
  <div className="top-right">
    <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
    <button className="logout-btn" onClick={logoutUser}>Logout</button>
  </div>
</div>

        <button className="add-sale-btn" onClick={() => setShowModal(true)}>Add Sale</button>

        {showModal && (
          <SaleModal
            onClose={() => setShowModal(false)}
            refreshSales={fetchSales} // refresh sales after adding
          />
        )}

        <section className="transactions">
          <h3>My Sales</h3>
          {loading ? (
            <p>Loading...</p>
          ) : sales.length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            <table>
              {/* <thead>
                <tr>
                  <th>Sale Name</th>
                  <th>Product Name</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead> */}
              <thead>
  <tr>
    <th>Product Type</th>
    <th>Product ID</th>
    <th>Description</th>
    <th>Price</th>
    <th>Broker</th>
    <th>Commission</th>
    <th>Date</th>
  </tr>
</thead>

              {/* <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.saleName}</td>
                    <td>{sale.productName}</td>
                    <td>{sale.clientName}</td>
                    <td>{sale.price}</td>

                  </tr>
                ))}
              </tbody> */}
              <tbody>
  {sales.map((sale) => (
    <tr key={sale._id}>
      <td>{sale.productType}</td>
      <td>{sale.productId}</td>
      <td>{sale.productDescription}</td>
      <td>{sale.price}</td>
      <td>{sale.broker}</td>
      <td>{sale.commission}</td>
      <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
    </tr>
  ))}
</tbody>

            </table>
          )}
        </section>
      </main>
    </div>
  );
}
