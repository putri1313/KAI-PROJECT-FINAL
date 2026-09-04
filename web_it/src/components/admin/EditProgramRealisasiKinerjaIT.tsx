import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Save, AlertTriangle, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import apiClient from '@/api/apiClient'; // 1. Menggunakan apiClient terpusat

// 2. Definisikan tipe data yang relevan
type Kinerja = {
  tahun: number;
  capaian: number;
  deskripsi: string;
};

// Tipe untuk response saat mengambil data
type KinerjaResponse = {
  kinerja: Kinerja[];
};

// Tipe untuk response saat menyimpan data
type SaveResponse = {
  message: string;
};

const EditProgramRealisasiKinerjaIT: React.FC = () => {
  // 3. State untuk data, form input, loading, dan notifikasi
  const [data, setData] = useState<Kinerja[]>([]);
  const [tahunInput, setTahunInput] = useState<number>(new Date().getFullYear());
  const [capaianInput, setCapaianInput] = useState<number>(10);
  const [deskripsiInput, setDeskripsiInput] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false); // State khusus untuk proses simpan
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 4. Ambil data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<KinerjaResponse>('/kinerja');
        setData(response.data.kinerja || []);
      } catch (err) {
        setError("Gagal memuat data dari server. Pastikan backend berjalan.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk menambah data (hanya di state frontend)
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (deskripsiInput && capaianInput >= 10 && capaianInput <= 100) {
      setData([
        ...data,
        { tahun: tahunInput, capaian: capaianInput, deskripsi: deskripsiInput },
      ]);
      // Reset form
      setDeskripsiInput("");
      setCapaianInput(10);
      setTahunInput(new Date().getFullYear());
    }
  };

  // Fungsi untuk menghapus data (hanya di state frontend)
  const handleDelete = (idx: number) => {
    setData(data.filter((_, i) => i !== idx));
  };

  // 5. Kirim semua data ke backend untuk disimpan
  const handleSaveToServer = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await apiClient.post<SaveResponse>('/kinerja', { kinerja: data });
      
      setSuccessMessage(response.data.message || "Data berhasil disimpan!");
      setTimeout(() => setSuccessMessage(null), 3000); // Hilangkan notifikasi

    } catch (err) {
      setError("Gagal menyimpan data ke server. Periksa koneksi atau log backend.");
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Render komponen dengan JSX
  return (
    <div className="space-y-6 mt-15">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          Edit Program Realisasi Kinerja IT (Admin)
        </h1>
        <p className="text-blue-100 text-lg">
          Kelola data capaian program kerja dan realisasi kinerja Divisi IT
        </p>
      </div>
      
      {/* Notifikasi Error dan Sukses */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
          <AlertTriangle className="h-5 w-5" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
          <CheckCircle className="h-5 w-5" />
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tambah Program Kinerja Sistem Informasi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Tahun Kinerja</label>
              <input type="number" min={2020} max={2100} value={tahunInput} onChange={e => setTahunInput(Number(e.target.value))} className="border px-3 py-2 rounded w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capaian (%)</label>
              <input type="number" min={10} max={100} value={capaianInput} onChange={e => setCapaianInput(Number(e.target.value))} className="border px-3 py-2 rounded w-full" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Deskripsi Kinerja</label>
              <input type="text" value={deskripsiInput} onChange={e => setDeskripsiInput(e.target.value)} className="border px-3 py-2 rounded w-full" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Tambah
            </button>
          </form>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <button onClick={handleSaveToServer} disabled={isSaving} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-400">
          <Save className="h-5 w-5" />
          {isSaving ? "Menyimpan..." : "Simpan Perubahan ke Server"}
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Program Kinerja Sistem Informasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Tahun</th>
                  <th className="border px-4 py-2">Capaian (%)</th>
                  <th className="border px-4 py-2">Deskripsi</th>
                  <th className="border px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">Data tidak ditemukan</td></tr>
                ) : (
                  data.map((d, idx) => (
                    <tr key={idx}>
                      <td className="border px-4 py-2">{d.tahun}</td>
                      <td className="border px-4 py-2">{d.capaian}%</td>
                      <td className="border px-4 py-2">{d.deskripsi}</td>
                      <td className="border px-4 py-2">
                        <button onClick={() => handleDelete(idx)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProgramRealisasiKinerjaIT;