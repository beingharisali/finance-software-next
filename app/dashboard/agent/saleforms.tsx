"use client";
import React, { useState, useEffect } from "react";
import "../../cssfiles/saleform.css";
import { useAuthContext } from "@/context/AuthContext";
import http from "@/services/http";

interface SaleModalProps {
  onClose: () => void;
  refreshSales: () => void;
}

export default function SaleModal({ onClose, refreshSales }: SaleModalProps) {

  const { user, loading} = useAuthContext();

  const [form, setForm] = useState({
    productType: "",         
    productId: "",           
    productDescription: "",  
    price: 0,
    broker: "",              
    commission: 0,          
  });

    useEffect(() => {
    console.log("USER INSIDE SALEMODAL (effect) ===> ", user);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      alert("User not logged in yet, please wait a moment...");
      return;
    }

    try {
      const res = await http.post("/sales", {
        ...form,
        agent: user.id, 
      });

      if (res.data.success) {
        alert("Product added successfully!");
        setForm({
          productType: "",
          productId: "",
          productDescription: "",
          price: 0,
          broker: "",
          commission: 0,
        });
        onClose();
        refreshSales();
      } else {
        alert("Failed to add product");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting product");
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
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
