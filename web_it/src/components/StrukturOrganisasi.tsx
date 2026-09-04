import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import apiClient from '@/api/apiClient'; // 1. Import API Client

// 2. Definisikan tipe data untuk respons dari backend
type StrukturOrganisasiData = {
  id: number;
  file_path: string;
  original_name: string;
  image_url: string; // URL lengkap dari accessor di model Laravel
};

const StrukturOrganisasi: React.FC = () => {
  // 3. Buat state untuk data, loading, dan error
  const [struktur, setStruktur] = useState<StrukturOrganisasiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. Gunakan useEffect untuk mengambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<StrukturOrganisasiData>('/struktur-organisasi');
        setStruktur(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError("Bagan struktur organisasi belum diunggah.");
        } else {
          setError("Gagal memuat data dari server.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Struktur Organisasi</h1>
        <p className="text-blue-100 text-lg">
          Divisi Sistem Informasi Regional IV Tanjungkarang - Data Personil & Struktur Kepemimpinan
        </p>
      </div>

      {/* Organizational Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Bagan Organisasi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            {loading && <p>Memuat bagan organisasi...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {struktur && struktur.image_url && (
              <img 
                src={struktur.image_url} 
                alt="Bagan Struktur Organisasi" 
                className="w-full h-auto rounded-md"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrukturOrganisasi;
