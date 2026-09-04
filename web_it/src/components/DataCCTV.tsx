import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, MapPin, Search, Filter, Monitor, AlertTriangle, CheckCircle } from 'lucide-react';
import apiClient from '@/api/apiClient'; // 1. Import API Client

// Definisikan tipe data sesuai dengan backend
type CCTV = {
  id: number;
  lokasi: string;
  kategori: string;
  active: number;
  maintenance: number;
  offline: number;
};

const kategoriList = [
      "Stasiun",
      "Dipo Lokomotif",
      "Dipo Gerbang",
      "Dipo Kereta",
      "UPT Kru",
      "Resort JJ",
      "Resort Sintel",
      "Rumah Sinyal",
    ];

const DataCCTV: React.FC = () => {
  // 3. Ganti data statis dengan state
  const [cctvData, setCctvData] = useState<CCTV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // 4. Gunakan useEffect untuk mengambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ cctvs: CCTV[] }>('/cctv-data');
        setCctvData(response.data.cctvs || []);
      } catch (err) {
        setError("Gagal memuat data CCTV dari server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = cctvData.filter(item => {
    const matchSearch = item.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLokasi = filterLokasi === 'all' || item.kategori === filterLokasi;
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'normal' && item.offline === 0 && item.maintenance === 0) ||
      (filterStatus === 'issue' && (item.offline > 0 || item.maintenance > 0));
    return matchSearch && matchLokasi && matchStatus;
  });

  const totalStats = useMemo(() => cctvData.reduce((acc, item) => ({
    active: acc.active + item.active,
    maintenance: acc.maintenance + item.maintenance,
    offline: acc.offline + item.offline
  }), { active: 0, maintenance: 0, offline: 0 }), [cctvData]);

  const totalCCTV = useMemo(() => cctvData.reduce((sum, item) => sum + item.active + item.maintenance + item.offline, 0), [cctvData]);

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
        <h1 className="text-3xl font-bold mb-2">Data CCTV</h1>
        <p className="text-blue-100 text-lg">
          Monitoring dan Pengelolaan Sistem CCTV di Seluruh Fasilitas Divre IV
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total CCTV</p>
                <p className="text-2xl font-bold text-gray-900">{totalCCTV}</p>
              </div>
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{totalStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{totalStats.maintenance}</p>
              </div>
              <Monitor className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">{totalStats.offline}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari lokasi CCTV..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={16} />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterLokasi}
                onChange={(e) => setFilterLokasi(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {kategoriList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="normal">Normal</option>
                <option value="issue">Ada Masalah</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CCTV Data Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Detail CCTV per Lokasi ({filteredData.length} lokasi)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.lokasi}</h4>
                    <p className="text-sm text-gray-600">{item.kategori}</p>
                  </div>
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>

                <div className="space-y-3">
                  {/* Status Overview */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-lg font-bold text-green-600">{item.active}</p>
                      <p className="text-xs text-green-700">Active</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <p className="text-lg font-bold text-yellow-600">{item.maintenance}</p>
                      <p className="text-xs text-yellow-700">Maintenance</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="text-lg font-bold text-red-600">{item.offline}</p>
                      <p className="text-xs text-red-700">Offline</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCCTV;
