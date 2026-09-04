import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Camera,
  Trash2,
  Plus,
  Save,
  Edit,
  X,
  CheckCircle,
  Search,
  Filter
} from "lucide-react";
import apiClient from "@/api/apiClient"; // 1. Import API Client

// --- Tipe Data ---
type CCTV = {
  id?: number;
  lokasi: string;
  kategori: string;
  namaStasiun?: string; // ⬅️ tambahan untuk kategori Stasiun
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

const EditCCTV: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [cctvs, setCctvs] = useState<CCTV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [newCCTV, setNewCCTV] = useState<Omit<CCTV, "id">>({
    lokasi: "",
    kategori: "Stasiun",
    namaStasiun: "", // default kosong
    active: 1,
    maintenance: 0,
    offline: 0,
  });

  // Search/Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 2. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/cctv-data");
        setCctvs(response.data.cctvs || []);
      } catch (err: any) {
        setError("Gagal memuat data dari server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CRUD HANDLER ---
  const handleChange = (idx: number, field: keyof CCTV, value: any) => {
    setCctvs((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const addCCTV = () => {
    if (!newCCTV.lokasi) return alert("Isi lokasi CCTV terlebih dahulu.");
    if (newCCTV.kategori === "Stasiun" && !newCCTV.namaStasiun?.trim()) {
      return alert("Harap isi nama stasiun untuk kategori Stasiun.");
    }

    setCctvs((prev) => [...prev, newCCTV]);
    setNewCCTV({
      lokasi: "",
      kategori: "Stasiun",
      namaStasiun: "",
      active: 1,
      maintenance: 0,
      offline: 0,
    });
  };

  const removeCCTV = (idx: number) => {
    if (window.confirm("Yakin ingin menghapus data CCTV ini?")) {
      setCctvs((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const saveEdit = () => setEditIdx(null);

  // --- FILTER DATA ---
  const filteredCCTV = cctvs.filter((item) => {
    const matchSearch = item.lokasi
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchKategori =
      filterKategori === "all" || item.kategori === filterKategori;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "normal" &&
        item.offline === 0 &&
        item.maintenance === 0) ||
      (filterStatus === "issue" &&
        (item.offline > 0 || item.maintenance > 0));
    return matchSearch && matchKategori && matchStatus;
  });

  // --- SIMPAN SEMUA ---
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { cctvs };
    try {
      await apiClient.post("/cctv-data", payload);
      alert("Data CCTV berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="text-center p-8">Memuat data CCTV...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <form className="space-y-6 mt-8" onSubmit={handleSaveAll}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Edit Data CCTV</h1>
        <p className="text-blue-100 text-lg">
          Kelola data master CCTV, pencarian, dan filter.
        </p>
      </div>

      {/* Search & Filter */}
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={16} />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg"
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {kategoriList.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg"
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

      {/* List data + edit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Master Data CCTV</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {filteredCCTV.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  {editIdx === idx ? (
                    <>
                      <button
                        type="button"
                        className="text-green-600"
                        onClick={saveEdit}
                        title="Simpan"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400"
                        onClick={() => setEditIdx(null)}
                        title="Batal"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="text-gray-400"
                      onClick={() => setEditIdx(idx)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeCCTV(idx)}
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {editIdx === idx ? (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <input
                      className="w-full border rounded p-2"
                      value={item.lokasi}
                      onChange={(e) => handleChange(idx, "lokasi", e.target.value)}
                      placeholder="Lokasi"
                    />
                    <select
                      className="w-full border rounded p-2"
                      value={item.kategori}
                      onChange={(e) => handleChange(idx, "kategori", e.target.value)}
                    >
                      {kategoriList.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* Input Nama Stasiun muncul jika kategori Stasiun */}
                    {item.kategori === "Stasiun" && (
                      <input
                        className="w-full border rounded p-2"
                        value={item.namaStasiun || ""}
                        onChange={(e) => handleChange(idx, "namaStasiun", e.target.value)}
                        placeholder="Nama Stasiun"
                      />
                    )}

                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded p-2"
                      value={item.active}
                      onChange={(e) =>
                        handleChange(idx, "active", parseInt(e.target.value) || 0)
                      }
                      placeholder="Active"
                    />
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded p-2"
                      value={item.maintenance}
                      onChange={(e) =>
                        handleChange(idx, "maintenance", parseInt(e.target.value) || 0)
                      }
                      placeholder="Maintenance"
                    />
                    <input
                      type="number"
                      min={0}
                      className="w-full border rounded p-2"
                      value={item.offline}
                      onChange={(e) =>
                        handleChange(idx, "offline", parseInt(e.target.value) || 0)
                      }
                      placeholder="Offline"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <div className="font-bold">{item.lokasi}</div>
                      <div className="text-sm text-gray-700">{item.kategori}</div>
                      {item.kategori === "Stasiun" && (
                        <div className="text-sm text-blue-600">
                          Stasiun: {item.namaStasiun || "-"}
                        </div>
                      )}
                    </div>
                    <div></div>
                    <div className="text-sm text-green-600">
                      Active: {item.active}
                    </div>
                    <div className="text-sm text-yellow-600">
                      Maintenance: {item.maintenance}
                    </div>
                    <div className="text-sm text-red-600">
                      Offline: {item.offline}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tambah Baru */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Tambah Data CCTV Baru</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Lokasi</label>
              <input
                className="w-full border rounded p-2 mt-1"
                value={newCCTV.lokasi}
                onChange={(e) =>
                  setNewCCTV((prev) => ({ ...prev, lokasi: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select
                className="w-full border rounded p-2 mt-1"
                value={newCCTV.kategori}
                onChange={(e) =>
                  setNewCCTV((prev) => ({
                    ...prev,
                    kategori: e.target.value,
                    namaStasiun: e.target.value === "Stasiun" ? "" : undefined,
                  }))
                }
              >
                {kategoriList.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Input Nama Stasiun hanya muncul jika kategori Stasiun */}
            {newCCTV.kategori === "Stasiun" && (
              <div>
                <label className="block text-sm font-medium mb-1">Nama Stasiun</label>
                <input
                  className="w-full border rounded p-2 mt-1"
                  value={newCCTV.namaStasiun}
                  onChange={(e) =>
                    setNewCCTV((prev) => ({ ...prev, namaStasiun: e.target.value }))
                  }
                  placeholder="Masukkan nama stasiun"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 mt-2">Active</label>
              <input
                type="number"
                min={0}
                className="w-full border rounded p-2 mt-1"
                value={newCCTV.active}
                onChange={(e) =>
                  setNewCCTV((prev) => ({
                    ...prev,
                    active: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 mt-2">Maintenance</label>
              <input
                type="number"
                min={0}
                className="w-full border rounded p-2 mt-1"
                value={newCCTV.maintenance}
                onChange={(e) =>
                  setNewCCTV((prev) => ({
                    ...prev,
                    maintenance: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 mt-2">Offline</label>
              <input
                type="number"
                min={0}
                className="w-full border rounded p-2 mt-1"
                value={newCCTV.offline}
                onChange={(e) =>
                  setNewCCTV((prev) => ({
                    ...prev,
                    offline: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-4 flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow"
            onClick={addCCTV}
          >
            <Plus size={18} /> Tambah Data
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

export default EditCCTV;
