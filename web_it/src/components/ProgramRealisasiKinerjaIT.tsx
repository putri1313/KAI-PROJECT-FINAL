import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Calendar, Percent } from 'lucide-react';
import apiClient from '@/api/apiClient'; // 1. Menggunakan apiClient yang sama

// Tipe data sesuai dengan response API (dalam properti 'kinerja')
type Kinerja = {
  tahun: number;
  capaian: number;
  deskripsi: string;
};

// Tipe untuk keseluruhan response dari endpoint /kinerja
type KinerjaResponse = {
  kinerja: Kinerja[];
};

const ProgramRealisasiKinerjaIT: React.FC = () => {
  // State untuk data, filter, loading, dan error
  const [data, setData] = useState<Kinerja[]>([]);
  const [filterTahun, setFilterTahun] = useState<string>('all');
  const [filterCapaian, setFilterCapaian] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tahunList, setTahunList] = useState<number[]>([]);

  // Gunakan useEffect untuk mengambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Menggunakan apiClient dengan endpoint yang sesuai
        const params = new URLSearchParams();
                if (filterTahun !== 'all') {
                    params.append('tahun', filterTahun);
                }
                if (filterCapaian > 0) {
                    params.append('capaian', filterCapaian.toString());
                }
        // Mengambil data dari properti 'kinerja' sesuai struktur JSON backend
        const response = await apiClient.get<KinerjaResponse>(`/kinerja?${params.toString()}`);
                setData(response.data.kinerja || []);
      if (filterTahun === 'all' && filterCapaian === 0) {
                    const uniqueTahun = Array.from(new Set(response.data.kinerja.map(d => d.tahun))).sort((a, b) => b - a);
                    setTahunList(uniqueTahun);
                }

            } catch (err) {
                setError('Gagal memuat data kinerja dari server.');
                console.error('Fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };
    fetchData();
  }, [filterTahun, filterCapaian]);  // Array kosong berarti hanya dijalankan sekali

  // Kalkulasi data turunan (derived state)
  
  // xRender komponen dengan data dinamis
  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          Program Realisasi Kinerja Divisi Sistem Informasi
        </h1>
        <p className="text-blue-100 text-lg">
          Rekapitulasi capaian program kerja dan realisasi kinerja Divisi Sistem Informasi
        </p>
      </div>

      {/* Statistik Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Program</p>
                <p className="text-2xl font-bold text-gray-900">{isLoading ? '...' : data.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capaian &ge; 80%</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : data.filter(d => d.capaian >= 80).length}
                </p>
              </div>
              <Percent className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tahun Terdata</p>
                <p className="text-2xl font-bold text-gray-900">{isLoading ? '...' : tahunList.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader><CardTitle>Filter Program Kinerja</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tahun</label>
              <select value={filterTahun} onChange={e => setFilterTahun(e.target.value)} className="border px-3 py-2 rounded">
                <option value="all">Semua Tahun</option>
                {tahunList.map(tahun => (
                  <option key={tahun} value={tahun}>{tahun}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capaian (%) &ge; </label>
              <input type="number" min={0} max={100} value={filterCapaian} onChange={e => setFilterCapaian(Number(e.target.value))} className="border px-3 py-2 rounded w-24"/>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Data */}
      <Card>
        <CardHeader><CardTitle>Daftar Program Kinerja Divisi Sistem Informasi</CardTitle></CardHeader>
        <CardContent>
          {/* Tampilkan pesan loading atau error di atas tabel */}
          {isLoading && <div className="text-center py-4 text-gray-500">Memuat data...</div>}
          {error && <div className="text-center py-4 text-red-500">{error}</div>}
          
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-lg">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Tahun</th>
                    <th className="border px-4 py-2">Capaian (%)</th>
                    <th className="border px-4 py-2">Deskripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">Data tidak ditemukan sesuai filter</td></tr>
                  ) : (
                    data.map((d, idx) => (
                      <tr key={idx}>
                        <td className="border px-4 py-2">{d.tahun}</td>
                        <td className="border px-4 py-2">{d.capaian}%</td>
                        <td className="border px-4 py-2">{d.deskripsi}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramRealisasiKinerjaIT;