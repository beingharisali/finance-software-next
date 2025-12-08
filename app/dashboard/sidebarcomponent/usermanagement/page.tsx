"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers, deleteUser, updateUserRole } from "@/services/user.api";
import type { User } from "@/types/user";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import CreateUser from "../../createusers/page";
import "../../../cssfiles/record.css";
import "../../../cssfiles/sidebarcomponents.css";
import Sidebar from "@/app/dashboard/components/Sidebar";
import "../../../cssfiles/usermanagement.css";

export default function UserManagement() {
  const { user, logoutUser } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = async (roleFilter: string) => {
    setLoading(true);
    try {
      const result: any = await fetchUsers(roleFilter);
      let filtered = result;

      if (user?.role === "manager") {
        // Manager sees only assistants & brokers
        filtered = result.filter(
          (u: any) => u.role === "assistant" || u.role === "broker"
        );
      } else if (user?.role === "assistant") {
        // Assistant sees only brokers
        filtered = result.filter((u: any) => u.role === "broker");
      }

      const usersWithId = filtered.map((u: any) => ({
        ...u,
        id: u._id || u.id,
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

  const handleDeleteUser = async (id?: string) => {
    if (!id) return alert("Invalid user ID.");
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Delete failed!");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const roleValue =
        newRole.toLowerCase() === "assistant"
          ? "assistant"
          : newRole.toLowerCase();
      await updateUserRole(id, roleValue);
      setUsers((prev) =>
  prev.map((u) => (u._id === id ? { ...u, role: roleValue } : u))
);

      
      alert("Role updated successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Role update failed!");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin", "manager", "assistant"]}>
      <div className="dashboard-container">
        <Sidebar activePage="User Management" />
        <main className="main-content">
          <div className="main-top">
            <h1 className="header">User Management</h1>
            <div className="top-right">
              <span className="profile-name">
                {user?.fullname || user?.email}
              </span>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          </div>

          <div className="filter-section">
            <select
              title="options"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-dropdown"
            >
              <option value="all">All Users</option>
              <option value="manager">Managers</option>
              <option value="assistant">Assistants</option>
              <option value="broker">Brokers</option>
            </select>

            {/* Show create button for admin, manager, and assistant */}
            {(user.role === "admin" ||
              user.role === "manager" ||
              user.role === "assistant") && (
              <button className="create-user" onClick={() => handleOpenModal()}>
                Create User
              </button>
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
                    <th>User Role</th>
                    <th>Created At</th>
                    {(user.role === "admin" || user.role === "manager") && (
                      <th>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>
                        {user.role === "admin" ? (
                          <div className="role-dropdown-wrapper">
                            <select
                              title="dropdown"
                              className="role-dropdown white-dropdown"
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(u._id, e.target.value)
                              }
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="broker">Broker</option>
                              <option value="assistant">Assistant</option>
                            </select>
                          </div>
                        ) : (
                          u.role
                        )}
                      </td>
                      <td>
                        {new Date(u.createdAt || "").toLocaleDateString()}
                      </td>
                      {(user.role === "admin" || user.role === "manager") && (
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showModal && (
            <CreateUser
              role={
                user.role === "manager" || user.role === "assistant"
                  ? "assistant"
                  : undefined
              }
              onClose={() => {
                setShowModal(false);
                loadUsers(filter);
              }}
              editUser={selectedUser || undefined}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
