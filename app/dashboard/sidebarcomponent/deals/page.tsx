"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/components/Sidebar";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";
import { fetchUsers } from "@/services/user.api";
import http from "@/services/http";

interface Deal {
  _id?: string;
  ref: string;
  date: string;
  broker: string;
  client: string;
  products: string[];
  status: string;
}

export default function CompanyCostPage() {
  const { user, logoutUser } = useAuthContext();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  // Deals table state
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealCounter, setDealCounter] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Brokers, Clients & Products from DB
  const [brokers, setBrokers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  // search
  const [searchClient, setSearchClient] = useState("");
  if (!user) return <p>Loading...</p>;

  // Fetch brokers
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const users = await fetchUsers("broker"); // fetch brokers
        setBrokers(users);
      } catch (err) {
        console.error("Failed to fetch brokers", err);
        setBrokers([]);
      }
    };
    fetchBrokers();
  }, []);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await http.get("/clients");
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients", err);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await http.get("/productRoute/all");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch existing deals from DB on page load
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await http.get("/deals");
        console.log("Deals from backend:", res.data);
        setDeals(res.data);
        setDealCounter(res.data.length + 1);
      } catch (err) {
        console.error("Failed to fetch deals", err);
      }
    };
    fetchDeals();
  }, []);

  const handleSaveDeal = async () => {
    if (!selectedBroker || !selectedClient || selectedProducts.length === 0) {
      alert("Please fill all fields!");
      return;
    }

    const clientObj = clients.find(
      (c) => c.clientNumber === Number(selectedClient),
    );

    const brokerName =
      brokers.find((b) => b._id === selectedBroker)?.fullname || "";
    const clientName = clientObj
      ? `${clientObj.firstName} ${clientObj.lastName}`
      : "";
    if (editingDealId) {
      // Make sure valid broker, client, products are selected
      if (!selectedBroker || !selectedClient || selectedProducts.length === 0) {
        alert("Please select a valid Broker, Client, and Products");
        return;
      }

      try {
        // Send IDs to backend instead of names
        const res = await http.put(`/deals/${editingDealId}`, {
          broker: selectedBroker, // broker _id
          client: selectedClient, // clientNumber or _id
          products: selectedProducts, // array of product _id
        });

        // Update frontend state
        setDeals(deals.map((d) => (d._id === editingDealId ? res.data : d)));

        // Reset form
        setEditingDealId(null);
        setShowForm(false);
        setSelectedBroker("");
        setSelectedClient("");
        setSelectedProducts([]);
      } catch (err) {
        console.error("Failed to update deal", err);
        alert("Failed to update deal");
      }
    } else {
      // Create new deal (existing code)
      const newRef = String(deals.length + 1).padStart(3, "0");
      const newDeal: Deal = {
        ref: newRef,
        date: new Date().toLocaleDateString(),
        broker: brokerName,
        client: clientName,
        products: [...selectedProducts],
        status,
      };
      try {
        const res = await http.post("/deals", newDeal);
        setDeals([...deals, res.data]);

        // Reset form
        setSelectedBroker("");
        setSelectedClient("");
        setSelectedProducts([]);
        setShowForm(false);
      } catch (err) {
        console.error("Failed to save deal", err);
        alert("Failed to save deal to database!");
      }
    }
  };
  
  // hadeledit
  const handleEditDeal = (deal: Deal) => {
    // Set broker
    const brokerObj = brokers.find((b) => b.fullname === deal.broker);
    setSelectedBroker(brokerObj?._id || "");

    // Set client
    const clientObj = clients.find(
      (c) => `${c.firstName} ${c.lastName}` === deal.client,
    );
    setSelectedClient(clientObj?.clientNumber?.toString() || "");

    // Set products and status
    setSelectedProducts(deal.products);
    setStatus(deal.status);

    // Show form and store editing deal ID
    setShowForm(true);
    setEditingDealId(deal._id || null);
  };
  // delet handle
  const handleDeleteDeal = async (dealId?: string) => {
    if (!dealId) return;
    if (!confirm("Are you sure you want to delete this deal?")) return;

    try {
      await http.delete(`/deals/${dealId}`);
      // Remove deal from frontend state
      setDeals(deals.filter((d) => d._id !== dealId));
    } catch (err) {
      console.error("Failed to delete deal", err);
      alert("Failed to delete deal.");
    }
  };
  // filers
  const resetFilters = () => {
    setSearchClient(""); // Clear client search
    setStartDate(""); // Clear start date
    setEndDate(""); // Clear end date
  };
  // save
  // Update deal status in DB
  const handleStatusChange = async (
    dealId: string,
    newStatus: string,
    idx: number,
  ) => {
    const updatedDeals = [...deals];
    updatedDeals[idx].status = newStatus;
    setDeals(updatedDeals);

    try {
      await http.put(`/deals/${dealId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update deal status", err);
    }
  };
  // Filter deals by client + date
  const filteredDeals = deals.filter((deal) => {
    const dealDate = new Date(deal.date);
    const matchesClient = deal.client
      .toLowerCase()
      .includes(searchClient.toLowerCase());

    let inDateRange = true;
    if (startDate) inDateRange = inDateRange && dealDate >= new Date(startDate);
    if (endDate) inDateRange = inDateRange && dealDate <= new Date(endDate);

    return matchesClient && inDateRange;
  });

  return (
    <div className="dashboard-container flex">
      <Sidebar activePage="Deals" />

      <main className="main-content flex-1 p-6">
        {/* Top bar */}
        <div className="main-top flex justify-between items-center mb-6 text-black">
          <h1 className="header text-2xl font-bold">Deals Page</h1>
          <div className="top-right flex items-center gap-4">
            <span className="profile-name">
              {user.fullname || user.email || "Guest"}
            </span>
            <button
              className="logout-btn bg-red-600 text-white px-3 py-1 rounded"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        </div>

        {/* New Deal Button */}
        <button
          className="text-white bg-[#0f526a] w-32 p-3 mt-4 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          New Deal
        </button>

        {/* Deal Form */}
        {showForm && (
          <div className="bg-white shadow-lg p-4 mt-4 w-1/2 rounded text-black">
            <h2 className="text-lg font-semibold mb-4">Create New Deal</h2>

            {/* Broker Dropdown */}
            <div className="mb-3">
              <label className="block mb-1">Brokers</label>
              <select
                className="w-full border p-2 rounded"
                value={selectedBroker}
                onChange={(e) => setSelectedBroker(e.target.value)}
              >
                <option value="">Select Broker</option>
                {brokers.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.fullname || b.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Dropdown */}
            <div className="mb-3">
              <label className="block mb-1">Clients</label>
              <select
                className="w-full border p-2 rounded"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c.clientNumber} value={c.clientNumber}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Dropdown */}
            <div className="mb-3">
              <label className="block mb-1">Products</label>
              <select
                className="w-full border p-2 rounded"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !selectedProducts.includes(value)) {
                    setSelectedProducts([...selectedProducts, value]);
                  }
                  e.target.value = "";
                }}
              >
                <option value="">Select Product</option>

                {products.map((p) => {
                  // Check if this product is already assigned in any deal
                  const isAssigned = deals.some((d) =>
                    d.products.includes(p._id),
                  );

                  return (
                    <option
                      key={p._id}
                      value={p._id}
                      disabled={isAssigned} // disable if assigned
                      style={{
                        backgroundColor: isAssigned ? "orange" : "white", // yellow if assigned
                        color: isAssigned ? "black" : "blue", // text color
                      }}
                    >
                      {p.liquidMake}
                    </option>
                  );
                })}
              </select>

              {/* Selected Products List */}
              <div className="mt-3">
                {selectedProducts.map((id, index) => {
                  const product = products.find((p) => p._id === id);

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                    >
                      <span>{product ? product.liquidMake : id}</span>
                      <button
                        className="text-red-500 font-bold"
                        onClick={() =>
                          setSelectedProducts(
                            selectedProducts.filter((p) => p !== id),
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save & Cancel */}
            <div className="flex gap-3 mt-4">
              <button
                className="bg-[#0f526a] text-white px-4 py-2 rounded"
                onClick={handleSaveDeal}
              >
                Save Deal
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* search */}
        {/* <div className="mb-4 text-black mt-2">
  <input
    type="text"
    placeholder="Search by Client Name..."
    className="border p-2 rounded w-64"
    value={searchClient}
    onChange={(e) => setSearchClient(e.target.value)}
  />
</div> */}
        <div className="flex items-center gap-3 mt-4 mb-4 text-black">
          <input
            type="text"
            placeholder="Search by Client..."
            className="border p-2 rounded w-64 text-black"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
          />
          <span>From:</span>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>To:</span>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>

        {/* Deals Table */}
        {filteredDeals.length > 0 && (
          // {/* Deals Table */}
          // {deals.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="record-table  min-w-[1200px] border-collapse text-sm  ">
              <thead className="">
                <tr>
                  <th>Ref #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Client</th>
                  <th>Products</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>

              <tbody>
                {/* {deals.map((deal, idx) => ( */}
                {deals
                  .filter((deal) =>
                    deal.client
                      .toLowerCase()
                      .includes(searchClient.toLowerCase()),
                  )
                  .map((deal, idx) => (
                    <tr key={deal._id || idx} className="relative">
                      {/* Ref # with colored status bar */}
                      <td className="border px-4 py-2">
                        <div className="flex items-center">
                          {/* Colored bar */}
                          <div
                            className="w-2 h-6 rounded mr-2"
                            style={{
                              backgroundColor:
                                deal.status.trim().toLowerCase() === "completed"
                                  ? "green"
                                  : "orange",
                            }}
                          ></div>
                          <span>{deal.ref}</span>
                        </div>
                      </td>

                      {/* <td className="border px-4 py-2">{deal.date}</td> */}
                      {/* <td className="border px-4 py-2">
  {new Date(deal.date).toLocaleDateString("en-GB")}
</td> */}
                      <td className="border px-4 py-2">
                        {new Date(deal.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="border px-4 py-2">
                        <select
                          value={deal.status}
                          onChange={(e) =>
                            deal._id &&
                            handleStatusChange(deal._id, e.target.value, idx)
                          }
                          className="border p-1 rounded"
                        >
                          <option>document sent</option>
                          <option>escrow check</option>
                          <option>escrow source of funds</option>
                          <option>IR + INV</option>
                          <option>Paid</option>
                          <option>Certificate</option>
                          <option>Delivery</option>
                          <option>Completed</option>
                        </select>
                      </td>
                      <td className="border px-4 py-2">{deal.client}</td>
                      <td className="border px-4 py-2">
                        {/* {deal.products.join(", ")} */}
                        {deal.products
                          .map((id) => {
                            const product = products.find((p) => p._id === id);
                            return product ? product.liquidMake : id;
                          })
                          .join(", ")}
                      </td>
                      <td className="border px-4 py-2 flex gap-2">
                        <button
                          className="text-blue-600 underline"
                          onClick={() => handleEditDeal(deal)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 underline"
                          onClick={() => handleDeleteDeal(deal._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
