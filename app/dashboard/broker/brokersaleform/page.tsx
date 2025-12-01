
"use client";
import React, { useEffect, useState } from "react";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/agent.css";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";
import Sidebar from "@/app/dashboard/components/Sidebar";

interface Sale {
  _id: string;
  productType: string;
  productId: string;
  productDescription: string;
  price: number;
  commission: number;
  broker: { _id: string; fullname: string; email: string; role: string };
  createdAt: string;
}

export default function BrokerSalesPage() {
  const { user, logoutUser } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await http.get("/sales"); // backend filters based on role
      if (res.data.success) setSales(res.data.sales);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?._id) fetchSales(); }, [user?._id]);

  return (
    <div className="dashboard">
      <Sidebar activePage={user?.role === "broker" ? "Broker Sale" : "Sale"} />

      <main className="main">
        <div className="main-top">
          <h1 className="header">Sales</h1>
          <div className="top-right">
            <span className="profile-name">{user?.fullname || user?.email || "Guest"}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        <section className="transactions">
          <h2>{user.role === "broker" ? "My Sales" : "All Sales"}</h2>
          {loading ? (
            <p>Loading sales...</p>
          ) : sales.length === 0 ? (
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
                    <td>{sale.broker.fullname || sale.broker.email}</td>
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
