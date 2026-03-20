
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

export default function CompanyCostPage() {
  const { user, logoutUser } = useAuthContext();
  const [clients, setClients] = useState<Client[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);

  // ✅ FIX: form state added
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });

  // Fetch client list
  const fetchClients = async () => {
    try {
      const res = await http.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Fetch clients error:", err);
      alert("Failed to fetch clients");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (!user) return <p>Loading...</p>;

  // CSV Upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Select a CSV file");
    if (!file.name.endsWith(".csv"))
      return alert("Please upload a CSV file");

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

  // ✅ FIX: Create client function
  const handleCreateClient = async () => {
    try {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phoneNumber ||
        !formData.address ||
        !formData.dateOfBirth
      ) {
        return alert("Please fill all fields");
      }

      await http.post("/clients", formData);

      alert("Client created successfully");

      setShowForm(false);

      // reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
      });

      fetchClients();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Error creating client");
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
            <span className="profile-name">
              {user.fullname || user.email || "Guest"}
            </span>
            <button
              className="logout-btn  text-white px-3 py-1 rounded"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        </div>
 
        {/* Add button */}
        <div >
          <button
            className="bg-[#0f526a] text-white px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            ADD New Client
          </button>
        </div>

        {/* CSV Upload */}
        <form
          className="mb-6 flex gap-2 items-center justify-end"
          onSubmit={handleUpload}
        >
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="border p-2 rounded text-black w-[280px]"
          />
          <button className="bg-[#0f526a] text-white px-4 py-2 rounded">
            Upload CSV
          </button>
        </form>

        {/*  Form  this is field*/}
        {showForm && (
          <div className="bg-white p-4 border rounded mb-6 text-black">
            <h2 className="text-xl mb-4">Add New Client  </h2>

            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="border p-2"
              />

              <input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="border p-2"
              />

              <input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border p-2"
              />

              <input
                placeholder="Phone"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="border p-2"
              />

              <input
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border p-2 col-span-2"
              />

              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="border p-2 col-span-2"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCreateClient}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <table className=" record-table min-w-[1200px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Address</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.clientNumber}>
                <td className="p-2 border">{c.clientNumber}</td>
                <td className="p-2 border">
                  {c.firstName} {c.lastName}
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}