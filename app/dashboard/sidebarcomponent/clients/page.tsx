
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/components/Sidebar";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";
import http from "@/services/http";

interface Client {
  clientNumber: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  extraInfo?: string;
  dateOfBirth: string;
}

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

export default function CompanyCostPage() {
  const { user, logoutUser } = useAuthContext();
  const [clients, setClients] = useState<Client[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    extraInfo: "",
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown for client deals
  const [showClientDeals, setShowClientDeals] = useState(false);
  const [selectedClientDealsList, setSelectedClientDealsList] = useState<Deal[]>([]);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const res = await http.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Fetch clients error:", err);
      alert("Failed to fetch clients");
    }
  };

  // Fetch deals
  const fetchDeals = async () => {
    try {
      const res = await http.get("/deals");
      setDeals(res.data);
    } catch (err) {
      console.error("Fetch deals error:", err);
      alert("Failed to fetch deals");
    }
  };

  useEffect(() => {
    fetchClients();
    fetchDeals();
  }, []);

  if (!user) return <p>Loading...</p>;

  // CSV Upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Select a CSV file");
    if (!file.name.endsWith(".csv")) return alert("Please upload a CSV file");

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await http.post("/clients/import", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(
        `${res.data.msg}\nAdded: ${res.data.added}\nSkipped: ${res.data.skipped}`
      );

      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchClients();
    } catch (err: any) {
      console.error("CSV upload error:", err);
      alert(err.response?.data?.msg || "Upload failed");
    }
  };

  const handleSaveClient = async () => {
    try {
      const { firstName, lastName, email, phoneNumber, address, dateOfBirth } = formData;
      if (!firstName || !lastName || !email || !phoneNumber || !address || !dateOfBirth) {
        return alert("Please fill all fields");
      }

      if (editingClient) {
        await http.put(`/clients/${editingClient.clientNumber}`, formData);
        alert("Client updated successfully");
      } else {
        await http.post("/clients", formData);
        alert("Client created successfully");
      }

      setShowForm(false);
      setEditingClient(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        extraInfo: "",
      });
      fetchClients();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Error saving client");
    }
  };

  const handleEditClient = (client: Client) => {
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
      dateOfBirth: client.dateOfBirth,
      extraInfo: client.extraInfo || "",
    });
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (clientNumber: number) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await http.delete(`/clients/${clientNumber}`);
      alert("Client deleted successfully");
      fetchClients();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Error deleting client");
    }
  };

  return (
    <div className="dashboard-container flex">
      <Sidebar activePage="Clients" />

      <main className="main-content flex-1 p-6">
        {/* Top bar */}
        <div className="main-top flex justify-between items-center mb-6 text-black">
          <h1 className="header text-2xl font-bold">Clients Page</h1>
          <div className="top-right flex items-center gap-4">
            <div
              className="relative bg-[#0f526a] text-white px-4 py-2 rounded flex items-center gap-3 cursor-pointer"
              onClick={() => setShowClientDeals(!showClientDeals)}
            >
              <span className="font-semibold">Client Deals</span>
            </div>

            {showClientDeals && (
              <div className="absolute top-16 right-44 bg-white text-black shadow-lg rounded w-[350px] z-50">
                <div className="p-3 border-b font-semibold text-lg">
                  Clients Deals Summary
                </div>

                <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                  {clients.map((client) => {
                    const clientDeals = deals.filter(
                      (d) => d.client.toString() === client.clientNumber.toString()
                    );
                    const dealCount = clientDeals.length;

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
                          onClick={() =>
                            setSelectedClientDealsList(isExpanded ? [] : clientDeals)
                          }
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
                            <div className="grid grid-cols-3 font-semibold text-sm mb-1">
                              <span>Reference No</span>
                              <span>Date</span>
                              <span>Status</span>
                            </div>

                            {selectedClientDealsList.map((deal) => (
                              <div
                                key={deal._id}
                                className="grid grid-cols-3 text-sm p-1 border-b hover:bg-gray-50 transition"
                              >
                                <span>{deal.ref}</span>
                                <span>
                                  {new Date(deal.date).toLocaleDateString("en-GB")}
                                </span>
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

            <span className="profile-name">{user.fullname || user.email || "Guest"}</span>
            <button
              className="logout-btn  text-white px-3 py-1 rounded"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add button */}
        <div>
          <button
            className="bg-[#0f526a] text-white px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            ADD New Client
          </button>
        </div>

        {/* CSV Upload */}
        <form className="mb-6 flex gap-2 items-center justify-end" onSubmit={handleUpload}>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="border p-2 rounded text-black w-[280px]"
          />
          <button className="bg-[#0f526a] text-white px-4 py-2 rounded">Upload CSV</button>
        </form>

        {/* Form Modal */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
          >
            <div
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl mb-4">{editingClient ? "Edit Client" : "Add New Client"}</h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f526a] focus:border-[#0f526a] transition"
                />
                <input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f526a] focus:border-[#0f526a] transition"
                />
                <input
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f526a] focus:border-[#0f526a] transition"
                />
                <input
                  placeholder="Phone"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f526a] focus:border-[#0f526a] transition"
                />
                <input
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md col-span-2"
                />
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md col-span-2"
                />
                <textarea
                  placeholder="Extra Info / Notes"
                  value={formData.extraInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, extraInfo: e.target.value })
                  }
                  className="border border-gray-300 p-2.5 rounded-md col-span-2"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleSaveClient}
                  className="bg-[#0f526a] text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingClient(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clients Table */}
        <table className="record-table min-w-[1200px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Client Number</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Deals</th>
              <th className="p-2 border">Actions</th>
            </tr>
            
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.clientNumber}>
                <td className="p-2 border">{c.clientNumber}</td>
                <td className="p-2 border">{c.firstName} {c.lastName}</td>
                <td className="p-2 border">{c.email}</td>
                <td className="p-2 border">
                  {(() => {
                    const d = new Date(c.dateOfBirth);
                    return `${String(d.getUTCDate()).padStart(2, "0")}/${String(
                      d.getUTCMonth() + 1
                    ).padStart(2, "0")}/${d.getUTCFullYear()}`;
                  })()}
                </td>
                <td className="p-2 border">{c.phoneNumber}</td>
                <td className="p-2 border">{c.address}</td>
                <td className="p-2 border">{c.extraInfo}</td>
                <td className="p-2 border">
  {/* clientDeals calculate karna */}
  {(() => {
    const clientDeals = deals.filter(
      (d) => d.client.toString() === c.clientNumber.toString()
    );
    return (
      <button
        className="bg-green-600 text-white px-2 py-1 rounded"
        onClick={() => setSelectedClientDealsList(clientDeals)}
      >
        {clientDeals.length} {/* number of deals */}
      </button>
    );
  })()}
</td>

                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEditClient(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteClient(c.clientNumber)}
                  >
                    Delete
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}