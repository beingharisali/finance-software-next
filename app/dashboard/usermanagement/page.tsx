
// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers, deleteUser } from "@/services/user.api";
// import type { User } from "@/types/user";
// import Link from "next/link";
// import ProtectedRoute from "@/utilies/ProtectedRoute";
// import CreateUser from "../../createusers/page";
// import "../../../cssfiles/record.css";
// import "../../../cssfiles/sidebarcomponents.css";
// import Sidebar from "@/app/dashboard/components/Sidebar";

// export default function UserManagement() {
//   const { user, logoutUser } = useAuthContext();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   // Load users and map _id → id
//   const loadUsers = async (roleFilter: string) => {
//     setLoading(true);
//     try {
//       const result: any = await fetchUsers(roleFilter);
//       const usersWithId = result.map((u: any) => ({
//         ...u,
//         id: u._id || u.id, // ensure each user has 'id'
//       }));
//       setUsers(usersWithId);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) loadUsers(filter);
//   }, [user, filter]);

//   const handleOpenModal = (u?: User) => {
//     setSelectedUser(u || null);
//     setShowModal(true);
//   };

//   // Delete user safely
//   const handleDeleteUser = async (id?: string) => {
//     if (!id) {
//       alert("Invalid user ID. Cannot delete.");
//       return;
//     }

//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await deleteUser(id);
//       setUsers(prev => prev.filter(u => u.id !== id));
//       alert("User deleted successfully");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.msg || "Delete failed!");
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <ProtectedRoute allowedRoles={["admin", "manager"]}>
//       <div className="dashboard-container">
//         {/* sidebar */}
//         <Sidebar activePage="User Management" />

      

//         <main className="main-content">
//           <div className="main-top">
//             <h1 className="header">User Management</h1>
//             <div className="top-right">
//               <span className="profile-name">{user?.fullname || user?.email}</span>
//               <button className="logout-btn" onClick={logoutUser}>Logout</button>
//             </div>
//           </div>

//           <div className="filter-section">
//             <select title="options" value={filter} onChange={e => setFilter(e.target.value)} className="filter-dropdown">
//               <option value="all">All Users</option>
//               <option value="manager">Managers</option>
//               <option value="agent">Agents</option>
//               <option value="broker">Brokers</option>
//             </select>
//             {user.role === "admin" && (
//               <button className="create-user" onClick={() => handleOpenModal()}>Create User</button>
//             )}
//           </div>

//           <div className="record-section">
//             {loading ? (
//               <p>Loading...</p>
//             ) : users.length === 0 ? (
//               <p>No users found</p>
//             ) : (
//               <table className="record-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Created At</th>
//                     {user.role === "admin" && <th>Actions</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(u => (
//                     <tr key={u.id}>
//                       <td>{u.fullname}</td>
//                       <td>{u.email}</td>
//                       <td>{u.role}</td>
//                       <td>{new Date(u.createdAt || "").toLocaleDateString()}</td>
//                       {user.role === "admin" && (
//                         <td>
//                           <button onClick={() => handleOpenModal(u)}>Edit</button>
//                           <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {showModal && (
//             <CreateUser user={selectedUser} onClose={() => { setShowModal(false); loadUsers(filter); }} />
//           )}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }
// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers, deleteUser, updateUserRole } from "@/services/user.api"; // added updateUserRole
// import type { User } from "@/types/user";
// import ProtectedRoute from "@/utilies/ProtectedRoute";
// import CreateUser from "../../createusers/page";
// import "../../../cssfiles/record.css";
// import "../../../cssfiles/sidebarcomponents.css";
// import Sidebar from "@/app/dashboard/components/Sidebar";

// export default function UserManagement() {
//   const { user, logoutUser } = useAuthContext();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   // Load users and map _id → id
//   const loadUsers = async (roleFilter: string) => {
//     setLoading(true);
//     try {
//       const result: any = await fetchUsers(roleFilter);
//       const usersWithId = result.map((u: any) => ({
//         ...u,
//         id: u._id || u.id, // ensure each user has 'id'
//       }));
//       setUsers(usersWithId);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) loadUsers(filter);
//   }, [user, filter]);

//   const handleOpenModal = (u?: User) => {
//     setSelectedUser(u || null);
//     setShowModal(true);
//   };

//   // Delete user safely
//   const handleDeleteUser = async (id?: string) => {
//     if (!id) {
//       alert("Invalid user ID. Cannot delete.");
//       return;
//     }

