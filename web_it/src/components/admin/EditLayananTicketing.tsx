import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Save, LoaderCircle } from "lucide-react";
import apiClient from "@/api/apiClient";  

type JenisLayanan =
  | "Loket"
  | "CIC"
  | "Boarding"
  | "Sisa Tempat Duduk"
  | "Mesin Antrian"
  | "Informasi Jalur KA";

// <<< PERUBAHAN 1: Tambahkan 'id' pada tipe data >>>
// ID ini akan kita dapatkan dari server setelah data diambil
type TicketingPoint = {
  id?: number; // ID bersifat opsional karena item baru belum punya ID
  lokasi: string;
  totalCounter: number;
  counterAktif: number;
  alamat: string;
  jenisLayanan: JenisLayanan[];
};

const TicketingPoints = () => {
  const [points, setPoints] = useState<TicketingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newPoint, setNewPoint] = useState<TicketingPoint>({
    lokasi: "",
    totalCounter: 0,
    counterAktif: 0,
    alamat: "",
    jenisLayanan: [],
  });
  
  // Fungsi untuk mengambil data, sudah benar
  const fetchPoints = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/layanan-ticketing");
      const responseData = response.data.points || [];
      const formattedData = responseData.map((point: any) => ({
        id: point.id, // Pastikan backend mengirimkan 'id'
        lokasi: point.lokasi,
        totalCounter: point.total_counter,
        counterAktif: point.counter_aktif,
        alamat: point.alamat,
        jenisLayanan: Array.isArray(point.jenis_layanan) ? point.jenis_layanan : [],
      }));
      setPoints(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      // Ganti alert dengan metode notifikasi yang lebih baik jika ada
      alert("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  // handleAdd hanya mengubah state lokal
  const handleAdd = () => {
    if (!newPoint.lokasi || !newPoint.alamat) {
      alert("Lengkapi data lokasi dan alamat!");
      return;
    }
    // Menambahkan item baru ke state lokal. Item ini belum punya 'id'.
    setPoints([...points, newPoint]);
    setNewPoint({ lokasi: "", totalCounter: 0, counterAktif: 0, alamat: "", jenisLayanan: [] });
  };

  // handleDelete hanya mengubah state lokal berdasarkan index
  const handleDelete = (index: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus titik layanan ini? Perubahan belum disimpan.")) {
      setPoints(points.filter((_, i) => i !== index));
    }
  };
  
  // Fungsi untuk menyimpan semua data ke backend
  const handleSaveToBackend = async () => {
    setSaving(true);
    try {
      const payload = {
        points: points.map(point => ({
          lokasi: point.lokasi,
          alamat: point.alamat,
          total_counter: point.totalCounter,
          counter_aktif: point.counterAktif,
          jenis_layanan: point.jenisLayanan,
        }))
      };

      await apiClient.post("/layanan-ticketing", payload);
      alert("Data berhasil disimpan!");

      // Panggil fetchPoints lagi untuk sinkronisasi dengan database
      await fetchPoints();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data ke server!");
    } finally {
      setSaving(false);
    }
  };

  const handleJenisLayananChange = (jenis: JenisLayanan) => {
    const currentLayanan = newPoint.jenisLayanan;
    const newLayanan = currentLayanan.includes(jenis)
      ? currentLayanan.filter((j) => j !== jenis)
      : [...currentLayanan, jenis];
    setNewPoint({ ...newPoint, jenisLayanan: newLayanan });
  };

  const layananOptions: JenisLayanan[] = [
    "Loket", "CIC", "Boarding", "Sisa Tempat Duduk", "Mesin Antrian", "Informasi Jalur KA",
  ];

  if (loading) {
    return <div className="p-6 text-center">Memuat data titik layanan...</div>
  }

  return (
    <div className="p-6">
      {/* Bagian Atas: Grid untuk menampilkan titik layanan yang sudah ada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((point, index) => (
          // <<< PERUBAHAN 2: Gunakan point.id sebagai key >>>
          // Beri fallback ke index jika item baru belum memiliki id
          <Card key={point.id || index} className="shadow-md rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{point.lokasi}</CardTitle>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </CardHeader>
            <CardContent>
              <p><b>Alamat:</b> {point.alamat}</p>
              <p><b>Total Counter:</b> {point.totalCounter}</p>
              <p><b>Counter Aktif:</b> {point.counterAktif}</p>
              <p><b>Jenis Layanan:</b> {point.jenisLayanan.join(", ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bagian Tengah: Form untuk menambah titik layanan baru */}
      <div className="mt-8 flex justify-center">
        {/* Konten form tidak berubah */}
        <Card className="shadow-md rounded-2xl border-dashed w-full max-w-lg">
           <CardHeader>
             <CardTitle>Tambah Titik Layanan Baru</CardTitle>
           </CardHeader>
           <CardContent className="flex flex-col gap-2">
             <input type="text" placeholder="Lokasi" value={newPoint.lokasi} onChange={(e) => setNewPoint({ ...newPoint, lokasi: e.target.value })} className="border p-2 rounded" />
             <input type="text" placeholder="Alamat" value={newPoint.alamat} onChange={(e) => setNewPoint({ ...newPoint, alamat: e.target.value })} className="border p-2 rounded" />
             <input type="number" placeholder="Total Counter" value={newPoint.totalCounter} onChange={(e) => setNewPoint({ ...newPoint, totalCounter: parseInt(e.target.value) || 0 })} className="border p-2 rounded" />
             <input type="number" placeholder="Counter Aktif" value={newPoint.counterAktif} onChange={(e) => setNewPoint({ ...newPoint, counterAktif: parseInt(e.target.value) || 0 })} className="border p-2 rounded" />
             <div>
               <p className="font-semibold">Jenis Layanan:</p>
               <div className="flex flex-wrap gap-2 mt-2">
                 {layananOptions.map((layanan) => (
                   <label key={layanan} className="flex items-center gap-1 cursor-pointer">
                     <input type="checkbox" checked={newPoint.jenisLayanan.includes(layanan)} onChange={() => handleJenisLayananChange(layanan)} />
                     {layanan}
                   </label>
                 ))}
               </div>
             </div>
             <button onClick={handleAdd} className="bg-green-500 text-white flex items-center justify-center gap-1 p-2 rounded mt-2 hover:bg-green-600">
               <Plus size={16} /> Tambah
             </button>
           </CardContent>
         </Card>
      </div>


      {/* Bagian Bawah: Tombol Simpan Data */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSaveToBackend}
          disabled={saving || loading} // Tambahkan disable saat loading
          className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {saving ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>
    </div>
  );
};

export default TicketingPoints;
