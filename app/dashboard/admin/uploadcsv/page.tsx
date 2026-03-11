
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

      if (res.data.duplicates > 0) {
  alert(
    `Message: ${res.data.message}\nSaved: ${res.data.totalSaved}\nDuplicates skipped: ${res.data.duplicates}`
  );
} else {
  alert(
    `Message: ${res.data.message}\nTotal saved: ${res.data.totalSaved}`
  );
}

      setFile(null); // Reset file input
      if (onUploadSuccess) onUploadSuccess();

    }
 
    catch (err: any) {
  console.error("CSV upload error:", err.response?.data || err.message);
  alert(
    `CSV upload failed: ${
      err.response?.data?.message || err.message || "Unknown error"
    }`
  );
}
    finally {
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
