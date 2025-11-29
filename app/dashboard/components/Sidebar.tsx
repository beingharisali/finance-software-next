

// "use client";

// import React from "react";
// import Link from "next/link";
// import { useAuthContext } from "@/context/AuthContext";

// interface SidebarProps {
//   activePage?: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
//   const { user } = useAuthContext();
//   if (!user) return null;

//   const roleBasedLinks: Record<string, { name: string; path: string }[]> = {
//     admin: [
//       { name: "Dashboard", path: "/dashboard/admin" },
//       { name: "User Management", path: "/dashboard/usermanagement" },
//       { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" },
//       { name: "Agent Record", path: "/dashboard/admin/adminagentrecord" },
//       { name: "Assistant Record", path: "/dashboard/admin/assistantrecord" },
//       { name: "Finance", path: "/dashboard/transaction" },
//       { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
//       { name: "Companycost", path: "/dashboard/sidebarcomponent/companycost" },
//       { name: "Product", path: "/dashboard/sidebarcomponent/product" },
//       { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
//       { name: "Settings", path: "/dashboard/sidebarcomponent/settings" },
//     ],
//     manager: [
//       { name: "Dashboard", path: "/dashboard/managers" },
//       { name: "User Management", path: "/dashboard/usermanagement" },
//       { name: "Assistant Record", path: "/dashboard/admin/assistantrecord" },
//       { name: "Finance", path: "/dashboard/transaction" },
//       { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
//       { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
//       { name: "Card", path: "/dashboard/sidebarcomponent/card" },
//       { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
//     ],
//     broker: [
//       { name: "Dashboardagent", path: "/dashboard/broker" },
//       { name: "Companycost", path: "/dashboard/sidebarcomponent/companycost" },
//       { name: "Product", path: "/dashboard/sidebarcomponent/product" },
//       { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
//     ],
//     assistant: [
//       { name: "Dashboardassistant", path: "/dashboard/assistant" },
//       { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
//       { name: "Card", path: "/dashboard/sidebarcomponent/card" },
//       { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
//     ],
//   };

//   const links = roleBasedLinks[user.role] || [];

//   return (
//     <nav className="sidebar">
//       <h1>Finance</h1>
//       <div className="nav-list">
//         {links.map((link) => (
//           <Link
//             key={link.name}
//             href={link.path}
//             className={`nav-item ${activePage === link.name ? "active" : ""}`}
//           >
//             {link.name}
//           </Link>
//         ))}
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
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const { user } = useAuthContext();
  if (!user) return null;

  const roleBasedLinks: Record<string, { name: string; path: string }[]> = {
    admin: [
      { name: "Dashboard", path: "/dashboard/admin" },
      { name: "User Management", path: "/dashboard/usermanagement" },
      { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" },
      { name: "Broker Record", path: "/dashboard/admin/adminagentrecord" },
      { name: "Assistant Record", path: "/dashboard/assistantrecord" },
      { name: "Finance", path: "/dashboard/transaction" },
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Companycost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
      { name: "Settings", path: "/dashboard/sidebarcomponent/settings" },
    ],
    manager: [
      { name: "Dashboard", path: "/dashboard/managers" },
      { name: "User Management", path: "/dashboard/usermanagement" },
      { name: "Assistant Record", path: "/dashboard/assistantrecord" },
      { name: "Finance", path: "/dashboard/transaction" },
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
      { name: "Card", path: "/dashboard/sidebarcomponent/card" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
    ],
     assistant: [
      { name: "Dashboard", path: "/dashboard/assistant" }, // same as manager
      // { name: "User Management", path: "/dashboard/usermanagement" },
      // { name: "Assistant Record", path: "/dashboard/assistantrecord" },
      // Finance removed for assistant
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
      { name: "Card", path: "/dashboard/sidebarcomponent/card" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
    ],
    broker: [
      { name: "Dashboardagent", path: "/dashboard/broker" },
      { name: "Companycost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
    ],
   
  };

  const links = roleBasedLinks[user.role] || [];

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
