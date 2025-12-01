
"use client";

import React, { useEffect, useState } from "react";
import "../../cssfiles/sidebarcomponents.css"
import "../../cssfiles/agent.css";
import { useAuthContext } from "@/context/AuthContext";
import SaleModal from "./saleforms";
import http from "@/services/http";
import Link from "next/link";
import Sidebar from "@/app/dashboard/components/Sidebar";

interface Sale {
  _id: string;
  productType: string;
  productId: string;
  productDescription: string;
  price: number;
  broker: string;
  commission: number;
  agent: string;
  createdAt: string; 
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
  if (user?.id) {
    fetchSales();
  }
}, [user?.id]);


  return (
    <div className="dashboard">
     <Sidebar activePage="Dashboardagent" />

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
            refreshSales={fetchSales}
          />
        )}

       
        <section className="transactions">
          <h2>My Sales</h2>
          {sales.length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            <table className="record-table">
              <thead>
                <tr>
                  <th>Product Type</th>
                  <th>Product ID</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Commission</th>
                  <th>Broker</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale._id}>
                    <td>{sale.productType}</td>
                    <td>{sale.productId}</td>
                    <td>{sale.productDescription}</td>
                    <td>{sale.price}</td>
                    <td>{sale.commission}</td>
                    <td>{sale.broker}</td>
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
