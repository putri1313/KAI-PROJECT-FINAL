import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  User, 
  Target, 
  Users, 
  Network, 
  Building, 
  Camera, 
  Ticket, 
  BarChart3, 
  AppWindow, 
  Train, 
  Map,
  ChevronLeft,
  ChevronRight,
  Computer,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logoKai from '@/assests/logo-kai.png'; 

const menuItems = [
  // { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/profil', icon: User, label: 'Profil Divisi' },
  { path: '/visi-misi', icon: Target, label: 'Visi, Misi & KPI' },
  { path: '/struktur-organisasi', icon: Users, label: 'Struktur Organisasi' },
  { path: '/data-stasiun', icon: Train, label: 'Data Stasiun Divre IV' },
  { path: '/data-cctv', icon: Camera, label: 'Data CCTV' },
  { path: '/program-realisasi-kinerja-it', icon: ClipboardList, label: 'Program Realisasi Kinerja IT' },
  { path: '/infrastruktur-jaringan', icon: Network, label: 'Infrastruktur Jaringan' },
  { path: '/layanan-ticketing', icon: Ticket, label: 'Layanan Ticketing' },
  { path: '/aplikasi-internal', icon: AppWindow, label: 'Layanan Aplikasi' },
  { path: '/peta-wilayah', icon: Map, label: 'Peta Wilayah' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

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
            <img
              src={logoKai}
              alt="Logo KAI"
              className="h-10 w-10 mx-auto"
            />
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
          {menuItems.map((item) => (
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
          <div className="text-xs text-blue-200 text-center">
            <p>© 2025 PT KAI</p>
            <p>Divisi Regional IV</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
