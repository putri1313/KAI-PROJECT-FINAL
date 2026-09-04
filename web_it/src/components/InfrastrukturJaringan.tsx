import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Server, Shield, Globe } from 'lucide-react';
import apiClient from '@/api/apiClient';

// --- Tipe Data (Sesuai dengan backend) ---
type Topologi = {
  id?: number;
  lokasi: string;
  jenis: string;
  perangkat: string[];
  bandwidth: string;
  status: string;
  uptime: string;
};

type PerangkatJaringan = {
  id?: number;
  kategori: string;
  brand: string;
  model: string;
  jumlah: number;
  lokasi: string;
  kondisi: string;
};

type Konektivitas = {
  id?: number;
  provider: string;
  jenis: string;
  bandwidth: string;
  coverage: string;
  sla: string;
  status: string;
};

type SecurityCategory = {
  id?: number;
  kategori: string;
  items: string[];
};

const InfrastrukturJaringan: React.FC = () => {
  // --- State Management ---
  const [topologiData, setTopologiData] = useState<Topologi[]>([]);
  const [perangkatJaringan, setPerangkatJaringan] = useState<PerangkatJaringan[]>([]);
  const [konektivitas, setKonektivitas] = useState<Konektivitas[]>([]);
  const [security, setSecurity] = useState<SecurityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/infrastruktur-jaringan');
        setTopologiData(response.data.topologi || []);
        setPerangkatJaringan(response.data.perangkat || []);
        setKonektivitas(response.data.konektivitas || []);
        setSecurity(response.data.security || []);
      } catch (err) {
        setError("Gagal memuat data infrastruktur jaringan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <h1 className="text-3xl font-bold mb-2">Infrastruktur Jaringan</h1>
        <p className="text-blue-100 text-lg">
          Pemetaan Topologi, Perangkat & Monitoring Jaringan IT Divre IV
        </p>
      </div>

      {/* Network Topology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Topologi Jaringan Regional</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topologiData.map((node, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{node.lokasi}</h4>
                    <p className="text-sm text-gray-600">{node.jenis}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      node.status === 'operational' ? 'bg-green-100 text-green-700' :
                      node.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {node.status === 'operational' ? 'Operational' :
                       node.status === 'maintenance' ? 'Maintenance' : 'Down'}
                    </span>
                    <span className="text-sm font-medium">{node.uptime}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Perangkat Utama:</p>
                    <ul className="text-sm text-gray-600">
                      {node.perangkat.map((device, idx) => (
                        <li key={idx}>• {device}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Bandwidth:</p>
                    <p className="text-sm text-gray-600">{node.bandwidth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Inventori Perangkat Jaringan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Kategori</th>
                  <th className="text-left p-3">Brand/Model</th>
                  <th className="text-left p-3">Jumlah</th>
                  <th className="text-left p-3">Lokasi</th>
                  <th className="text-left p-3">Kondisi</th>
                </tr>
              </thead>
              <tbody>
                {perangkatJaringan.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.kategori}</td>
                    <td className="p-3">{item.brand} {item.model}</td>
                    <td className="p-3">{item.jumlah} unit</td>
                    <td className="p-3">{item.lokasi}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.kondisi === 'Excellent' ? 'bg-green-100 text-green-700' :
                        item.kondisi === 'Good' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Connectivity & Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Konektivitas & Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {konektivitas.map((provider, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{provider.provider}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    provider.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {provider.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Jenis:</span> {provider.jenis}</p>
                  <p><span className="font-medium">Bandwidth:</span> {provider.bandwidth}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Infrastruktur Keamanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {security.map((sec, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-3">{sec.kategori}</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {sec.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
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

export default InfrastrukturJaringan;
