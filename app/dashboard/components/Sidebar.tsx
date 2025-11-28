
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
      { name: "Broker Record", path: "/dashboard/adminbrokerrecord" },
      { name: "Finance", path: "/dashboard/transaction" },
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Companycost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
      { name: "Settings", path: "/dashboard/sidebarcomponent/settings" },
    ],

    manager: [
      { name: "Dashboard", path: "/dashboard/manager" },
      // { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" },
      // { name: "Agent Record", path: "/dashboard/admin/adminagentrecord" },
      { name: "Broker Record", path: "/dashboard/adminbrokerrecord" },
      { name: "Finance", path: "/dashboard/transaction" },
      { name: "Sale", path: "/dashboard/sidebarcomponent/sale" },
      { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
      { name: "Card", path: "/dashboard/sidebarcomponent/card" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
    ],

    broker: [
      { name: "Dashboard", path: "/dashboard/broker" },
      // { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord" },
      // { name: "Agent Record", path: "/dashboard/admin/adminagentrecord" },
      // { name: "Broker Record", path: "/dashboard/adminbrokerrecord" },
      { name: "Payment", path: "/dashboard/sidebarcomponent/payment" },
      { name: "Card", path: "/dashboard/sidebarcomponent/card" },
      { name: "Insights", path: "/dashboard/sidebarcomponent/insight" },
    ],

    agent: [
      { name: "Dashboardagent", path: "/dashboard/agent" },
      { name: "Companycost", path: "/dashboard/sidebarcomponent/companycost" },
      { name: "Product", path: "/dashboard/sidebarcomponent/product" },
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
