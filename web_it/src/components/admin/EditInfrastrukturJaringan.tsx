import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Network,
  Server,
  Shield,
  Globe,
  Trash2,
  Plus,
  Save,
  MoveVertical,
} from "lucide-react";
import apiClient from "@/api/apiClient"; // 1. Import API Client

// --- Tipe Data (Sesuai dengan state dan backend) ---
type Topologi = {
  lokasi: string;
  jenis: string;
  perangkat: string[];
  bandwidth: string;
  status: string;
  uptime: string;
};

type Perangkat = {
  kategori: string;
  brand: string;
  model: string;
  jumlah: number;
  lokasi: string;
  kondisi: string;
};

type Konektivitas = {
  provider: string;
  jenis: string;
  bandwidth: string;
  status: string;
};

type SecurityCategory = {
  kategori: string;
  items: string[];
};

const kondisiOptions = ["Excellent", "Good", "Maintenance"];

const EditInfrastrukturJaringan: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [topologi, setTopologi] = useState<Topologi[]>([]);
  const [perangkat, setPerangkat] = useState<Perangkat[]>([]);
  const [konektivitas, setKonektivitas] = useState<Konektivitas[]>([]);
  const [security, setSecurity] = useState<SecurityCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Gunakan useEffect untuk mengambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/infrastruktur-jaringan');
        
        // Set state untuk setiap bagian dari data yang diterima
        setTopologi(response.data.topologi || []);
        setPerangkat(response.data.perangkat || []);
        setKonektivitas(response.data.konektivitas || []);
        setSecurity(response.data.security || []);

      } catch (err: any) {
        setError("Gagal memuat data dari server. Pastikan data sudah pernah disimpan sebelumnya.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Semua handler CRUD lokal Anda tidak perlu diubah ---
  const addSecurityCategory = () =>
    setSecurity([...security, { kategori: "Kategori Baru", items: [""] }]);
  const removeSecurityCategory = (idx: number) =>
    setSecurity(security.filter((_, i) => i !== idx));
  const handleSecurityCategoryChange = (idx: number, value: string) => {
    setSecurity(
      security.map((cat, i) => (i === idx ? { ...cat, kategori: value } : cat))
    );
  };
  const handleSecurityItemChange = (cIdx: number, iIdx: number, value: string) => {
    setSecurity(
      security.map((cat, i) =>
        i === cIdx
          ? { ...cat, items: cat.items.map((item, ii) => (ii === iIdx ? value : item)) }
          : cat
      )
    );
  };
  const addSecurityItem = (cIdx: number) => {
    setSecurity(
      security.map((cat, i) =>
        i === cIdx ? { ...cat, items: [...cat.items, ""] } : cat
      )
    );
  };
  const removeSecurityItem = (cIdx: number, iIdx: number) => {
    setSecurity(
      security.map((cat, i) =>
        i === cIdx
          ? { ...cat, items: cat.items.filter((_, ii) => ii !== iIdx) }
          : cat
      )
    );
  };
  const addTopologi = () =>
    setTopologi([
      ...topologi,
      {
        lokasi: "", jenis: "", perangkat: [""], bandwidth: "",
        status: "operational", uptime: "",
      },
    ]);
  const removeTopologi = (idx: number) =>
    setTopologi(topologi.filter((_, i) => i !== idx));
  const handleTopologiChange = (idx: number, field: keyof Topologi, value: any) => {
    setTopologi(
      topologi.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  };
  const handleDeviceChange = (tidx: number, didx: number, value: string) => {
    setTopologi(
      topologi.map((t, i) =>
        i === tidx
          ? { ...t, perangkat: t.perangkat.map((d, di) => (di === didx ? value : d)) }
          : t
      )
    );
  };
  const addDevice = (tidx: number) => {
    setTopologi(
      topologi.map((t, i) =>
        i === tidx ? { ...t, perangkat: [...t.perangkat, ""] } : t
      )
    );
  };
  const removeDevice = (tidx: number, didx: number) => {
    setTopologi(
      topologi.map((t, i) =>
        i === tidx
          ? { ...t, perangkat: t.perangkat.filter((_, di) => di !== didx) }
          : t
      )
    );
  };
  const addPerangkat = () =>
    setPerangkat([
      ...perangkat,
      {
        kategori: "", brand: "", model: "", jumlah: 0,
        lokasi: "", kondisi: "Good",
      },
    ]);
  const removePerangkat = (idx: number) =>
    setPerangkat(perangkat.filter((_, i) => i !== idx));
  const handlePerangkatChange = (idx: number, field: keyof Perangkat, value: any) => {
    setPerangkat(
      perangkat.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };
  const addKonektivitas = () =>
    setKonektivitas([
      ...konektivitas,
      {
        provider: "", jenis: "", bandwidth: "",
         status: "active",
      },
    ]);
  const removeKonektivitas = (idx: number) =>
    setKonektivitas(konektivitas.filter((_, i) => i !== idx));
  const handleKonektivitasChange = (idx: number, field: keyof Konektivitas, value: any) => {
    setKonektivitas(
      konektivitas.map((k, i) => (i === idx ? { ...k, [field]: value } : k))
    );
  };

  // 3. Ubah handleSave untuk mengirim semua data ke backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      topologi,
      perangkat,
      konektivitas,
      security,
    };

    try {
      await apiClient.post('/infrastruktur-jaringan', payload);
      alert("Data infrastruktur jaringan berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    }
  };

  // 4. Tampilkan pesan loading atau error
  if (loading) {
    return <div className="text-center p-8">Memuat data infrastruktur...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <form className="space-y-6 mt-8" onSubmit={handleSave}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Edit Infrastruktur Jaringan</h1>
        <p className="text-blue-100 text-lg">
          Kelola Data Topologi, Inventori, Provider, dan Keamanan Jaringan Divre IV
        </p>
      </div>

      {/* Semua JSX Anda di bawah ini tidak perlu diubah sama sekali */}
      {/* ... (Salin semua JSX dari Card Topologi sampai tombol Simpan di sini) ... */}
      {/* Topologi Jaringan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Topologi Jaringan Regional</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
            {topologi.map((node, idx) => (
              <div key={idx} className="p-4 border rounded-lg space-y-2 relative bg-gray-50">
                <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeTopologi(idx)} title="Hapus lokasi">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Lokasi<input className="w-full border rounded p-2 mt-1" value={node.lokasi} onChange={(e) => handleTopologiChange(idx, "lokasi", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1 mt-2">Jenis<input className="w-full border rounded p-2 mt-1" value={node.jenis} onChange={(e) => handleTopologiChange(idx, "jenis", e.target.value)} /></label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bandwidth<input className="w-full border rounded p-2 mt-1" value={node.bandwidth} onChange={(e) => handleTopologiChange(idx, "bandwidth", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1 mt-2">Status
                      <select className="w-full border rounded p-2 mt-1" value={node.status} onChange={(e) => handleTopologiChange(idx, "status", e.target.value)}>
                        <option value="operational">Operational</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="down">Down</option>
                      </select>
                    </label>
                    <label className="block text-sm font-medium mb-1 mt-2">Uptime<input className="w-full border rounded p-2 mt-1" value={node.uptime} onChange={(e) => handleTopologiChange(idx, "uptime", e.target.value)} /></label>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium mb-1">Perangkat Utama:</div>
                  {node.perangkat.map((dev, didx) => (
                    <div key={didx} className="flex gap-2 items-center mb-2">
                      <input className="w-full border rounded p-2" value={dev} onChange={(e) => handleDeviceChange(idx, didx, e.target.value)} placeholder="Nama perangkat" />
                      <button type="button" className="text-red-500 hover:text-red-700" onClick={() => removeDevice(idx, didx)} title="Hapus perangkat"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button type="button" className="text-blue-700 flex items-center gap-1 mt-1" onClick={() => addDevice(idx)}><Plus size={16} /> Tambah Perangkat</button>
                </div>
              </div>
            ))}
            <button type="button" className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded px-4 py-2 font-medium" onClick={addTopologi}>
              <Plus size={18} /> Tambah Lokasi Topologi
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Perangkat Jaringan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Inventori Perangkat Jaringan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Kategori</th>
                  <th className="text-left p-3">Brand</th>
                  <th className="text-left p-3">Model</th>
                  <th className="text-left p-3">Jumlah</th>
                  <th className="text-left p-3">Lokasi</th>
                  <th className="text-left p-3">Kondisi</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {perangkat.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3"><input className="w-full border rounded p-2" value={item.kategori} onChange={(e) => handlePerangkatChange(idx, "kategori", e.target.value)} placeholder="Kategori" /></td>
                    <td className="p-3"><input className="w-full border rounded p-2" value={item.brand} onChange={(e) => handlePerangkatChange(idx, "brand", e.target.value)} placeholder="Brand" /></td>
                    <td className="p-3"><input className="w-full border rounded p-2" value={item.model} onChange={(e) => handlePerangkatChange(idx, "model", e.target.value)} placeholder="Model" /></td>
                    <td className="p-3"><input type="number" min={0} className="w-20 border rounded p-2" value={item.jumlah} onChange={(e) => handlePerangkatChange(idx, "jumlah", parseInt(e.target.value, 10))} placeholder="Jumlah" /></td>
                    <td className="p-3"><input className="w-full border rounded p-2" value={item.lokasi} onChange={(e) => handlePerangkatChange(idx, "lokasi", e.target.value)} placeholder="Lokasi" /></td>
                    <td className="p-3">
                      <select className="w-full border rounded p-2" value={item.kondisi} onChange={(e) => handlePerangkatChange(idx, "kondisi", e.target.value)}>
                        {kondisiOptions.map((opt) => (<option value={opt} key={opt}>{opt}</option>))}
                      </select>
                    </td>
                    <td className="p-3"><button type="button" className="text-red-500 hover:text-red-700" onClick={() => removePerangkat(idx)} title="Hapus perangkat"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded px-4 py-2 font-medium mt-3" onClick={addPerangkat}>
              <Plus size={18} /> Tambah Perangkat Jaringan
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Konektivitas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Konektivitas & Provider</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2">
            {konektivitas.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg relative bg-gray-50">
                <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeKonektivitas(idx)} title="Hapus provider"><Trash2 size={18} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Provider<input className="w-full border rounded p-2 mt-1" value={item.provider} onChange={(e) => handleKonektivitasChange(idx, "provider", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1 mt-2">Jenis<input className="w-full border rounded p-2 mt-1" value={item.jenis} onChange={(e) => handleKonektivitasChange(idx, "jenis", e.target.value)} /></label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bandwidth<input className="w-full border rounded p-2 mt-1" value={item.bandwidth} onChange={(e) => handleKonektivitasChange(idx, "bandwidth", e.target.value)} /></label>
                    <label className="block text-sm font-medium mb-1 mt-2">Status
                      <select className="w-full border rounded p-2 mt-1" value={item.status} onChange={(e) => handleKonektivitasChange(idx, "status", e.target.value)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                 
                </div>
              </div>
            ))}
            <button type="button" className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded px-4 py-2 font-medium" onClick={addKonektivitas}>
              <Plus size={18} /> Tambah Provider
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security Infrastructure (CRUD) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Infrastruktur Keamanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2">
            {security.map((cat, cIdx) => (
              <div key={cIdx} className="border rounded-lg p-4 relative bg-gray-50">
                <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" title="Hapus kategori" onClick={() => removeSecurityCategory(cIdx)}><Trash2 size={18} /></button>
                <input className="w-full font-bold border border-blue-200 rounded p-2 mb-2 bg-white" value={cat.kategori} onChange={(e) => handleSecurityCategoryChange(cIdx, e.target.value)} />
                <ul className="space-y-2 mb-2">
                  {cat.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex gap-2 items-center">
                      <MoveVertical className="text-blue-300" size={16} />
                      <input className="flex-1 border rounded p-2" value={item} onChange={(e) => handleSecurityItemChange(cIdx, iIdx, e.target.value)} placeholder="Deskripsi keamanan" />
                      <button type="button" className="text-red-400 hover:text-red-700" onClick={() => removeSecurityItem(cIdx, iIdx)} title="Hapus"><Trash2 size={16} /></button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="text-blue-700 flex items-center gap-1 mt-1" onClick={() => addSecurityItem(cIdx)}><Plus size={16} /> Tambah Item</button>
              </div>
            ))}
            <button type="button" className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded px-4 py-2 font-medium" onClick={addSecurityCategory}>
              <Plus size={18} /> Tambah Kategori Keamanan
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Simpan */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2"
        >
          <Save size={18} /> Simpan
        </button>
      </div>
    </form>
  );
};

export default EditInfrastrukturJaringan;