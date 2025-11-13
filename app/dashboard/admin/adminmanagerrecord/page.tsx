
"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import "../../../cssfiles/record.css";

export default function ManagerRecord() {
  const { user } = useAuthContext();
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        if (user) {
          const users = await fetchUsers("manager");
          setManagers(users);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadManagers();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="record-container">
      <h1 className="record-header">Manager Records</h1>
      {loading ? (
        <p>Loading...</p>
      ) : managers.length === 0 ? (
        <p>No managers found.</p>
      ) : (
        <table className="record-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td>{manager.fullname}</td>
                <td>{manager.email}</td>
                <td>{manager.role}</td>
                <td>{new Date(manager.createdAt || "").toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
