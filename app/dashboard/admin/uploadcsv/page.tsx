
"use client";

import React, { useState } from "react";
import http from "../../../../services/http"; 
import "../../../cssfiles/uploadCSV.css"; 

interface UploadCSVProps {
  onUploadSuccess?: () => void;
}

export default function UploadCSV({ onUploadSuccess }: UploadCSVProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await http.post("/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Duplicate-aware alert
      if (res.data.duplicates > 0) {
        alert(`Saved: ${res.data.totalSaved}, Duplicates skipped: ${res.data.duplicates}`);
      } else {
        alert(`CSV uploaded successfully! Total saved: ${res.data.totalSaved}`);
      }

      setFile(null); // Reset file input
      if (onUploadSuccess) onUploadSuccess();

    } catch (err) {
      console.error(err);
      alert("CSV upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-csv-container">
      <label htmlFor="csvFile" className="upload-csv-label">
        Select CSV file:
      </label>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileChange}
        className="upload-csv-input"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="upload-csv-button"
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}
