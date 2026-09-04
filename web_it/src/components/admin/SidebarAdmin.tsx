import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Target,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Network,
  Building,
  Camera,
  Ticket,
  ClipboardList,
  AppWindow,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoKai from "@/assests/logo-kai.png";
import path from "path";

// Menu admin
const adminMenu = [
  { path: "/admin/edit-profil", icon: User, label: "Edit Profil" },
  { path: "/admin/edit-visimisi", icon: Target, label: "Edit Visi Misi & KPI" },
  {
    path: "/admin/edit-struktur",
    icon: Users,
    label: "Edit Struktur Organisasi",
  },
  { path: "/admin/edit-stasiun", icon: Building, label: "Edit Data Stasiun Divre IV" },
  { path: "/admin/edit-cctv", icon: Camera, label: "Edit Data CCTV" },
  { path: "/admin/edit-program-realisasi-kinerja-it", 
    icon: ClipboardList, 
    label: "Edit Program Kinerja" },
  {
    path: "/admin/edit-infrastruktur-jaringan",
    icon: Network,
    label: "Edit Infrastruktur Jaringan",
  },
  {
    path: "/admin/edit-layanan-ticketing",
    icon: Ticket,
    label: "Edit Layanan Ticketing",
  },
  {
    path: "/admin/edit-aplikasi",
    icon: AppWindow,
    label: "Edit Layanan Aplikasi",
  },
  {
    path: "/admin/edit-peta-wilayah",
    icon: MapPin,
    label: "Edit Peta Wilayah",
  },
];

const SidebarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Handler logout (pindah ke halaman utama)
  const handleLogout = () => {
    setShowConfirm(false);
    navigate("/"); // Ganti '/' dengan '/profil' jika ingin ke halaman profil user
  };

  return (
    <div
      className={cn(
        "bg-blue-900 text-white transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen z-50 overflow-y-auto",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <img
                src={logoKai}
                alt="Logo KAI"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold">KAI Divre IV</h1>
                <p className="text-sm text-blue-200">Tanjungkarang</p>
              </div>
            </div>
          )}
          {collapsed && (
            <img src={logoKai} alt="Logo KAI" className="h-10 w-10 mx-auto" />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-blue-800 rounded ml-2"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {adminMenu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center p-3 rounded-lg transition-colors",
                    "hover:bg-blue-800",
                    isActive && "bg-blue-700 text-white",
                    collapsed ? "justify-center" : "space-x-3"
                  )
                }
              >
                <item.icon size={20} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800">
        {!collapsed && (
          <>
            <div className="text-xs text-blue-200 text-center mb-2">
              <p>© 2025 PT KAI</p>
              <p>Divisi Regional IV</p>
            </div>
            <button
              className="mt-1 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg mx-auto shadow transition-colors"
              onClick={() => setShowConfirm(true)}
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </>
        )}
      </div>

      {/* Konfirmasi Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-xs w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Konfirmasi Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarAdmin;
