
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers, deleteUser } from "@/services/user.api";
import type { User } from "@/types/user";
import Link from "next/link";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import CreateUser from "../../createusers/page";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import Sidebar from "@/app/dashboard/components/Sidebar";

export default function UserManagement() {
  const { user, logoutUser } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users and map _id → id
  const loadUsers = async (roleFilter: string) => {
    setLoading(true);
    try {
      const result: any = await fetchUsers(roleFilter);
      const usersWithId = result.map((u: any) => ({
        ...u,
        id: u._id || u.id, // ensure each user has 'id'
      }));
      setUsers(usersWithId);
    } catch (err) {
      console.log("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadUsers(filter);
  }, [user, filter]);

  const handleOpenModal = (u?: User) => {
    setSelectedUser(u || null);
    setShowModal(true);
  };

  // Delete user safely
  const handleDeleteUser = async (id?: string) => {
    if (!id) {
      alert("Invalid user ID. Cannot delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      alert("User deleted successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Delete failed!");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="dashboard-container">
        {/* sidebar */}
        <Sidebar activePage="User Management" />

      

        <main className="main-content">
          <div className="main-top">
            <h1 className="header">User Management</h1>
            <div className="top-right">
              <span className="profile-name">{user?.fullname || user?.email}</span>
              <button className="logout-btn" onClick={logoutUser}>Logout</button>
            </div>
          </div>

          <div className="filter-section">
            <select title="options" value={filter} onChange={e => setFilter(e.target.value)} className="filter-dropdown">
              <option value="all">All Users</option>
              <option value="manager">Managers</option>
              <option value="agent">Agents</option>
              <option value="broker">Brokers</option>
            </select>
            {user.role === "admin" && (
              <button className="create-user" onClick={() => handleOpenModal()}>Create User</button>
            )}
          </div>

          <div className="record-section">
            {loading ? (
              <p>Loading...</p>
            ) : users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <table className="record-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    {user.role === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{new Date(u.createdAt || "").toLocaleDateString()}</td>
                      {user.role === "admin" && (
                        <td>
                          <button onClick={() => handleOpenModal(u)}>Edit</button>
                          <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showModal && (
            <CreateUser user={selectedUser} onClose={() => { setShowModal(false); loadUsers(filter); }} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
