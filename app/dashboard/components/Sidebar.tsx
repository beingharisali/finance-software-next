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

  const links = [
    { name: "Dashboard", path: "/dashboard/admin", roles: ["admin","manager","assistant","broker"] },
    { name: "User Management", path: "/dashboard/admin/usermanagement", roles: ["admin","manager"] },
    { name: "Manager Record", path: "/dashboard/admin/adminmanagerrecord", roles: ["admin","manager","assistant"] },
    { name: "Agent Record", path: "/dashboard/admin/adminagentrecord", roles: ["admin","manager","assistant"] },
    { name: "Broker Record", path: "/dashboard/admin/adminbrokerrecord", roles: ["admin","manager","assistant","broker"] },
    { name: "Transaction", path: "/dashboard/admin/transaction", roles: ["admin","manager","assistant"] },
    { name: "Payment", path: "/dashboard/sidebarcomponent/payment", roles: ["admin","manager"] },
    { name: "Card", path: "/dashboard/sidebarcomponent/card", roles: ["admin","manager","assistant"] },
    { name: "Insights", path: "/dashboard/sidebarcomponent/insight", roles: ["admin","manager","assistant"] },
    { name: "Settings", path: "/dashboard/sidebarcomponent/settings", roles: ["admin"] },
  ];

  return (
    <nav className="sidebar">
      <h1>Finance</h1>
      <div className="nav-list">
        {links.map(link => 
          link.roles.includes(user.role) && (
            <Link
              key={link.name}
              href={link.path}
              className={`nav-item ${activePage === link.name ? "active" : ""}`}
            >
              {link.name}
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
