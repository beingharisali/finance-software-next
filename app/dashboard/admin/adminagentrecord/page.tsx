"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers } from "@/services/user.api";
import type { User } from "@/types/user";
import "../../../cssfiles/record.css"; 

export default function ManagerAgentRecord() {
  const { user } = useAuthContext();
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        if (user) {
          const users = await fetchUsers("agent"); // role filter
          setAgents(users);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAgents();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="record-container">
      <h1 className="record-header">Agent Records</h1>
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
            {agents.map(agent => (
              <tr key={agent.id}>
                <td>{agent.fullname}</td>
                <td>{agent.email}</td>
                <td>{agent.role}</td>
                <td>{new Date(agent.createdAt || "").toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
