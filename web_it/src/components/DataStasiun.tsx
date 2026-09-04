import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Search, Filter, Train } from 'lucide-react';
import apiClient from '@/api/apiClient';

// 1. Definisikan tipe data tanpa monitor & CCTV
type Infrastruktur = {
  // kosongkan atau tambahkan properti lain sesuai kebutuhan backend
};

type Stasiun = {
  id: number;
  nama: string;
  kode: string;
  provinsi: string;
  kelas: string;
  jalur: string;
  infrastruktur?: Infrastruktur;
};

const DataStasiun: React.FC = () => {
  const [stasiunData, setStasiunData] = useState<Stasiun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvinsi, setFilterProvinsi] = useState('all');

  // ambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Stasiun[]>('/stasiun');
        setStasiunData(response.data || []);
      } catch (err) {
        setError("Gagal memuat data stasiun dari server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStasiun = stasiunData.filter(stasiun => {
    const matchSearch = stasiun.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       stasiun.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterProvinsi === 'all' || stasiun.provinsi === filterProvinsi;
    return matchSearch && matchFilter;
  });

  const stats = useMemo(() => ({
    total: stasiunData.length,
    lampung: stasiunData.filter(s => s.provinsi === 'Lampung').length,
    bengkulu: stasiunData.filter(s => s.provinsi === 'Bengkulu').length,
    sumsel: stasiunData.filter(s => s.provinsi === 'Sumatera Selatan').length,
    besar: stasiunData.filter(s => s.kelas === 'Besar').length,
    sedang: stasiunData.filter(s => s.kelas === 'Sedang').length,
    kecil: stasiunData.filter(s => s.kelas === 'Kecil').length
  }), [stasiunData]);

  if (loading) {
    return <div className="text-center p-8">Memuat data stasiun...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Data Stasiun Divre IV Tanjungkarang</h1>
        <p className="text-blue-100 text-lg">
          Informasi Lengkap Stasiun yang Dikelola Divre IV Tanjungkarang
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stasiun</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stasiun Besar</p>
                <p className="text-2xl font-bold text-gray-900">{stats.besar}</p>
              </div>
              <Train className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stasiun Sedang</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sedang}</p>
              </div>
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stasiun Kecil</p>
                <p className="text-2xl font-bold text-gray-900">{stats.kecil}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian & Filter Stasiun</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari nama atau kode stasiun..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={16} />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterProvinsi}
                onChange={(e) => setFilterProvinsi(e.target.value)}
              >
                <option value="all">Semua Provinsi</option>
                <option value="Lampung">Lampung</option>
                <option value="Bengkulu">Bengkulu</option>
                <option value="Sumatera Selatan">Sumatera Selatan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Stasiun ({filteredStasiun.length} dari {stats.total} stasiun)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStasiun.map((stasiun) => (
              <div key={stasiun.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{stasiun.nama}</h4>
                    <p className="text-sm text-gray-600">Kode: {stasiun.kode}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{stasiun.provinsi}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Train className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{stasiun.jalur}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Data Stasiun</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nama Stasiun</th>
                  <th className="text-left p-3">Kode</th>
                  <th className="text-left p-3">Provinsi</th>
                  <th className="text-left p-3">Kelas</th>
                  <th className="text-left p-3">Jalur</th>
                </tr>
              </thead>
              <tbody>
                {filteredStasiun.map((stasiun) => (
                  <tr key={stasiun.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{stasiun.nama}</td>
                    <td className="p-3">{stasiun.kode}</td>
                    <td className="p-3">{stasiun.provinsi}</td>
                    <td className="p-3">{stasiun.kelas}</td>
                    <td className="p-3">{stasiun.jalur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataStasiun;
