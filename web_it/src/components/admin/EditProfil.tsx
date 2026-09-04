import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building, Target, Plus, Trash2, X } from "lucide-react";
import apiClient from "@/api/apiClient"; // <- 1. Import API client

// Struktur data awal yang kosong, untuk state sebelum data dari API dimuat
const initialData = {
  deskripsi: "",
  tahun: "",
  lokasi: "",
  fungsi: [],
  tanggungjawab: [],
  kontak: {
    alamat: "",
    telepon: "",
    email: "",
  },
};

const EditProfil: React.FC = () => {
  // 2. Tambahkan state untuk loading dan error
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Gunakan useEffect untuk mengambil data dari backend saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/profil-divisi');
        setData(response.data);
      } catch (err: any) {
        // Jika error 404, artinya profil belum ada. Tidak apa-apa, form bisa digunakan untuk membuat baru.
        if (err.response && err.response.status === 404) {
          setData(initialData); // Gunakan data kosong
        } else {
          setError("Gagal memuat data profil dari server.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen mount

  // --- Semua handler CRUD lokal Anda (handleAddFungsi, dll) tidak perlu diubah ---
  // Mereka sudah bekerja dengan benar pada state 'data'.
  const handleAddFungsi = () => {
    setData({
      ...data,
      fungsi: [...data.fungsi, { title: "", desc: "" }],
    });
  };
  const handleFungsiChange = (idx: number, field: string, value: string) => {
    const newFungsi = [...data.fungsi];
    newFungsi[idx] = { ...newFungsi[idx], [field]: value };
    setData({ ...data, fungsi: newFungsi });
  };
  const handleDeleteFungsi = (idx: number) => {
    const newFungsi = [...data.fungsi];
    newFungsi.splice(idx, 1);
    setData({ ...data, fungsi: newFungsi });
  };
  const handleAddSection = () => {
    setData({
      ...data,
      tanggungjawab: [
        ...data.tanggungjawab,
        { title: "", items: [""] },
      ],
    });
  };
  const handleDeleteSection = (sIdx: number) => {
    const newTJ = [...data.tanggungjawab];
    newTJ.splice(sIdx, 1);
    setData({ ...data, tanggungjawab: newTJ });
  };
  const handleSectionTitleChange = (sIdx: number, value: string) => {
    const newTJ = [...data.tanggungjawab];
    newTJ[sIdx] = { ...newTJ[sIdx], title: value };
    setData({ ...data, tanggungjawab: newTJ });
  };
  const handleAddTanggungJawab = (sIdx: number) => {
    const newTJ = [...data.tanggungjawab];
    newTJ[sIdx].items.push("");
    setData({ ...data, tanggungjawab: newTJ });
  };
  const handleTanggungJawabChange = (
    sIdx: number,
    iIdx: number,
    value: string
  ) => {
    const newTJ = [...data.tanggungjawab];
    newTJ[sIdx].items[iIdx] = value;
    setData({ ...data, tanggungjawab: newTJ });
  };
  const handleDeleteTanggungJawab = (sIdx: number, iIdx: number) => {
    const newTJ = [...data.tanggungjawab];
    newTJ[sIdx].items.splice(iIdx, 1);
    setData({ ...data, tanggungjawab: newTJ });
  };

  // 4. Ubah handleSave untuk mengirim data ke backend
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mengirim seluruh state 'data' ke endpoint update
      await apiClient.post('/profil-divisi/update', data);
      alert("Data profil berhasil disimpan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menyimpan data: " + (err.response?.data?.message || err.message));
    }
  };

  // 5. Tampilkan pesan loading atau error jika ada
  if (loading) {
    return <div>Memuat data profil...</div>;
  }
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <form className="space-y-6 mt-8" onSubmit={handleSave}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Edit Profil Divisi Sistem Informasi</h1>
        <p className="text-blue-100 text-lg">
          Divisi Regional IV Tanjungkarang - PT Kereta Api Indonesia
        </p>
      </div>

      {/* Main Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Tentang Divisi Sistem Informasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Deskripsi Umum
              </h4>
              <textarea
                className="w-full rounded border-gray-300 p-2 text-sm"
                rows={4}
                value={data.deskripsi}
                onChange={(e) =>
                  setData({ ...data, deskripsi: e.target.value })
                }
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tahun Pembentukan
              </h4>
              <input
                className="w-full rounded border-gray-300 p-2 text-sm"
                value={data.tahun}
                onChange={(e) =>
                  setData({ ...data, tahun: e.target.value })
                }
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Lokasi Kantor Pusat
              </h4>
              <input
                className="w-full rounded border-gray-300 p-2 text-sm"
                value={data.lokasi}
                onChange={(e) =>
                  setData({ ...data, lokasi: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Functions */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Fungsi Utama</span>
            </CardTitle>
            <button
              type="button"
              title="Tambah Fungsi"
              onClick={handleAddFungsi}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg ml-2"
            >
              <Plus size={18} />
            </button>
          </CardHeader>
          <CardContent className="space-y-4 h-[320px] overflow-y-auto">
            {data.fungsi.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 relative group border-b pb-2 mb-2">
                <div className="flex-1 space-y-1">
                  <input
                    className="w-full font-medium text-gray-900 rounded border-gray-300 p-2 mb-1"
                    placeholder="Judul Fungsi"
                    value={item.title}
                    onChange={(e) =>
                      handleFungsiChange(idx, "title", e.target.value)
                    }
                  />
                  <textarea
                    className="w-full text-sm text-gray-600 rounded border-gray-300 p-2"
                    placeholder="Deskripsi Fungsi"
                    value={item.desc}
                    rows={2}
                    onChange={(e) =>
                      handleFungsiChange(idx, "desc", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  title="Hapus Fungsi"
                  onClick={() => handleDeleteFungsi(idx)}
                  className="text-red-500 hover:text-red-700 absolute top-0 right-0"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            {data.fungsi.length === 0 && (
              <div className="text-sm text-gray-400 italic py-6 text-center">Belum ada fungsi utama.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tanggung Jawab dan Lingkup Kerja (Section CRUD) */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Tanggung Jawab dan Lingkup Kerja</CardTitle>
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
            {data.tanggungjawab.map((section, sIdx) => (
              <div key={sIdx} className="relative border rounded-lg p-3 bg-blue-50/30 mb-2">
                <button
                  type="button"
                  title="Hapus Section"
                  onClick={() => handleDeleteSection(sIdx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
                <input
                  className="w-full font-semibold text-gray-900 rounded border-gray-300 p-2 mb-2 bg-white"
                  placeholder="Judul Section"
                  value={section.title}
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
                        placeholder="Deskripsi Tanggung Jawab"
                        onChange={(e) =>
                          handleTanggungJawabChange(sIdx, iIdx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        title="Hapus"
                        onClick={() => handleDeleteTanggungJawab(sIdx, iIdx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleAddTanggungJawab(sIdx)}
                  className="mt-2 flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  <Plus size={14} />
                  Tambah Item
                </button>
              </div>
            ))}
            {data.tanggungjawab.length === 0 && (
              <div className="text-sm text-gray-400 italic py-6 text-center col-span-2">Belum ada section tanggung jawab.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Alamat</h4>
              <textarea
                className="w-full rounded border-gray-300 p-2 text-sm"
                value={data.kontak.alamat}
                rows={4}
                onChange={(e) =>
                  setData({
                    ...data,
                    kontak: { ...data.kontak, alamat: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Telepon</h4>
              <input
                className="w-full rounded border-gray-300 p-2 text-sm"
                value={data.kontak.telepon}
                onChange={(e) =>
                  setData({
                    ...data,
                    kontak: { ...data.kontak, telepon: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
              <textarea
                className="w-full rounded border-gray-300 p-2 text-sm"
                value={data.kontak.email}
                rows={3}
                onChange={(e) =>
                  setData({
                    ...data,
                    kontak: { ...data.kontak, email: e.target.value },
                  })
                }
              />
            </div>
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

export default EditProfil;