//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await deleteUser(id);
//       setUsers(prev => prev.filter(u => u.id !== id));
//       alert("User deleted successfully");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.msg || "Delete failed!");
//     }
//   };

//   // Update user role
//   const handleRoleChange = async (id: string, newRole: string) => {
//     try {
//       await updateUserRole(id, newRole);
//       setUsers(prev =>
//         prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
//       );
//       alert("Role updated successfully");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.msg || "Role update failed!");
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <ProtectedRoute allowedRoles={["admin", "manager"]}>
//       <div className="dashboard-container">
//         {/* sidebar */}
//         <Sidebar activePage="User Management" />

//         <main className="main-content">
//           <div className="main-top">
//             <h1 className="header">User Management</h1>
//             <div className="top-right">
//               <span className="profile-name">{user?.fullname || user?.email}</span>
//               <button className="logout-btn" onClick={logoutUser}>Logout</button>
//             </div>
//           </div>

//           <div className="filter-section">
//             <select
//               title="options"
//               value={filter}
//               onChange={e => setFilter(e.target.value)}
//               className="filter-dropdown"
//             >
//               <option value="all">All Users</option>
//               <option value="manager">Managers</option>
//               <option value="agent">Agents</option>
//               <option value="broker">Brokers</option>
//             </select>
//             {user.role === "admin" && (
//               <button className="create-user" onClick={() => handleOpenModal()}>
//                 Create User
//               </button>
//             )}
//           </div>

//           <div className="record-section">
//             {loading ? (
//               <p>Loading...</p>
//             ) : users.length === 0 ? (
//               <p>No users found</p>
//             ) : (
//               <table className="record-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Created At</th>
//                     {user.role === "admin" && <th>Actions</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(u => (
//                     <tr key={u.id}>
//                       <td>{u.fullname}</td>
//                       <td>{u.email}</td>
//                       <td>
//                         {user.role === "admin" ? (
//                           <select
//                             value={u.role}
//                             onChange={e => handleRoleChange(u.id, e.target.value)}
//                           >
//                             <option value="admin">Admin</option>
//                             <option value="manager">Manager</option>
//                             <option value="agent">Agent</option>
//                             <option value="broker">Broker</option>
//                           </select>
//                         ) : (
//                           u.role
//                         )}
//                       </td>
//                       <td>{new Date(u.createdAt || "").toLocaleDateString()}</td>
//                       {user.role === "admin" && (
//                         <td>
//                           <button onClick={() => handleOpenModal(u)}>Edit</button>
//                           <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {showModal && (
//             <CreateUser
//               user={selectedUser}
//               onClose={() => {
//                 setShowModal(false);
//                 loadUsers(filter);
//               }}
//             />
//           )}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers, deleteUser, updateUserRole } from "@/services/user.api";
// import type { User } from "@/types/user";
// import ProtectedRoute from "@/utilies/ProtectedRoute";
// import CreateUser from "../createusers/page";
// import "../../cssfiles/record.css";
// import "../../cssfiles/sidebarcomponents.css";
// import Sidebar from "@/app/dashboard/components/Sidebar";
// import "../../cssfiles/usermanagement.css";

// export default function UserManagement() {
//   const { user, logoutUser } = useAuthContext();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const loadUsers = async (roleFilter: string) => {
//     setLoading(true);
//     try {
//       const result: any = await fetchUsers(roleFilter);
//       let filtered = result;

//       // Manager should only see agents & brokers
//       if (user?.role === "manager") {
//         filtered = result.filter(
//           (u: any) => u.role === "agent" || u.role === "broker"
//         );
//       }

//       const usersWithId = filtered.map((u: any) => ({
//         ...u,
//         id: u._id || u.id,
//       }));

//       setUsers(usersWithId);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) loadUsers(filter);
//   }, [user, filter]);

//   const handleOpenModal = (u?: User) => {
//     setSelectedUser(u || null);
//     setShowModal(true);
//   };

//   const handleDeleteUser = async (id?: string) => {
//     if (!id) return alert("Invalid user ID.");
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await deleteUser(id);
//       setUsers(prev => prev.filter(u => u.id !== id));
//       alert("User deleted successfully");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.msg || "Delete failed!");
//     }
//   };

