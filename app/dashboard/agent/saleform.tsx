
"use client";

import React, { useState } from "react";
import "../../cssfiles/saleform.css";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";

interface SaleModalProps {
  onClose: () => void;
  refreshSales: () => void;
}

export default function SaleModal({ onClose, refreshSales }: SaleModalProps) {
  const { user } = useAuthContext();

  const [form, setForm] = useState({
    saleName: "",
    productName: "",
    description: "",
    price: 0,
    clientName: "",
    rating: 0,
    review: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) return alert("Agent not logged in");

    try {
      const res = await http.post("/sales", {
        ...form,
        agentId: user.id,
      });

      if (res.data.success) {
        alert("Sale recorded successfully!");
        setForm({
          saleName: "",
          productName: "",
          description: "",
          price: 0,
          clientName: "",
          rating: 0,
          review: "",
          date: "",
        });
        onClose();
        refreshSales();
      } else {
        alert("Failed to record sale");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting sale");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Record New Sale</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="saleName">Sale Name</label>
              <input
                id="saleName"
                type="text"
                name="saleName"
                value={form.saleName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                id="productName"
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input
                id="clientName"
                type="text"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <input
                id="rating"
                type="number"
                name="rating"
                min={1}
                max={5}
                value={form.rating}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review">Review</label>
            <textarea
              id="review"
              name="review"
              value={form.review}
              onChange={handleChange}
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
