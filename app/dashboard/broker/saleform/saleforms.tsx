
"use client";

import React, { useState, useEffect } from "react";
import "../../../cssfiles/saleform.css";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";

interface SaleModalProps {
  onClose: () => void;
  refreshSales: (sale: any) => void;
  brokers: { _id: string; fullname: string; email: string }[];
}

export default function SaleModal({ onClose, refreshSales, brokers }: SaleModalProps) {
  const { user, loading } = useAuthContext();
  const [form, setForm] = useState({
    productType: "",
    productId: "",
    productDescription: "",
    price: 0,
    broker: "",
    commission: 0,
  });

  useEffect(() => {
    if (user?.role === "broker") setForm(prev => ({ ...prev, broker: user._id }));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return alert("User not logged in");

    const payload: any = {
      productType: form.productType.trim(),
      productId: form.productId.trim(),
      productDescription: form.productDescription.trim(),
      price: Number(form.price),
      commission: Number(form.commission),
      broker: user.role === "broker" ? user._id : form.broker,
    };

    if (!payload.productType || !payload.productId || !payload.productDescription || !payload.broker) {
      return alert("Please fill all required fields");
    }

    try {
      const res = await http.post("/sales", payload);
      if (res.data.success) {
        alert("Sale added successfully!");
        refreshSales(res.data.sale);
        onClose();
        setForm({
          productType: "",
          productId: "",
          productDescription: "",
          price: 0,
          commission: 0,
          broker: user.role === "broker" ? user._id : "",
        });
      } else {
        alert(res.data.message || "Failed to add sale");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting sale");
    }
  };

  if (loading || !user) {
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <div className="modal-header"><h2>Loading user...</h2></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Record New Sale</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productType">Product Type</label>
              <select id="productType" name="productType" value={form.productType} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Gold">Gold</option>
                <option value="Whisky">Whisky</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productId">Product ID</label>
            <input id="productId" type="text" name="productId" value={form.productId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Product Description</label>
            <textarea id="productDescription" name="productDescription" value={form.productDescription} onChange={handleChange} required />
          </div>

          {user.role !== "broker" && (
            <div className="form-group">
              <label htmlFor="broker">Select Broker</label>
              <select id="broker" name="broker" value={form.broker} onChange={handleChange} required>
                <option value="">Select Broker</option>
                {brokers.map(b => (
                  <option key={b._id} value={b._id}>{b.fullname || b.email}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input id="price" type="number" name="price" min={0} value={form.price} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="commission">Commission</label>
              <input id="commission" type="number" name="commission" min={0} value={form.commission} onChange={handleChange} required />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