//   const handleRoleChange = async (id: string, newRole: string) => {
//     try {
//       await updateUserRole(id, newRole);
//       setUsers(prev =>
//         prev.map(u => (u.id === id ? { ...u, role: newRole } : u))
//       );
//       alert("Role updated successfully");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.msg || "Role update failed!");
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <ProtectedRoute allowedRoles={["admin", "manager"]}>
//       <div className="dashboard-container">
//         <Sidebar activePage="User Management" />
//         <main className="main-content">
//           <div className="main-top">
//             <h1 className="header">User Management</h1>
//             <div className="top-right">
//               <span className="profile-name">{user?.fullname || user?.email}</span>
//               <button className="logout-btn" onClick={logoutUser}>Logout</button>
//             </div>
//           </div>

//           <div className="filter-section">
//             <select
//               title="options"
//               value={filter}
//               onChange={e => setFilter(e.target.value)}
//               className="filter-dropdown"
//             >
//               <option value="all">All Users</option>
//               <option value="manager">Managers</option>
//               <option value="agent">Agents</option>
//               <option value="broker">Brokers</option>
//             </select>

//             {(user.role === "admin" || user.role === "manager") && (
//               <button className="create-user" onClick={() => handleOpenModal()}>
//                 Create User
//               </button>
//             )}
//           </div>

//           <div className="record-section">
//             {loading ? (
//               <p>Loading...</p>
//             ) : users.length === 0 ? (
//               <p>No users found</p>
//             ) : (
//               <table className="record-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>User Role</th>
//                     <th>Created At</th>
//                     {user.role === "admin" && <th>Actions</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(u => (
//                     <tr key={u.id}>
//                       <td>{u.fullname}</td>
//                       <td>{u.email}</td>
//                       <td>
//                         {user.role === "admin" ? (
//                           <div className="role-dropdown-wrapper">
//                             <select
//                               title="dropdown"
//                               className="role-dropdown white-dropdown"
//                               value={u.role}
//                               onChange={e => handleRoleChange(u.id, e.target.value)}
//                             >
//                               <option value="admin">Admin</option>
//                               <option value="manager">Manager</option>
//                               <option value="broker">Broker</option>
//                               <option value="agent">Assistant</option>
//                             </select>
//                           </div>
//                         ) : (
//                           u.role
//                         )}
//                       </td>
//                       <td>{new Date(u.createdAt || "").toLocaleDateString()}</td>
//                       {user.role === "admin" && (
//                         <td>
//                           <button
//                             className="delete-btn"
//                             onClick={() => handleDeleteUser(u.id)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {showModal && (
//             <CreateUser
//               role={user.role === "manager" ? "agent" : undefined} 
//               onClose={() => {
//                 setShowModal(false);
//                 loadUsers(filter);
//               }}
//               editUser={selectedUser || undefined}
//             />
//           )}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUsers, deleteUser, updateUserRole } from "@/services/user.api";
import type { User } from "@/types/user";
import ProtectedRoute from "@/utilies/ProtectedRoute";
import CreateUser from "../createusers/page";
import "../../cssfiles/record.css";
import "../../cssfiles/sidebarcomponents.css";
import Sidebar from "@/app/dashboard/components/Sidebar";
import "../../cssfiles/usermanagement.css";

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

      // Manager should only see assistants & brokers
      if (user?.role === "manager") {
        filtered = result.filter(
          (u: any) => u.role === "assistant" || u.role === "broker"
        );
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
      setUsers(prev => prev.filter(u => u.id !== id));
      alert("User deleted successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Delete failed!");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      // map frontend "Assistant" to backend "assistant"
      const roleValue = newRole.toLowerCase() === "assistant" ? "assistant" : newRole.toLowerCase();
      await updateUserRole(id, roleValue);
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, role: roleValue } : u))
      );
      alert("Role updated successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.msg || "Role update failed!");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
      <div className="dashboard-container">
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
            <select
              title="options"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="filter-dropdown"
            >
              <option value="all">All Users</option>
              <option value="manager">Managers</option>
              <option value="assistant">Assistants</option>
              <option value="broker">Brokers</option>
            </select>

            {(user.role === "admin" || user.role === "manager") && (
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
                    {user.role === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>
                        {user.role === "admin" ? (
                          <div className="role-dropdown-wrapper">
                            <select
                              title="dropdown"
                              className="role-dropdown white-dropdown"
                              value={u.role}
                              onChange={e => handleRoleChange(u.id, e.target.value)}
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
                      <td>{new Date(u.createdAt || "").toLocaleDateString()}</td>
                      {user.role === "admin" && (
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(u.id)}
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
              role={user.role === "manager" ? "assistant" : undefined} 
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
