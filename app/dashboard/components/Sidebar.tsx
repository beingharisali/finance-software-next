
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

      { name: "User Management", path: "/dashboard/sidebarcomponent/usermanagement" },
      { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" },
      { name: "Assistant Record", path: "/dashboard/admin/adminagentrecord" },
      { name: " Broker Record", path: "/dashboard/adminbrokerrecord" },
      { name: "Finance", path: "/dashboard/sidebarcomponent/transaction" },

      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Company Cost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },
      { name: "Deals", path: "/dashboard/sidebarcomponent/deals" },

    ],
    manager: [
      { name: "Dashboard", path: "/dashboard/managers" },

        { name: "User Management", path: "/dashboard/sidebarcomponent/usermanagement" },
      { name: "Broker Record", path: "/dashboard/adminbrokerrecord" },

        { name: "Finance", path: "/dashboard/sidebarcomponent/transaction" },
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Company Cost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },

    ],
     assistant: [
      { name: "Dashboard", path: "/dashboard/assistant" }, 
      // { name: "User Management", path: "/dashboard/usermanagement" },
  { name: "User Management", path: "/dashboard/sidebarcomponent/usermanagement" },
      // Finance removed for assistant
      { name: "Broker Record", path: "/dashboard/adminbrokerrecord" },
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Company Cost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },

    ],
    broker: [
      { name: "Dashboardagent", path: "/dashboard/broker" },
      { name: "Broker Sale", path: "/dashboard/brokersaleform" },
      // { name: "Company Cost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },
      { name: "Deals", path: "/dashboard/sidebarcomponent/deals" },
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
// sidebar