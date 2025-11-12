"use client";

import React, { useEffect, useState } from "react";
import http from "@/services/http";
import { useAuthContext } from "@/context/AuthContext";

interface User {
  id: string;
  fullname: string;
  email: string;
  role: "admin" | "manager" | "agent" | "broker";
  createdAt?: string;
}

export default function UsersTable() {
  const { user } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const res = await http.get("/users"); // backend route
        if (res.data.success) setUsers(res.data.users);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [user]);

  if (!user) return null; // show nothing if user not loaded

  return (
    <div>
      <h2>{user.role.toUpperCase()} Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullname}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
