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
  commission?: number;
}

// export default function CompanyCostPage() {
export default function CompanyCostPage() {
  const { user, logoutUser } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [productPrices, setProductPrices] = useState<{ [key: string]: number }>(
    {},
  );
  const [brokers, setBrokers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [status, setStatus] = useState("document sent");
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealCounter, setDealCounter] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [commission, setCommission] = useState(0);
  
  // falto kaam test
  const [showDealsDropdown, setShowDealsDropdown] = useState(false);
  const [showClientDeals, setShowClientDeals] = useState(false);
  const [selectedClientDealsList, setSelectedClientDealsList] = useState<Deal[]>([]);
  // column product

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
  // commission

  const calculateTotal = (products: any[], commission = 0) => {
    const totalProducts = products.reduce((sum, p) => {
      const price = typeof p === "object" ? p.price || 0 : 0;
      return sum + price;
    }, 0);
    const commissionAmount = (totalProducts * commission) / 100;
    return totalProducts + commissionAmount;
  };

  // total
  const totalDealsAmount = deals.reduce((sum, deal) => {
    return sum + calculateTotal(deal.products, deal.commission);
  }, 0);
  const handleSaveDeal = async () => {
    if (!selectedBroker || !selectedClient || selectedProducts.length === 0) {
      alert("Please fill all fields!");
      return;
    }

    const payload = {
      broker: selectedBroker,
      client: selectedClient,
      // products: selectedProducts,
      products: selectedProducts.map((id) => ({
        productId: id,
        price: productPrices[id],
      })),
      status,
      commission,
    };

    try {
      if (editingDealId) {
        // Edit mode
        const res = await http.put(`/deals/${editingDealId}`, payload);
        setDeals(deals.map((d) => (d._id === editingDealId ? res.data : d)));
        setEditingDealId(null); // Reset edit mode
      } else {
        // New deal
        const res = await http.post("/deals", payload);
        setDeals([...deals, res.data]);
      }

      // Reset form
      setSelectedBroker("");
      setSelectedClient("");
      setSelectedProducts([]);
      setStatus("document sent");
      setProductPrices({});
      setShowForm(false);
    } catch (err: any) {
      console.error("Failed to save deal", err.response?.data || err.message);
      alert("Failed to save deal! Check console.");
    }
  };

  // hadeledit
  const handleEditDeal = (deal: Deal) => {
    // Set broker
    const brokerObj = brokers.find((b) => b._id === deal.broker);
    setSelectedBroker(brokerObj?._id || "");
    // const brokerObj = brokers.find((b) => b.fullname === deal.broker);
    // setSelectedBroker(brokerObj?._id || "");

    // Set client
    const clientObj = clients.find(
      (c) => c.clientNumber.toString() === deal.client.toString(),
    );
    setSelectedClient(clientObj?.clientNumber?.toString() || "");
    // const clientObj = clients.find(
    //   (c) => `${c.firstName} ${c.lastName}` === deal.client,
    // );
    // setSelectedClient(clientObj?.clientNumber?.toString() || "");

    // Set products and status
    // setSelectedProducts(deal.products);
    setSelectedProducts(
      deal.products.map((p: any) => (typeof p === "object" ? p.productId : p)),
    );
    // price mapping
    const priceMap: any = {};
    deal.products.forEach((p: any) => {
      if (typeof p === "object") {
        priceMap[p.productId] = p.price;
      }
    });

    setProductPrices(priceMap);
    setStatus(deal.status);
    // commision
    setCommission(deal.commission || 0);

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
    setSearchClient("");
    setStartDate("");
    setEndDate("");
  };
  // save
  const filteredDeals = deals.filter((deal) => {
    const dealDateStr = new Date(deal.date).toISOString().slice(0, 10);

    const startStr = startDate || null;
    const endStr = endDate || null;

    let inDateRange = true;
    if (startStr) inDateRange = dealDateStr >= startStr;
    if (endStr) inDateRange = inDateRange && dealDateStr <= endStr;

    // Client filter
    const clientObj = clients.find(
      (c) => c.clientNumber.toString() === deal.client.toString(),
    );
    const clientName = clientObj
      ? `${clientObj.firstName} ${clientObj.lastName}`
      : deal.client;
    const matchesClient = clientName
      .toLowerCase()
      .includes(searchClient.toLowerCase());

    return matchesClient && inDateRange;
  });
  const handleStatusChange = async (dealId: string, newStatus: string) => {
    try {
      const res = await http.put(`/deals/${dealId}`, {
        status: newStatus,
      });

      setDeals((prevDeals) =>
        prevDeals.map((deal) => (deal._id === dealId ? res.data : deal)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed!");
    }
  };
  if (!user) return <p>Loading...</p>;
  return (
    <div className="dashboard-container flex">
      <Sidebar activePage="Deals" />

      <main className="main-content flex-1 p-6">
        {/* Top bar */}
        <div className="main-top flex justify-between items-center mb-6 text-black">
          <h1 className="header text-2xl font-bold">Deals Page</h1>
          <div className="top-right flex items-center gap-4">
        

              {/* falto kaam */}
            <div 
  className="relative bg-[#0f526a] text-white px-4 py-2 rounded flex items-center gap-3 cursor-pointer"
  onClick={() => setShowClientDeals(!showClientDeals)}
>
  <span className="font-semibold">Deals</span>
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {deals.length}
              </span>
</div>

{showClientDeals && (
  <div className="absolute top-16 right-44 bg-white text-black shadow-lg rounded w-[350px] z-50">
    <div className="p-3 border-b font-semibold text-lg">
      Clients Deals Summary
    </div>

    <div className="max-h-80 overflow-y-auto p-2 space-y-2">
      {clients.map((client) => {
        const dealCount = deals.filter(
          (d) => d.client.toString() === client.clientNumber.toString()
        ).length;

        const isExpanded =
          selectedClientDealsList.length > 0 &&
          selectedClientDealsList[0]?.client.toString() ===
            client.clientNumber.toString();

        return (
          <div
            key={client.clientNumber}
            className="border rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition"
          >
            {/* Client header */}
            <div
              className="flex justify-between items-center p-3 cursor-pointer"
              onClick={() => {
                const clientDeals = deals.filter(
                  (d) => d.client.toString() === client.clientNumber.toString()
                );
                setSelectedClientDealsList(
                  isExpanded ? [] : clientDeals
                );
              }}
            >
              <span className="font-medium">
                {client.firstName} {client.lastName}
              </span>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                {dealCount}
              </span>
            </div>

            {/* Expanded deals */}
            {isExpanded && selectedClientDealsList.length > 0 && (
              <div className="border-t bg-white p-2">
                {/* Table header */}
                <div className="grid grid-cols-3 font-semibold text-sm mb-1">
                  <span>Reference No</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>

                {/* Deals list */}
                {selectedClientDealsList.map((deal) => (
                  <div
                    key={deal._id}
                    className="grid grid-cols-3 text-sm p-1 border-b hover:bg-gray-50 transition"
                  >
                    <span>{deal.ref}</span>
                    <span>{new Date(deal.date).toLocaleDateString("en-GB")}</span>
                    <span>{deal.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
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
                title="broker"
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
                title="client"
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
            <div className="mb-3 relative">
              <label className="block mb-1">Products</label>

              {/* Dropdown container */}
              <div className="border rounded w-full relative cursor-pointer">
                {/* Selected / Placeholder */}
                <div
                  className="p-2 bg-white flex justify-between items-center"
                  onClick={() => setOpen(!open)}
                >
                  <span>
                    {selectedProducts.length > 0
                      ? `${selectedProducts.length} product(s) selected`
                      : "Select Product"}
                  </span>
                  <span className="text-gray-500">{open ? "▲" : "▼"}</span>
                </div>

                {/* Dropdown list */}
                {open && (
                  <div className="absolute z-50 bg-white border w-full max-h-60 overflow-y-auto mt-1 shadow-lg rounded">
                    {/* Table header */}
                    <div className="grid grid-cols-3 font-bold p-2 border-b bg-gray-100 sticky top-0">
                      <span>ID</span>
                      <span>Date</span>
                      <span>Price</span>
                    </div>

                    {/* Table rows */}
                    {products.map((p) => {
                      // Check if product is assigned to another deal (excluding current editing deal)
                      const isAssigned = deals.some(
                        (d) =>
                          d._id !== editingDealId &&
                          d.products.some(
                            (prod: any) =>
                              (typeof prod === "object"
                                ? prod.productId
                                : prod) === p._id,
                          ),
                      );

                      // Check if product is selected in current form
                      const isSelected = selectedProducts.includes(p._id);

                      return (
                        <div
                          key={p._id}
                          className={`grid grid-cols-3 p-2 cursor-pointer hover:bg-gray-200 ${
                            isAssigned
                              ? "bg-yellow-200 text-gray-700 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => {
                            if (!isAssigned && !isSelected) {
                              setSelectedProducts([...selectedProducts, p._id]);
                              setProductPrices((prev) => ({
                                ...prev,
                                [p._id]: p.finalPrice,
                              }));
                              setOpen(false);
                            }
                          }}
                        >
                          <span>{p.productId}</span>
                          <span>
                            {p.product
                              ? new Date(p.product).toLocaleDateString()
                              : "-"}
                          </span>
                          <span>{p.finalPrice}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Products List */}
              <div className="mt-3">
                {selectedProducts.map((id, index) => {
                  const product = products.find((p) => p._id === id);
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 items-center bg-gray-100 p-2 rounded mb-2"
                    >
                      <span>{product?.productId || id}</span>
                      {/* <span>{product?.product || "-"}</span> */}
                      <span>
                        {product?.product ? product.product.split("T")[0] : "-"}
                      </span>

                      {/* <span>{product?.finalPrice}</span> */}
                      <input
                        title="nimber"
                        type="number"
                        // value={productPrices[id] || product?.finalPrice || 0}
                        value={
                          productPrices[id] !== undefined
                            ? productPrices[id]
                            : product?.finalPrice || 0
                        }
                        className="border p-1 w-24"
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setProductPrices((prev) => ({
                            ...prev,
                            [id]: value,
                          }));
                        }}
                      />
                      <button
                        className="text-red-500 font-bold col-span-1"
                        //                         onClick={() =>
                        //                           // setSelectedProducts(
                        //                           //   selectedProducts.filter((p) => p !== id),
                        //                           // )
                        //                           setSelectedProducts(selectedProducts.filter((p) => p !== id));

                        // setProductPrices((prev) => {
                        //   const updated = { ...prev };
                        //   delete updated[id];
                        //   return updated;
                        // });
                        //                         }
                        onClick={() => {
                          setSelectedProducts(
                            selectedProducts.filter((p) => p !== id),
                          );

                          setProductPrices((prev) => {
                            const updated = { ...prev };
                            delete updated[id];
                            return updated;
                          });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="mb-3">
              <label className="block mb-1">Status</label>
              <select
                title="status"
                className="w-full border p-2 rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="document sent">Document sent</option>
                <option value="escrow check">Escrow check</option>
                <option value="escrow source of funds">
                  Escrow source of funds
                </option>
                <option value="IR + INV">IR + INV</option>
                <option value="Paid">Paid</option>
                <option value="Certificate">Certificate</option>
                <option value="Delivery">Delivery</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {/* commisiom */}
            <div className="mb-3">
              <label className="block mb-1">Commission</label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
              />
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

        <div className="flex items-center gap-3 mt-4 mb-4 text-black">
          <input
            type="text"
            placeholder="Search by Client..."
            className="border p-2 rounded w-64 text-black"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
          />
          <div>
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
          </div>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>

        {/* Deals Table */}
        {filteredDeals.length > 0 && (
          // {/* Deals Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="record-table  min-w-[1200px] border-collapse text-sm  ">
              <thead className="">
                <tr>
                  <th>Reference No</th>
                  <th>Date</th>
                  <th>Broker</th>
                  <th>Status</th>
                  <th>Client</th>
                  <th>Products Types</th>
                  <th>Commission</th>
                  <th>Total Deal Amount</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>

              <tbody>
                {filteredDeals.map((deal, idx) => (
                  <tr key={deal._id || idx} className="relative">
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
                    <td className="border px-4 py-2">
                      {new Date(deal.date).toLocaleDateString("en-GB")}{" "}
                    </td>
                    <td className="border px-4 py-2">
                      {brokers.find((b) => b._id === deal.broker)?.fullname ||
                        brokers.find((b) => b._id === deal.broker)?.email ||
                        "N/A"}
                    </td>

                    <td className="border px-4 py-2">
                      <select
                        title="status"
                        value={deal.status}
                        onChange={(e) =>
                          deal._id &&
                          handleStatusChange(deal._id, e.target.value)
                        }
                        className="border p-1 rounded"
                      >
                        <option>Document sent</option>
                        <option>Escrow check</option>
                        <option>Escrow source of funds</option>
                        <option>IR + INV</option>
                        <option>Paid</option>
                        <option>Certificate</option>
                        <option>Delivery</option>
                        <option>Completed</option>
                      </select>
                    </td>

                    <td className="border px-4 py-2">
                      {
                        clients.find(
                          (c) => c.clientNumber.toString() === deal.client,
                        )?.firstName
                      }{" "}
                      {clients.find(
                        (c) => c.clientNumber.toString() === deal.client,
                      )?.lastName || deal.client}
                    </td>

                    <td className="border px-4 py-2">
                      {deal.products.map((item: any) => {
                        const productId = item.productId || item;
                        const price = item.price;
                        const product = products.find(
                          (p) => p._id === productId,
                        );
                        if (!product) return String(productId);

                        return (
                          <p
                            key={productId}
                            className="flex justify-between items-center mb-1"
                          >
                            <span>
                              {product.productId} |{" "}
                              {product.product
                                ? product.product.split("T")[0]
                                : "-"}
                            </span>
                            <span className="border-l px-4">
                              {price || product.finalPrice}
                            </span>
                          </p>
                        );
                      })}
                    </td>
                    <td className="border px-4 py-2">{deal.commission || 0}</td>
                    <td className="border px-4 py-2 font-bold text-green-600">
                      {calculateTotal(deal.products, deal.commission)}
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
