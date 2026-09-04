import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppWindow, Database, Shield, Users, Server, Filter } from 'lucide-react';
import apiClient from '@/api/apiClient'; // 1. Import API Client

// 2. Definisikan tipe data sesuai dengan backend
type AppData = {
  id?: number;
  nama: string;
  kategori: string;
  fungsi: string;
  version: string;
  lastUpdate: string;
  users: number;
  uptime: string;
  database: string;
  keterangan: string; // Menggunakan 'keterangan' dari backend
  maintenance: string;
};

type InfraCategory = {
  id?: number;
  title: string;
  list: string[]; // PERBAIKAN: Mengganti 'items' menjadi 'list'
  icon?: React.ReactNode; // Icon hanya untuk frontend
};

const AplikasiInternal: React.FC = () => {
  // 3. Ganti data statis dengan state
  const [apps, setApps] = useState<AppData[]>([]);
  const [infra, setInfra] = useState<InfraCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk filter
  const [filterKategori, setFilterKategori] = useState('all');

  // 4. Gunakan useEffect untuk mengambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/aplikasi-internal');
        setApps(response.data.apps || []);
        
        // Tambahkan kembali icon di frontend setelah data diambil
        setInfra((response.data.infra || []).map((category: InfraCategory) => ({
          ...category,
          // Ikon default berdasarkan judul
          icon: category.title.toLowerCase().includes('server') ? <Server className="h-5 w-5" /> : 
                category.title.toLowerCase().includes('database') ? <Database className="h-5 w-5" /> :
                category.title.toLowerCase().includes('security') ? <Shield className="h-5 w-5" /> : 
                <AppWindow className="h-5 w-5" />
        })));

      } catch (err) {
        setError("Gagal memuat data aplikasi internal.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 5. Hitung statistik menggunakan useMemo
  const stats = useMemo(() => {
    const totalUsers = apps.reduce((sum, app) => sum + (app.users || 0), 0);
    const totalApps = apps.length;
    return { totalUsers, totalApps };
  }, [apps]);

  // Buat daftar kategori unik untuk filter dropdown
  const kategoriOptions = useMemo(() => {
    const allKategori = apps.map(app => app.kategori);
    return [...new Set(allKategori)]; // Ambil nilai unik
  }, [apps]);

  // Terapkan filter ke daftar aplikasi
  const filteredApps = apps.filter(app => 
    filterKategori === 'all' || app.kategori === filterKategori
  );

  if (loading) {
    return <div className="text-center p-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Layanan Aplikasi</h1>
        <p className="text-blue-100 text-lg">
          Daftar dan Status Layanan Aplikasi yang Dikelola IT Divre IV
        </p>
      </div>



      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Aplikasi ({filteredApps.length} dari {stats.totalApps} aplikasi)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{app.nama}</h4>
                    <p className="text-sm text-gray-600">{app.kategori}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{app.fungsi}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                 
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Keterangan</p>
                    <p className="font-medium">{app.keterangan}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Infrastruktur Pendukung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {infra.map((category) => (
              <div key={category.id}>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  {category.icon}
                  <span>{category.title}</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {/* PERBAIKAN: Mengganti 'items' menjadi 'list' */}
                  {(category.list || []).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AplikasiInternal;
