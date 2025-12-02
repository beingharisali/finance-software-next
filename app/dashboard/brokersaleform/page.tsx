
"use client";

import React, { useEffect, useState } from "react";
import "../../cssfiles/sidebarcomponents.css";
import "../../cssfiles/agent.css";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";
import Sidebar from "@/app/dashboard/components/Sidebar";
import SaleModal from "../broker/saleform/saleforms";

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

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

export default function BrokerSalesPage() {
  const { user, logoutUser, loading: userLoading } = useAuthContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [brokers, setBrokers] = useState<User[]>([]);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch only brokers (admin/manager/assistant)
  const fetchBrokers = async () => {
    try {
      const res = await http.get("/users?role=broker");
      if (res.data.success) setBrokers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch brokers:", err);
    }
  };

  const fetchSales = async (brokerId?: string) => {
    if (!user) return;
    try {
      setLoading(true);
      let url = "/sales";

      if (user.role === "broker") {
        url += `?broker=${user._id}`;
      } else if (brokerId) {
        url += `?broker=${brokerId}`;
      }

      const res = await http.get(url);
      if (res.data.success) setSales(res.data.sales);

    } catch (err) {
      console.error("Failed to fetch sales:", err);
      alert("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      if (["admin", "manager", "assistant"].includes(user.role)) fetchBrokers();
      fetchSales();
    }
  }, [userLoading, user]);

  const handleBrokerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brokerId = e.target.value;
    setSelectedBroker(brokerId);
    fetchSales(brokerId);
  };

  // ADD SALE (fresh record push without reload)
  const handleSaleAdded = (newSale: Sale) => {
    setSales(prev => [newSale, ...prev]);
  };

  if (userLoading || !user) {
    return (
      <div className="dashboard">
        <Sidebar activePage="Sale" />
        <main className="main">
          <p>Loading user info...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar activePage={user.role === "broker" ? "Broker Sale" : "Sale"} />

      <main className="main">
        <div className="main-top">
          <h1 className="header">Sales</h1>
          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>Logout</button>
          </div>
        </div>

        {/* Add Sale Button */}
        <button className="add-sale-btn" onClick={() => setShowModal(true)}>
          Add Sale
        </button>

        {/* Sale Modal */}
        {showModal && (
          <SaleModal
            onClose={() => setShowModal(false)}
            refreshSales={handleSaleAdded}
            brokers={brokers}
            user={user}       // FIX: user passed here
          />
        )}

        <section className="transactions">
          <h2>{user.role === "broker" ? "My Sales" : "All Sales"}</h2>

          {/* Filter Only for Admin/Manager/Assistant */}
          {["admin", "manager", "assistant"].includes(user.role) && (
            <div className="broker-filter">
              <label htmlFor="brokerSelect">Filter by Broker:</label>
              <select id="brokerSelect" value={selectedBroker} onChange={handleBrokerChange}>
                <option value="">All Brokers</option>
                {brokers.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.fullname || b.email}
                  </option>
                ))}
              </select>
            </div>
          )}

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
