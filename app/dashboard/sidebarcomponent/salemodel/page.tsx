"use client";
import React, { useState, useEffect } from "react";
import "../../../cssfiles/saleform.css";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";

interface Agent {
  _id: string;
  fullname: string;
  email: string;
}

interface SaleModalProps {
  onClose: () => void;
  refreshSales: () => void;
  agents?: Agent[]; // for admin/manager to select agent
  editingSale?: any | null;
}

export default function SaleModal({
  onClose,
  refreshSales,
  agents = [],
  editingSale,
}: SaleModalProps) {
  const { user, loading } = useAuthContext();

  const [form, setForm] = useState({
    productType: "",
    productId: "",
    productDescription: "",
    price: 0,
    broker: "",
    commission: 0,
    agent: user?._id || "", // default current user
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (editingSale) {
      setForm({
        productType: editingSale.productType,
        productId: editingSale.productId,
        productDescription: editingSale.productDescription,
        price: editingSale.price,
        broker: editingSale.broker,
        commission: editingSale.commission,
        agent: editingSale.agent?._id || user?._id || "",
      });
    } else {
      setForm({
        productType: "",
        productId: "",
        productDescription: "",
        price: 0,
        broker: "",
        commission: 0,
        agent: user?._id || "",
      });
    }
  }, [editingSale, user?._id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("User not logged in yet, please wait...");
      return;
    }

    try {
      if (editingSale) {
        // Update sale
        await http.put(`/sales/${editingSale._id}`, form);
        alert("Sale updated successfully!");
      } else {
        // Add new sale
        await http.post("/sales", form);
        alert("Sale added successfully!");
      }
      refreshSales();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting sale");
    }
  };

  if (loading || !user) {
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <div className="modal-header">
            <h2>Loading user...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingSale ? "Edit Sale" : "Record New Sale"}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Admin/Manager can select agent */}
          {agents.length > 0 && (
            <div className="form-group">
              <label htmlFor="agent">Agent</label>
              <select
                name="agent"
                id="agent"
                value={form.agent}
                onChange={handleChange}
                required
              >
                <option value="">Select Agent</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.fullname} ({a.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="productType">Product Type</label>
            <select
              id="productType"
              name="productType"
              value={form.productType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Gold">Gold</option>
              <option value="Whisky">Whisky</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="productId">Product ID</label>
            <input
              id="productId"
              type="text"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Product Description</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={form.productDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="broker">Broker</label>
            <input
              id="broker"
              type="text"
              name="broker"
              value={form.broker}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                name="price"
                min={0}
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="commission">Commission</label>
              <input
                id="commission"
                type="number"
                name="commission"
                min={0}
                value={form.commission}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">
              {editingSale ? "Update" : "Submit"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
