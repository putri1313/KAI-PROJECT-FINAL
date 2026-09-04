import React from "react";
import SidebarAdmin from "./SidebarAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => (
  <div className="flex">
    <SidebarAdmin />
    <main className="flex-1 ml-16 lg:ml-64 p-4 min-h-screen bg-gray-50">
      {children}
    </main>
  </div>
);

export default AdminLayout;
