"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/components/Sidebar";
import http from "@/services/http";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";
import { useRouter } from "next/navigation";
import CreateUser from "@/app/dashboard/createusers/page";
import { fetchUsers } from "@/services/user.api";
export default function ProductPage() {
  const [showCreateBrokerModal, setShowCreateBrokerModal] = useState(false);
  // new dropdown update

  const [brokers, setBrokers] = useState<any[]>([]);
  const { user, logoutUser } = useAuthContext();
  // filter
  const [brokerFilter, setBrokerFilter] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const users = await fetchUsers("broker");
      setBrokers(users);
    } catch (err) {
      console.error("Failed to fetch brokers", err);
      setBrokers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await http.get("/productRoute/all");
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(data);

      // Search filter
      if (search) {
        data = data.filter(
          (p: any) =>
            p.product?.toLowerCase().includes(search.toLowerCase()) ||
            p.liquidMake?.toLowerCase().includes(search.toLowerCase()) ||
            p.liquorMake?.toLowerCase().includes(search.toLowerCase()),
        );
      }

      // Date filter

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        data = data.filter((p: any) => {
          if (!p.product) return false;

          const date = new Date(p.product);
          return date >= start && date <= end;
        });
      }
      if (brokerFilter) {
        data = data.filter((p: any) => p.allocatedBroker === brokerFilter);
      }
      setProducts(data);
    } catch (error) {
      console.log("Fetch error", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setBrokerFilter("");

    try {
      setLoading(true);

      const res = await http.get("/productRoute/all");
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProducts(data);
    } catch (error) {
      console.log("Fetch error", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <Sidebar activePage="Product" />

      <main className="main-content">
        <div className="main-top">
          <h1 className="header">Products</h1>

          <div className="top-right">
            <span className="profile-name">{user.fullname || user.email}</span>
            <button className="logout-btn" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>

        {/* CSV Upload */}
        <form
          className="mb-10 flex justify-end items-center "
          onSubmit={async (e) => {
            e.preventDefault();
            const input =
              document.querySelector<HTMLInputElement>('input[name="file"]');
            if (!input?.files?.length) return alert("Select a file");

            const formData = new FormData();
            formData.append("file", input.files[0]);

            try {
              const res = await http.post(
                "/productRoute/importProduct",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                },
              );
              alert(res.data.msg);
              input.value = "";

              fetchProducts();
            } catch (err: any) {
              alert(err.response?.data?.msg || "Upload failed");
            }
          }}
        >
          <input
            type="file"
            name="file"
            className="border p-2 rounded text-black w-70"
          />
          <button
            type="submit"
            className="bg-[#0f526a] text-white px-4 py-2 rounded ml-2"
          >
            Upload CSV
          </button>
        </form>

        {/* SEARCH */}
        <div className="filter-row text-black">
          <div className="search-container search-center">
            <input
              type="text"
              placeholder="Search Product"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-btn" onClick={fetchProducts}>
              Search
            </button>
            <button className="reset-btn" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        {/* DATE FILTER */}
        <div className="w-full flex justify-end mb-4">
          {" "}
          {/* Outer container */}
          <div className="flex items-center gap-2">
            {" "}
            {/* Inner flex for inputs/buttons */}
            <span className="text-black">From:</span>
            <input
              type="date"
              className="border p-1 rounded text-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-black">To:</span>
            <input
              type="date"
              className="border p-1 rounded text-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="bg-[#033055] text-white px-3 py-1 rounded"
              onClick={fetchProducts}
            >
              Apply
            </button>
          </div>
        </div>
        {/* broker filter */}
        <div className="w-full flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-black">Filter by Broker:</span>

            <select
              className="border p-1 rounded text-black"
              value={brokerFilter}
              onChange={(e) => setBrokerFilter(e.target.value)}
            >
              <option value="">select broker</option>
              {[
                "Joe Coombes",
                "Alex Presley",
                "George Chapman",
                "Lochlainn",
                ...brokers.map((b) => b.fullname || b.email),
              ].map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button
              className="bg-[#033055] text-white px-3 py-1 rounded"
              onClick={fetchProducts}
            >
              Apply
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="record-wrapper overflow-x-auto   =..=.=.=mx-auto ">
          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="no-records text-black">No products found.</p>
          ) : (
            <table className="record-table min-w-[1200px] w-full border-collapse text-sm ">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Liquid/Make</th>

                  <th>A.Y.S</th>
                  <th>Cask No</th>
                  <th>Vessel</th>
                  <th>L/ALC</th>
                  <th>%VOL</th>
                  <th>Cost Price</th>
                  <th>Supplier Price</th>
                  <th>Final Price</th>
                  <th>Status</th>
                  <th>Allocate To</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr key={item.productId || item.id}>
                    <td>{item.productId || item.id}</td>
                    <td>{item.liquorMake || item.liquidMake}</td>
                    <td>
                      {item.product
                        ? new Date(item.product).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="text-right">{item.caskNo}</td>
                    <td>{item.vessel}</td>
                    <td className="text-right">
                      {item.lAlc !== undefined
                        ? Number(item.lAlc).toFixed(1)
                        : ""}
                    </td>

                    <td className="text-right">
                      {item.volPercent !== undefined
                        ? Number(item.volPercent).toFixed(1)
                        : ""}
                    </td>

                    <td>
                      {item.costPrice
                        ? `£${Number(item.costPrice).toFixed(2)}`
                        : ""}
                    </td>
                    {/* <td className="text-right">{item.supplierPrice}</td>
                    <td className="text-right">{item.finalPrice}</td> */}
                    <td>
                      {item.supplierPrice !== undefined
                        ? `£${Number(item.supplierPrice).toFixed(2)}`
                        : ""}
                    </td>
                    <td>
                      {item.finalPrice !== undefined
                        ? `£${Number(item.finalPrice).toFixed(2)}`
                        : ""}
                    </td>
                    {/* status */}

                    <td className="flex flex-col items-start gap-1">
                      <span
                        className={`px-2 py-1 rounded text-white font-semibold text-sm ${
                          item.status === "Available"
                            ? "bg-green-500"
                            : item.status === "On Hold"
                              ? "bg-yellow-500"
                              : item.status === "Sold"
                                ? "bg-red-500"
                                : "bg-gray-500"
                        }`}
                      >
                        {item.status || "Available"}
                      </span>

                      <small className="text-gray-700 text-xs">
                        {item.statusDate
                          ? new Date(item.statusDate).toLocaleDateString()
                          : ""}
                      </small>

                      <select
                        className="border p-1 rounded text-black text-sm"
                        value={item.status || "Available"}
                        onChange={async (e) => {
  const newStatus = e.target.value;
  try {
    // Patch the status in backend
    const res = await http.patch(`/productRoute/${item._id}/status`, { status: newStatus });

    // Use returned product from backend
    const updatedProduct = res.data.data;

    // Update only this product in local state
    setProducts((prev) =>
      prev.map((p) => (p._id === item._id ? updatedProduct : p))
    );
  } catch (err) {
    console.error("Failed to update status:", err);
    alert("Status update failed");
  }
}}
//                         onChange={async (e) => {
//   const selectedBrokerId = e.target.value;

//   if (selectedBrokerId === "add-new") {
//     setShowCreateBrokerModal(true);
//     return;
//   }

//   try {
//     const res = await http.patch(
//       `/productRoute/${item._id}/allocate`,
//       { brokerId: selectedBrokerId || "" }
//     );

//     const updatedProduct = res.data.data; 

//     setProducts((prev) =>
//       prev.map((p) => (p._id === item._id ? updatedProduct : p))
//     );
//   } catch (err) {
//     console.error("Failed to allocate broker:", err);
//     alert("Allocation failed, try again.");
//   }
// }}
                        // onChange={async (e) => {
                        //   const newStatus = e.target.value;
                        //   try {
                        //     await http.patch(
                        //       `/productRoute/${item._id}/status`,
                        //       {
                        //         status: newStatus,
                        //       },
                        //     );

                        //     setProducts((prev) =>
                        //       prev.map((p) =>
                        //         p._id === item._id
                        //           ? { ...p, status: newStatus }
                        //           : p,
                        //       ),
                        //     );
                        //   } catch (err) {
                        //     console.error("Failed to update status:", err);
                        //     alert("Status update failed");
                        //   }
                        // }}
                      >
                        <option>Available</option>
                        <option>On Hold</option>
                        <option>Sold</option>
                        <option>Unavailable</option>
                      </select>
                    </td>
                    {/* allocate broker */}
                    <td>
                      <select
                        className="border p-1 rounded text-black"
                        value={item.allocatedBroker || ""} 
                        onChange={async (e) => {
                          const selectedBrokerId = e.target.value;
                          if (selectedBrokerId === "add-new") {
                            setShowCreateBrokerModal(true);
                            return;
                          }

                          try {
                            // Patch selected broker to backend for this product
                            await http.patch(
                              `/productRoute/${item._id}/allocate`,
                              {
                                brokerId: selectedBrokerId,
                              },
                            );

                            // setProducts((prev) =>
                            //   prev.map((p) =>
                            //     p._id === item._id ? { ...p, allocatedBroker: selectedBrokerId } : p
                            //   )
                            // );
                            setProducts((prev) =>
                              prev.map((p) =>
                                p._id === item._id
                                  ? {
                                      ...p,
                                      allocatedBroker: selectedBrokerId,
                                      status: selectedBrokerId
                                        ? "On Hold"
                                        : "Available",
                                    }
                                  : p,
                              ),
                            );
                          } catch (err) {
                            console.error("Failed to allocate broker:", err);
                            alert("Allocation failed, try again.");
                          }
                        }}
                      >
                        <option value="">Select</option>
                        <option>Joe Coombes</option>
                        <option>Alex Presley</option>
                        <option>George Chapman</option>
                        <option>Lochlainn</option>
                        {brokers.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.fullname || b.email}
                          </option>
                        ))}
                        <option
                          value="add-new"
                          className="font-semibold border-t border-blue-950 bg-blue-950 text-white"
                        >
                          Add New Broker +
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Create Broker Modal */}
        {showCreateBrokerModal && (
          <CreateUser
            role="broker"
            onClose={() => {
              setShowCreateBrokerModal(false);
              fetchProducts();
              fetchBrokers();
            }}
          />
        )}
      </main>
    </div>
  );
}
