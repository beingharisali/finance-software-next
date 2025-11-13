// "use client";
// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers } from "@/services/user.api";
// import type { User } from "@/types/user";
// import "../../../cssfiles/record.css"; 

// export default function ManagerAgentRecord() {
//   const { user } = useAuthContext();
//   const [agents, setAgents] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadAgents = async () => {
//       try {
//         if (user) {
//           const users = await fetchUsers("agent"); // role filter
//           setAgents(users);
//         }
//       } catch (error) {
//         console.error("Error fetching agents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAgents();
//   }, [user]);

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="record-container">
//       <h1 className="record-header">Agent Records</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="record-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agents.map(agent => (
//               <tr key={agent.id}>
//                 <td>{agent.fullname}</td>
//                 <td>{agent.email}</td>
//                 <td>{agent.role}</td>
//                 <td>{new Date(agent.createdAt || "").toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
// "use client";
// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "@/context/AuthContext";
// import { fetchUsers } from "@/services/user.api";
// import "../../../cssfiles/record.css";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   createdAt?: string;
//   createdBy?: {
//     _id: string;
//     name: string;
//     role: string;
//   };
// }

// export default function ManagerAgentRecord() {
//   const { user } = useAuthContext();
//   const [usersList, setUsersList] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         if (!user || user.role !== "manager") return;

//         // Backend now only returns users created by this manager
//         const agents = await fetchUsers("agent");
//         const brokers = await fetchUsers("broker");

//         setUsersList([...agents, ...brokers]);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUsers();
//   }, [user]);

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="record-container">
//       <h1 className="record-header">My Created Users</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : usersList.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table className="record-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Created By</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {usersList.map((u) => (
//               <tr key={u._id}>
//                 <td>{u.name}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>{u.createdBy?.name}</td>
//                 <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
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
          const users = await fetchUsers("agent"); // fetch only agents
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
      ) : agents.length === 0 ? (
        <p>No agents found.</p>
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
                <td>{agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
