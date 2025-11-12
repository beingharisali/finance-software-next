"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import "../../../cssfiles/record.css";

export default function BrokerRecord() {
  const { user } = useAuthContext();
  const [brokers, setBrokers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrokers = async () => {
      try {
        if (user) {
          const users = await fetchUsers("broker"); // role filter
          setBrokers(users);
        }
      } catch (error) {
        console.error("Error fetching brokers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBrokers();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="record-container">
      <h1 className="record-header">Broker Records</h1>
      {loading ? (
        <p>Loading...</p>
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
            {brokers.map(broker => (
              <tr key={broker.id}>
                <td>{broker.fullname}</td>
                <td>{broker.email}</td>
                <td>{broker.role}</td>
                <td>{new Date(broker.createdAt || "").toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
