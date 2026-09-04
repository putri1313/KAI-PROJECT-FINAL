import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Award, TrendingUp, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Konfigurasi instance apiClient langsung di sini
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Sesuaikan dengan URL backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Definisikan tipe data sesuai dengan respons API
type Visi = {
  content: string;
};

type Misi = {
  title: string;
  description: string;
};

type Kpi = {
  target: string;
  value: string;
  achievement: string;
  status: 'exceeded' | 'achieved' | 'pending';
  description: string;
};

type SasaranMutu = {
  kategori: string;
  items: string[];
};

type VisiMisiData = {
  visi: Visi | null;
  misi: Misi[];
  kpi: Kpi[];
  // PERBAIKAN: Nama properti disesuaikan menjadi camelCase
  sasaranMutu: SasaranMutu[];
};

const VisiMisi: React.FC = () => {
  const [data, setData] = useState<VisiMisiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<any>('/visi-misi-page');
        
        const fetchedData = response.data;
        // Transformasi data dari backend ke state frontend
        setData({
          visi: fetchedData.visi || null,
          misi: fetchedData.misi || [],
          kpi: fetchedData.kpi || [],
          // PERBAIKAN: Mengambil data dari 'sasaran_mutu' (snake_case) dari backend
          sasaranMutu: fetchedData.sasaran_mutu || [], 
        });

      } catch (err) {
        setError('Gagal memuat data. Pastikan data sudah disimpan di halaman admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi bantu untuk warna status KPI
  const getKpiStatusColor = (status: string) => {
    if (status === 'exceeded') return 'text-green-600';
    if (status === 'achieved') return 'text-blue-600';
    return 'text-yellow-600';
  };

  if (loading) {
    return <div className="text-center p-8">Memuat data...</div>;
  }

  if (error || !data) {
    return <div className="text-center text-red-500 p-8">{error || 'Data tidak ditemukan.'}</div>;
  }

  return (
    <div className="space-y-6 mt-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Visi, Misi, KPI & Sasaran Mutu</h1>
        <p className="text-blue-100 text-lg"> Visi, Misi, Key Performance Indicators (KPI), dan Sasaran Mutu Divisi Sistem Informasi Divre IV Tanjungkarang.
        </p>
      </div>

      {/* Visi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Visi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <p className="text-lg font-medium text-blue-900 leading-relaxed">
              "{data.visi?.content || 'Visi belum diatur.'}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Misi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Misi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.misi.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Key Performance Indicators (KPI)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.kpi.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{kpi.target}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target:</span>
                    <span className="text-sm font-medium">{kpi.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pencapaian:</span>
                    <span className={`text-sm font-bold ${getKpiStatusColor(kpi.status)}`}>
                      {kpi.achievement}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Sasaran Mutu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Sasaran Mutu</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.sasaranMutu.map((sasaran, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-semibold text-gray-900 pb-2 border-b">
                  {sasaran.kategori}
                </h4>
                <ul className="space-y-2">
                  {sasaran.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
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

export default VisiMisi;

