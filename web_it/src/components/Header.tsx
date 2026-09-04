import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

import logoBUMN from '@/assests/logo-bumn.png'; // ✅ pastikan "assets" bukan "assests"
import logoKAI from '@/assests/logo-kai.png';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Kiri: Logo BUMN + Logo KAI + Judul Portal */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src={logoBUMN}
              alt="Logo BUMN"
              className="h-14 w-auto object-contain"
            />
            <img
              src={logoKAI}
              alt="Logo KAI"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-snug">
              Portal Informasi Divisi Sistem Informasi Regional IV Tanjungkarang
            </h2>
            <p className="text-sm text-gray-500 hidden md:block">
              PT Kereta Api Indonesia (Persero)
            </p>
          </div>
        </div>

        {/* Kanan: Edit Admin Profile Button */}
        <Link
          to="/admin/edit-profil"
          className="flex items-center space-x-2 hover:opacity-80 focus:outline-none"
        >
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-700">Edit</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
