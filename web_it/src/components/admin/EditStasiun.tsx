import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Save, Edit, X } from "lucide-react";
import apiClient from "@/api/apiClient"; // Pastikan path ini benar

// --- Tipe Data Disederhanakan ---
type Stasiun = {
  id: number; // ID dari database
  nama: string;
  kode: string;
  provinsi: string;
  kelas: string;
  jalur: string;
};

type NewStasiun = Omit<Stasiun, 'id'>;

const provinsiList = ["Lampung", "Bengkulu", "Sumatera Selatan"];
const kelasList = ["Besar", "Sedang", "Kecil"];
const jalurList = ["Lintas Selatan", "Lintas Timur", "Lintas Tengah"];

const EditStasiun: React.FC = () => {
  const [stasiunData, setStasiunData] = useState<Stasiun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvinsi, setFilterProvinsi] = useState("all");

  const [newStasiun, setNewStasiun] = useState<NewStasiun>({
    nama: "",
    kode: "",
    provinsi: provinsiList[0],
    kelas: kelasList[0],
    jalur: jalurList[0],
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBuffer, setEditBuffer] = useState<Stasiun | null>(null);

  // Mengambil data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchStasiun = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Stasiun[]>('/stasiun');
        setStasiunData(response.data);
      } catch (err) {
        setError("Gagal mengambil data dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchStasiun();
  }, []);

  const filteredStasiun = stasiunData.filter((stasiun) => {
    const matchSearch =
      stasiun.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stasiun.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filterProvinsi === "all" || stasiun.provinsi === filterProvinsi;
    return matchSearch && matchFilter;
  });

  const handleInput = (
    obj: Stasiun | NewStasiun,
    setObj: React.Dispatch<React.SetStateAction<any>>,
    field: keyof Stasiun,
    value: any
  ) => {
    setObj({ ...obj, [field]: value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStasiun.nama || !newStasiun.kode) return;
    try {
      const response = await apiClient.post<Stasiun>('/stasiun', newStasiun);
      setStasiunData([...stasiunData, response.data]);
      setNewStasiun({
        nama: "",
        kode: "",
        provinsi: provinsiList[0],
        kelas: kelasList[0],
        jalur: jalurList[0],
      });
    } catch (err: any) {
      alert("Gagal menambahkan stasiun: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus data stasiun ini?")) {
      try {
        await apiClient.delete(`/stasiun/${id}`);
        setStasiunData(stasiunData.filter((item) => item.id !== id));
      } catch (err: any) {
        alert("Gagal menghapus stasiun: " + err.message);
      }
    }
  };

  const handleStartEdit = (id: number) => {
    const row = stasiunData.find((s) => s.id === id);
    if (!row) return;
    setEditingId(id);
    setEditBuffer({ ...row });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditBuffer(null);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editBuffer) return;
    try {
      const response = await apiClient.put<Stasiun>(`/stasiun/${id}`, editBuffer);
      setStasiunData(stasiunData.map((item) => (item.id === id ? response.data : item)));
      setEditingId(null);
      setEditBuffer(null);
    } catch (err: any) {
      alert("Gagal menyimpan perubahan: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center p-8">Memuat data...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Edit Data Stasiun</h1>
        <p className="text-blue-100 text-lg">
          Kelola, tambah, edit, dan hapus data stasiun Divre IV Tanjungkarang
        </p>
      </div>

      {/* Tambah Data */}
      <Card>
        <CardHeader><CardTitle>Tambah Stasiun Baru</CardTitle></CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={handleAdd}>
            <div>
              <label className="block font-medium mb-1">Nama Stasiun</label>
              <input className="w-full border rounded p-2"
                value={newStasiun.nama}
                onChange={(e) => handleInput(newStasiun, setNewStasiun, "nama", e.target.value)}
                required />
            </div>
            <div>
              <label className="block font-medium mb-1">Kode</label>
              <input className="w-full border rounded p-2"
                value={newStasiun.kode}
                onChange={(e) => handleInput(newStasiun, setNewStasiun, "kode", e.target.value)}
                required />
            </div>
            <div>
              <label className="block font-medium mb-1">Provinsi</label>
              <select className="w-full border rounded p-2"
                value={newStasiun.provinsi}
                onChange={(e) => handleInput(newStasiun, setNewStasiun, "provinsi", e.target.value)}>
                {provinsiList.map((p) => (<option key={p}>{p}</option>))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Kelas</label>
              <select className="w-full border rounded p-2"
                value={newStasiun.kelas}
                onChange={(e) => handleInput(newStasiun, setNewStasiun, "kelas", e.target.value)}>
                {kelasList.map((k) => (<option key={k}>{k}</option>))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Jalur</label>
              <select className="w-full border rounded p-2"
                value={newStasiun.jalur}
                onChange={(e) => handleInput(newStasiun, setNewStasiun, "jalur", e.target.value)}>
                {jalurList.map((j) => (<option key={j}>{j}</option>))}
              </select>
            </div>
            <div className="col-span-full flex gap-3 justify-end mt-2">
              <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2">
                <Plus size={18} /> Tambah Stasiun
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tabel Data */}
      <Card>
        <CardHeader><CardTitle>Daftar Data Stasiun ({filteredStasiun.length})</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                {['Nama', 'Kode', 'Provinsi', 'Kelas', 'Jalur', 'Aksi'].map(h => <th key={h} className="p-2 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredStasiun.map((s) =>
                editingId === s.id && editBuffer ? (
                  <tr key={s.id} className="bg-blue-50">
                    <td className="p-2"><input className="w-full border rounded p-1"
                      value={editBuffer.nama}
                      onChange={(e) => handleInput(editBuffer, setEditBuffer, "nama", e.target.value)} /></td>
                    <td className="p-2"><input className="w-full border rounded p-1"
                      value={editBuffer.kode}
                      onChange={(e) => handleInput(editBuffer, setEditBuffer, "kode", e.target.value)} /></td>
                    <td className="p-2"><select className="w-full border rounded p-1"
                      value={editBuffer.provinsi}
                      onChange={(e) => handleInput(editBuffer, setEditBuffer, "provinsi", e.target.value)}>
                      {provinsiList.map(p => <option key={p}>{p}</option>)}
                    </select></td>
                    <td className="p-2"><select className="w-full border rounded p-1"
                      value={editBuffer.kelas}
                      onChange={(e) => handleInput(editBuffer, setEditBuffer, "kelas", e.target.value)}>
                      {kelasList.map(k => <option key={k}>{k}</option>)}
                    </select></td>
                    <td className="p-2"><select className="w-full border rounded p-1"
                      value={editBuffer.jalur}
                      onChange={(e) => handleInput(editBuffer, setEditBuffer, "jalur", e.target.value)}>
                      {jalurList.map(j => <option key={j}>{j}</option>)}
                    </select></td>
                    <td className="p-2 flex gap-1">
                      <button onClick={() => handleSaveEdit(editBuffer.id)} title="Simpan"><Save size={16} /></button>
                      <button onClick={handleCancelEdit} title="Batal"><X size={16} /></button>
                    </td>
                  </tr>
                ) : (
                  <tr key={s.id}>
                    <td className="p-2">{s.nama}</td>
                    <td className="p-2">{s.kode}</td>
                    <td className="p-2">{s.provinsi}</td>
                    <td className="p-2">{s.kelas}</td>
                    <td className="p-2">{s.jalur}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => handleStartEdit(s.id)} title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(s.id)} title="Hapus"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditStasiun;
