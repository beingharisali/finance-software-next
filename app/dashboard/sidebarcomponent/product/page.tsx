
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/components/Sidebar";

import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import "../../../cssfiles/transactionfilters.css";

export default function ProductPage() {
  const { user, logoutUser } = useAuthContext();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
     
      const res = await axios.get("http://localhost:5000/api/v1/productRoute/all");
let data = Array.isArray(res.data) ? res.data : res.data.data || [];
setProducts(data);

      // Search filter
      if (search) {
  data = data.filter((p: any) =>
    (p.product?.toLowerCase().includes(search.toLowerCase()) ||
     p.liquidMake?.toLowerCase().includes(search.toLowerCase()) ||
     p.liquorMake?.toLowerCase().includes(search.toLowerCase()))
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


  try {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/api/v1/productRoute/all");
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
            const input = document.querySelector<HTMLInputElement>(
              'input[name="file"]'
            );
            if (!input?.files?.length) return alert("Select a file");

            const formData = new FormData();
            formData.append("file", input.files[0]);

            try {
              const res = await axios.post(
                "http://localhost:5000/api/v1/productRoute/importProduct",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              alert(res.data.msg);
      input.value = ""; 

              fetchProducts();
            } catch (err: any) {
              alert(err.response?.data?.msg || "Upload failed");
            }
          }}
        
        >
          <input  type="file" name="file" className="border p-2 rounded text-black w-70" />
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
        <div className="w-full flex justify-end mb-4"> {/* Outer container */}
  <div className="flex items-center gap-2">  {/* Inner flex for inputs/buttons */}
    <span  className="text-black">From:</span>
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

        {/* TABLE */}
        <div className="record-wrapper">
          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="no-records">No products found.</p>
          ) : (
            <table className="record-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Liquid/Make</th>
                  <th>Product</th>
                  <th>Cask No</th>
                  <th>Vessel</th>
                  <th>L/ALC</th>
                  <th>%VOL</th>
                  <th>Cost Price</th>
                  <th>Supplier Price</th>
                  <th>Final Price</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr key={item.productId || item.id}>
                    <td>{item.productId || item.id}</td>
                    <td>{item.liquorMake || item.liquidMake}</td>
                    <td>{item.product ? new Date(item.product).toLocaleDateString() : ""}</td>
                    <td>{item.caskNo}</td>
                    <td>{item.vessel}</td>
                    <td>{item.lAlc}</td>
                    <td>{item.volPercent}</td>
                    <td>{item.costPrice}</td>
                    <td>{item.supplierPrice}</td>
                    <td>{item.finalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}