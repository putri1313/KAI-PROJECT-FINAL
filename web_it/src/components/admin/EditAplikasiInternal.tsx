import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  AppWindow,
  Database,
  Shield,
  Server,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import apiClient from "@/api/apiClient"; // 1. Import API Client

// --- Tipe Data (Sesuai dengan state dan backend) ---
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
  keterangan: string;
};

type InfraCategory = {
id?: number;
  title: string;
  icon?: React.ReactNode; // Icon hanya untuk frontend
  list: string[];
};

type PerfMetric = {
id?: number;
  value: string;
  label: string;
  color: string;
  valueColor: string;
  labelColor: string;
};

const EditAplikasiInternal: React.FC = () => {
  // === STATE ===
  const [apps, setApps] = useState<AppData[]>([]);
  const [infra, setInfra] = useState<InfraCategory[]>([]);
  const [metrics, setMetrics] = useState<PerfMetric[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newApp, setNewApp] = useState<Omit<AppData, 'id'>>({
    nama: "", kategori: "", fungsi: "", version: "", lastUpdate: "",
    users: 0, uptime: "", database: "", keterangan: "", 
  });

// 2. Mengambil data dari backend
useEffect(() => {
    const fetchData = async () => {
    try {
        setLoading(true);
        const response = await apiClient.get('/aplikasi-internal');
        setApps(response.data.apps || []);
        // Menambahkan kembali icon di frontend setelah data diambil
        setInfra((response.data.infra || []).map((category: InfraCategory, index: number) => ({
        ...category,
        // Ikon default berdasarkan urutan, bisa disesuaikan
        icon: index === 0 ? <Server className="h-5 w-5" /> : index === 1 ? <Database className="h-5 w-5" /> : <Shield className="h-5 w-5" />
        })));
        setMetrics(response.data.metrics || []);
    } catch (err) {
        setError("Gagal memuat data dari server.");
    } finally {
        setLoading(false);
    }
    };
    fetchData();
}, []);

  // === Handler CRUD Lokal (Tidak Berubah) ===
  const handleAppChange = (idx: number, field: keyof AppData, value: any) => {
    setApps((apps) =>
      apps.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };
  const handleRemoveApp = (idx: number) => {
    if (window.confirm("Yakin hapus aplikasi ini?")) {
      setApps((apps) => apps.filter((_, i) => i !== idx));
    }
  };
  const handleSaveEdit = () => setEditIdx(null);
  const handleNewAppChange = (field: keyof AppData, value: any) => {
    setNewApp((a) => ({ ...a, [field]: value }));
  };
  const handleAddApp = () => {
    setApps((apps) => [...apps, newApp]);
    setNewApp({
      nama: "", kategori: "", fungsi: "", version: "", lastUpdate: "",
      users: 0, uptime: "", database: "", keterangan: "", 
    });
    setAdding(false);
  };
  const handleInfraTitleChange = (idx: number, value: string) => {
    setInfra((arr) =>
      arr.map((cat, i) => (i === idx ? { ...cat, title: value } : cat))
    );
  };
  const handleInfraCategoryAdd = () => {
    setInfra((arr) => [
      ...arr,
      { title: "", icon: <Server className="h-5 w-5" />, list: [""] },
    ]);
  };
  const handleInfraCategoryRemove = (idx: number) => {
    setInfra((arr) => arr.filter((_, i) => i !== idx));
  };
  const handleInfraListChange = (catIdx: number, listIdx: number, value: string) => {
    setInfra((arr) =>
      arr.map((cat, i) =>
        i === catIdx
          ? { ...cat, list: cat.list.map((l, j) => (j === listIdx ? value : l)) }
          : cat
      )
    );
  };
  const handleInfraListAdd = (catIdx: number) => {
    setInfra((arr) =>
      arr.map((cat, i) =>
        i === catIdx ? { ...cat, list: [...cat.list, ""] } : cat
      )
    );
  };
  const handleInfraListRemove = (catIdx: number, listIdx: number) => {
    setInfra((arr) =>
      arr.map((cat, i) =>
        i === catIdx
          ? { ...cat, list: cat.list.filter((_, j) => j !== listIdx) }
          : cat
      )
    );
  };
  const handleMetricChange = (idx: number, field: keyof PerfMetric, value: string) => {
    setMetrics(
      metrics.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };
  const handleMetricAdd = () =>
    setMetrics((m) => [
      ...m,
      { value: "", label: "", color: "bg-blue-50", valueColor: "text-blue-600", labelColor: "text-blue-800" },
    ]);
  const handleMetricRemove = (idx: number) =>
    setMetrics((m) => m.filter((_, i) => i !== idx));

  // 3. Ubah handleSaveAll untuk mengirim data ke backend
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- PERBAIKAN DI SINI ---
    // Buat salinan 'infra' yang bersih tanpa properti 'icon'
    const cleanInfra = infra.map(({ icon, ...rest }) => rest);

    const payload = { 
      apps, 
      infra: cleanInfra, // Gunakan data yang sudah bersih
      metrics 
    };

    try {
      await apiClient.post('/aplikasi-internal', payload);
      alert("Data berhasil disimpan!");
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    }
  };

  const categoryStats = apps.reduce((acc, a) => {
    acc[a.kategori] = (acc[a.kategori] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

if (loading) return <div className="text-center p-8">Memuat data...</div>;
if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <form className="space-y-6 mt-15" onSubmit={handleSaveAll}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Edit Layanan Aplikasi</h1>
        <p className="text-blue-100 text-lg">
          Tambah, edit, dan hapus data layanan aplikasi beserta infrastrukturnya
        </p>
      </div>
      {/* Daftar Aplikasi CRUD */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Aplikasi ({apps.length} aplikasi)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apps.map((app, idx) => (
              <div key={idx} className="p-4 border rounded-lg relative bg-gray-50 mb-1">
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {editIdx === idx ? (
                    <>
                      <button type="button" className="text-green-600" onClick={handleSaveEdit} title="Simpan perubahan">
                        <Save size={18} />
                      </button>
                      <button type="button" className="text-gray-500" onClick={() => setEditIdx(null)} title="Batal">
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button type="button" className="text-blue-600" onClick={() => setEditIdx(idx)} title="Edit aplikasi">
                      <Edit size={18} />
                    </button>
                  )}
                  <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveApp(idx)} title="Hapus aplikasi">
                    <Trash2 size={18} />
                  </button>
                </div>
                {/* Edit mode */}
                {editIdx === idx ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nama Aplikasi
                        <input className="w-full border rounded p-2 mt-1" value={app.nama}
                          onChange={e => handleAppChange(idx, "nama", e.target.value)} />
                      </label>
                      <label className="block text-sm font-medium mb-1 mt-2">
                        Kategori
                        <input className="w-full border rounded p-2 mt-1" value={app.kategori}
                          onChange={e => handleAppChange(idx, "kategori", e.target.value)} />
                      </label>
                      <label className="block text-sm font-medium mb-1 mt-2">
                        Fungsi
                        <input className="w-full border rounded p-2 mt-1" value={app.fungsi}
                          onChange={e => handleAppChange(idx, "fungsi", e.target.value)} />
                      </label>
                      <label className="block text-sm font-medium mb-1 mt-2">
                        Keterangan
                        <input className="w-full border rounded p-2 mt-1" value={app.keterangan}
                          onChange={e => handleAppChange(idx, "fungsi", e.target.value)} />
                      </label>

                    </div>
                    <div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{app.nama}</h4>
                        <p className="text-sm text-gray-600">{app.kategori}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{app.fungsi}</p>
                   
                      <div>
                        <p className="text-gray-500">keterangan</p>
                        <p className="font-medium">{app.keterangan}</p>
        
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Tambah aplikasi */}
          {adding ? (
            <div className="border rounded-lg p-4 mt-4 bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nama Aplikasi
                    <input className="w-full border rounded p-2 mt-1" value={newApp.nama}
                      onChange={e => handleNewAppChange("nama", e.target.value)} />
                  </label>
                  <label className="block text-sm font-medium mb-1 mt-2">
                    Kategori
                    <input className="w-full border rounded p-2 mt-1" value={newApp.kategori}
                      onChange={e => handleNewAppChange("kategori", e.target.value)} />
                  </label>
                  <label className="block text-sm font-medium mb-1 mt-2">
                    Fungsi
                    <input className="w-full border rounded p-2 mt-1" value={newApp.fungsi}
                      onChange={e => handleNewAppChange("fungsi", e.target.value)} />
                  </label>
                  <label className="block text-sm font-medium mb-1 mt-2">
                  </label>
                  <label className="block text-sm font-medium mb-1 mt-2">
                    keterangan
                    <input className="w-full border rounded p-2 mt-1" value={newApp.keterangan}
                      onChange={e => handleNewAppChange("keterangan", e.target.value)} />
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                  onClick={handleAddApp}>
                  <Plus size={16} /> Simpan Aplikasi
                </button>
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={() => setAdding(false)}>
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="mt-6 flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded px-4 py-2 font-medium"
              onClick={() => setAdding(true)}>
              <Plus size={18} /> Tambah Aplikasi
            </button>
          )}
        </CardContent>
      </Card>

      {/* Infrastruktur Pendukung (kategori & item CRUD) */}
      <Card>
        <CardHeader>
          <CardTitle>Infrastruktur Pendukung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {infra.map((cat, catIdx) => (
              <div key={catIdx} className="p-4 bg-gray-50 rounded-xl shadow relative">
                {/* Hapus kategori */}
                <button
                  type="button"
                  className="absolute top-3 right-3 text-red-500"
                  title="Hapus Kategori"
                  onClick={() => handleInfraCategoryRemove(catIdx)}
                >
                  <Trash2 size={17} />
                </button>
                {/* Edit Judul */}
                <div className="flex items-center mb-3 gap-2">
                  <span>{cat.icon}</span>
                  <input
                    className="font-semibold text-lg text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                    value={cat.title}
                    onChange={e => handleInfraTitleChange(catIdx, e.target.value)}
                    placeholder="Judul Kategori"
                  />
                </div>
                {/* List Items */}
                <ul className="space-y-2 text-sm text-gray-600">
                  {cat.list.map((item, listIdx) => (
                    <li key={listIdx} className="flex items-center gap-2">
                      <input
                        className="border rounded p-2 flex-1"
                        value={item}
                        onChange={e =>
                          handleInfraListChange(catIdx, listIdx, e.target.value)
                        }
                        placeholder="Item Infrastruktur"
                      />
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleInfraListRemove(catIdx, listIdx)}
                        title="Hapus Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="text-blue-600 mt-2 text-xs"
                  onClick={() => handleInfraListAdd(catIdx)}
                >
                  <Plus size={14} className="inline mr-1" /> Tambah Item
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="text-blue-700 mt-5 text-xs flex items-center gap-1"
            onClick={handleInfraCategoryAdd}
          >
            <Plus size={16} className="inline" /> Tambah Kategori Infrastruktur
          </button>
        </CardContent>
      </Card>
      {/* Simpan Semua */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2"
        >
          <Save size={18} /> Simpan Semua
        </button>
      </div>
    </form>
  );
};

export default EditAplikasiInternal;
