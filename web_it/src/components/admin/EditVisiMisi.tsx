import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Target, Award, TrendingUp, Plus, Trash2, X, CheckCircle } from "lucide-react";
import axios from 'axios';

// Konfigurasi instance apiClient langsung di sini
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Sesuaikan dengan URL backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

type Misi = {
  title: string;
  desc: string;
};

type Kpi = {
  target: string;
  value: string;
  achievement: string;
  status: string;
  description: string;
};

type SasaranMutu = {
  kategori: string;
  items: string[];
};

type VisiMisiData = {
  visi: string;
  misi: Misi[];
  kpi: Kpi[];
  // PERBAIKAN: Mengubah nama properti menjadi camelCase agar sesuai konvensi React
  sasaranMutu: SasaranMutu[];
};

const initialData: VisiMisiData = {
  visi: "",
  misi: [],
  kpi: [],
  sasaranMutu: [], // Menggunakan camelCase
};

const statusOptions = [
  { value: "exceeded", label: "Exceeded", color: "text-green-600", bg: "bg-green-100" },
  { value: "achieved", label: "Achieved", color: "text-blue-600", bg: "bg-blue-100" },
  { value: "pending", label: "Pending", color: "text-yellow-600", bg: "bg-yellow-100" }
];

const EditVisiMisi: React.FC = () => {
  const [data, setData] = useState<VisiMisiData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/visi-misi-page');
        
        const transformedData: VisiMisiData = {
          visi: response.data.visi ? response.data.visi.content : "",
          misi: (response.data.misi || []).map((item: any) => ({
            title: item.title,
            desc: item.description,
          })),
          kpi: response.data.kpi || [],
          // PERBAIKAN: Mengambil data dari kunci 'sasaran_mutu' dari backend
          sasaranMutu: response.data.sasaran_mutu || [],
        };

        setData(transformedData);
      } catch (err: any) {
        setError("Gagal memuat data dari server. Pastikan data sudah pernah disimpan sebelumnya.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Handler CRUD tidak perlu diubah, hanya perlu menyesuaikan nama properti ---
  const handleVisiChange = (value: string) => setData({ ...data, visi: value });
  const handleAddMisi = () => setData({ ...data, misi: [...data.misi, { title: "", desc: "" }] });
  const handleMisiChange = (idx: number, field: string, value: string) => {
    const newMisi = [...data.misi];
    newMisi[idx] = { ...newMisi[idx], [field]: value };
    setData({ ...data, misi: newMisi });
  };
  const handleDeleteMisi = (idx: number) => {
    const newMisi = data.misi.filter((_, i) => i !== idx);
    setData({ ...data, misi: newMisi });
  };
  const handleAddKPI = () =>
    setData({
      ...data,
      kpi: [
        ...data.kpi,
        { target: "", value: "", achievement: "", status: "pending", description: "" }
      ]
    });
  const handleKPIChange = (idx: number, field: string, value: string) => {
    const newKpi = [...data.kpi];
    newKpi[idx] = { ...newKpi[idx], [field]: value };
    setData({ ...data, kpi: newKpi });
  };
  const handleDeleteKPI = (idx: number) => {
    const newKpi = data.kpi.filter((_, i) => i !== idx);
    setData({ ...data, kpi: newKpi });
  };
  const handleAddSection = () =>
    setData({
      ...data,
      // PERBAIKAN: Menggunakan properti 'sasaranMutu' (camelCase)
      sasaranMutu: [...data.sasaranMutu, { kategori: "", items: [""] }]
    });
  const handleDeleteSection = (idx: number) => {
    // PERBAIKAN: Menggunakan properti 'sasaranMutu' (camelCase)
    const newSasaran = data.sasaranMutu.filter((_, i) => i !== idx);
    setData({ ...data, sasaranMutu: newSasaran });
  };
  const handleSectionTitleChange = (idx: number, value: string) => {
    const newSasaran = [...data.sasaranMutu];
    newSasaran[idx].kategori = value;
    setData({ ...data, sasaranMutu: newSasaran });
  };
  const handleAddSasaranItem = (sIdx: number) => {
    const newSasaran = [...data.sasaranMutu];
    newSasaran[sIdx].items.push("");
    setData({ ...data, sasaranMutu: newSasaran });
  };
  const handleSasaranItemChange = (sIdx: number, iIdx: number, value: string) => {
    const newSasaran = [...data.sasaranMutu];
    newSasaran[sIdx].items[iIdx] = value;
    setData({ ...data, sasaranMutu: newSasaran });
  };
  const handleDeleteSasaranItem = (sIdx: number, iIdx: number) => {
    const newSasaran = [...data.sasaranMutu];
    newSasaran[sIdx].items.splice(iIdx, 1);
    setData({ ...data, sasaranMutu: newSasaran });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      visi: { content: data.visi },
      misi: data.misi.map(item => ({
        title: item.title,
        description: item.desc,
      })),
      kpi: data.kpi,
      // PERBAIKAN: Mengirim data dengan kunci 'sasaran_mutu' ke backend
      sasaran_mutu: data.sasaranMutu,
    };

    try {
      await apiClient.post('/visi-misi-page', payload);
      alert("Data Visi Misi berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div>Memuat data...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <form className="space-y-6 mt-8" onSubmit={handleSave}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Edit Visi, Misi, KPI & Sasaran Mutu</h1>
      </div>

        {/* ... JSX Visi dan Misi ... */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Visi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full rounded border-gray-300 p-4 text-lg font-medium text-blue-900 bg-blue-50"
              rows={3}
              value={data.visi}
              onChange={(e) => handleVisiChange(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Misi</span>
            </CardTitle>
            <button
              type="button"
              title="Tambah Misi"
              onClick={handleAddMisi}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg ml-2"
            >
              <Plus size={18} />
            </button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[340px] overflow-y-auto">
            {data.misi.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border relative">
                <button
                  type="button"
                  onClick={() => handleDeleteMisi(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Hapus Misi"
                >
                  <X size={16} />
                </button>
                <input
                  className="w-full font-semibold text-gray-900 rounded border-gray-300 p-2 mb-2 bg-white"
                  placeholder="Judul Misi"
                  value={item.title}
                  onChange={(e) => handleMisiChange(idx, "title", e.target.value)}
                />
                <textarea
                  className="w-full text-sm text-gray-600 rounded border-gray-300 p-2"
                  placeholder="Deskripsi Misi"
                  value={item.desc}
                  rows={2}
                  onChange={(e) => handleMisiChange(idx, "desc", e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Key Performance Indicators (KPI)</span>
            </CardTitle>
            <button
              type="button"
              title="Tambah KPI"
              onClick={handleAddKPI}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg ml-2"
            >
              <Plus size={18} />
            </button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[340px] overflow-y-auto">
            {data.kpi.map((kpi, idx) => (
              <div key={idx} className="p-4 border rounded-lg relative bg-white">
                <button
                  type="button"
                  onClick={() => handleDeleteKPI(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Hapus KPI"
                >
                  <X size={16} />
                </button>
                <input
                  className="w-full font-semibold text-gray-900 rounded border-gray-300 p-2 mb-2 bg-gray-50"
                  placeholder="Target KPI"
                  value={kpi.target}
                  onChange={(e) => handleKPIChange(idx, "target", e.target.value)}
                />
                <div className="flex justify-between gap-2 mb-2">
                  <input
                    className="w-1/2 rounded border-gray-300 p-2 text-sm"
                    placeholder="Target Value"
                    value={kpi.value}
                    onChange={(e) => handleKPIChange(idx, "value", e.target.value)}
                  />
                  <input
                    className="w-1/2 rounded border-gray-300 p-2 text-sm"
                    placeholder="Pencapaian"
                    value={kpi.achievement}
                    onChange={(e) =>
                      handleKPIChange(idx, "achievement", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <select
                    className="rounded border-gray-300 text-sm p-2"
                    value={kpi.status}
                    onChange={(e) =>
                      handleKPIChange(idx, "status", e.target.value)
                    }
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`p-1 rounded-full ${
                      statusOptions.find((s) => s.value === kpi.status)?.bg
                    }`}
                    title={kpi.status}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${
                        statusOptions.find((s) => s.value === kpi.status)?.color
                      }`}
                    />
                  </div>
                </div>
                <textarea
                  className="w-full text-xs text-gray-600 rounded border-gray-300 p-2"
                  placeholder="Deskripsi KPI"
                  rows={2}
                  value={kpi.description}
                  onChange={(e) =>
                    handleKPIChange(idx, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      
      {/* PERBAIKAN: Menggunakan data.sasaranMutu (camelCase) untuk me-render */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Sasaran Mutu</span>
          </CardTitle>
          <button
            type="button"
            title="Tambah Section"
            onClick={handleAddSection}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg ml-2"
          >
            <Plus size={18} />
          </button>
        </CardHeader>
        <CardContent className="h-[340px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.sasaranMutu.map((section, sIdx) => (
              <div key={sIdx} className="relative border rounded-lg p-3 bg-blue-50/30 mb-2">
                <button
                  type="button"
                  onClick={() => handleDeleteSection(sIdx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Hapus Section"
                >
                  <Trash2 size={16} />
                </button>
                <input
                  className="w-full font-semibold text-gray-900 rounded border-gray-300 p-2 mb-2 bg-white"
                  placeholder="Judul/Kategori Sasaran"
                  value={section.kategori}
                  onChange={(e) =>
                    handleSectionTitleChange(sIdx, e.target.value)
                  }
                />
                <ul className="space-y-2 text-sm text-gray-600">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-1">
                      <input
                        className="w-full rounded border-gray-300 p-2 mb-1"
                        value={item}
                        placeholder="Deskripsi Sasaran Mutu"
                        onChange={(e) =>
                          handleSasaranItemChange(sIdx, iIdx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSasaranItem(sIdx, iIdx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleAddSasaranItem(sIdx)}
                  className="mt-2 flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  <Plus size={14} />
                  Tambah Item
                </button>
              </div>
            ))}
            {data.sasaranMutu.length === 0 && (
              <div className="text-sm text-gray-400 italic py-6 text-center col-span-2">
                Belum ada section sasaran mutu.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default EditVisiMisi;
