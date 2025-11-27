

// export default Sidebar;

// "use client";
// import React from "react";
// import Link from "next/link";
// import { useAuthContext } from "@/context/AuthContext";

// interface SidebarProps {
//   activePage?: string; // optional, highlight active link
// }

// const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
//   const { user } = useAuthContext();

//   if (!user) return null;

//   const links = [
//      { name: "Dashboard", path: `/dashboard/${user.role}`, roles: ["admin","manager","broker","agent"] },
//     // { name: "Dashboard", path: "/dashboard/admin", roles: ["admin","manager","assistant","broker"] },
//     { name: "User Management", path: "/dashboard/admin/usermanagement", roles: ["admin"] },
//     { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord", roles: ["admin","manager","assistant"] },
//     { name: "Agent Record", path: "/dashboard/admin/adminagentrecord", roles: ["admin","manager","assistant"] },
//     { name: "Broker Record", path: "/dashboard/admin/adminbrokerrecord", roles: ["admin","manager","assistant","broker"] },
//     { name: "Transaction", path: "/dashboard/admin/transaction", roles: ["admin"] },
//     { name: "Payment", path: "/dashboard/sidebarcomponent/payment", roles: ["admin","manager"] },
//     { name: "Card", path: "/dashboard/sidebarcomponent/card", roles: ["admin","manager","assistant"] },
//     { name: "Insights", path: "/dashboard/sidebarcomponent/insight", roles: ["admin","manager","assistant"] },
//     { name: "Settings", path: "/dashboard/sidebarcomponent/settings", roles: ["admin"] },
//   ];

//   return (
//     <nav className="sidebar">
//       <h1>Finance</h1>
//       <div className="nav-list">
//         {links.map(link => 
//           link.roles.includes(user.role) && (
//             <Link
//               key={link.name}
//               href={link.path}
//               className={`nav-item ${activePage === link.name ? "active" : ""}`}
//             >
//               {link.name}
//             </Link>
//           )
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Sidebar;
"use client";

import React from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

interface SidebarProps {
  activePage?: string; // optional, highlight active link
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const { user } = useAuthContext();
  if (!user) return null;

  // ---------------------- ROLE BASED LINKS ----------------------
  const roleBasedLinks: Record<string, { name: string; path: string }[]> = {
    admin: [
      { name: "Dashboard", path: "/dashboard/admin" },
      { name: "User Management", path: "/dashboard/admin/usermanagement" },
      { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" },
      { name: "Agent Record", path: "/dashboard/admin/adminagentrecord" },
      { name: "Broker Record", path: "/dashboard/admin/adminbrokerrecord" },
      { name: "Transaction", path: "/dashboard/admin/transaction" },
      { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
      { name: "Card", path: "/dashboard/sidebarcomponent/card" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
      { name: "Settings", path: "/dashboard/sidebarcomponent/settings" },
    ],
    manager: [
      { name: "Dashboard", path: "/dashboard/manager" },
      { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" }, // admin page shown to manager
      { name: "Agent Record", path: "/dashboard/admin/adminagentrecord" },     // admin page shown to manager
      { name: "Broker Record", path: "/dashboard/admin/adminbrokerrecord" },   // admin page shown to manager
      { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
      { name: "Card", path: "/dashboard/sidebarcomponent/card" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
    ],
    broker: [
      { name: "Dashboard", path: "/dashboard/broker" },
      { name: "Broker Record", path: "/dashboard/admin/adminbrokerrecord" },
    ],
    agent: [
      { name: "Dashboard", path: "/dashboard/agent" },
    ],
  };

  const links = roleBasedLinks[user.role] || [];

  // ---------------------- JSX ----------------------
  return (
    <nav className="sidebar">
      <h1>Finance</h1>
      <div className="nav-list">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`nav-item ${activePage === link.name ? "active" : ""}`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
