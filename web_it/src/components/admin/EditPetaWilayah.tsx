import React, { useRef, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadCloud, Trash2, Map } from "lucide-react";
import apiClient from "@/api/apiClient";

// Tipe data respons backend untuk peta wilayah
type PetaWilayahData = {
  id: number;
  file_path: string;
  peta_name: string;
  image_url: string;
};

// Komponen modal notifikasi sederhana
const NotificationModal = ({
  message,
  onConfirm,
  onCancel,
  type,
}: {
  message: string;
  onConfirm?: () => void;
  onCancel: () => void;
  type: "confirm" | "alert";
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
      <p className="text-lg mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          {type === "confirm" ? "Batal" : "Tutup"}
        </button>
        {type === "confirm" && onConfirm && (
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  </div>
);

const EditPetaWilayah: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "confirm" | "alert";
    onConfirm?: () => void;
  } | null>(null);

  // Ambil data peta wilayah dari server
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<PetaWilayahData>("/peta-wilayah");
        if (response.data.peta && response.data.peta.image_url) {
          setImage(response.data.peta.image_url);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.log("Belum ada peta wilayah yang diupload.");
        } else {
          console.error("Gagal memuat peta wilayah:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, []);

  // Pilih file baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setImage(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Hapus peta wilayah
  const handleRemove = async () => {
    const proceedRemove = async () => {
      setNotification(null);
      try {
        await apiClient.delete("/peta-wilayah");
        setImage(null);
        setImageFile(null);
        if (inputFileRef.current) inputFileRef.current.value = "";
        setNotification({
          message: "Peta wilayah berhasil dihapus.",
          type: "alert",
          onCancel: () => setNotification(null),
        });
      } catch (error: any) {
        setNotification({
          message:
            "Gagal menghapus peta wilayah: " +
            (error.response?.data?.message || error.message),
          type: "alert",
          onCancel: () => setNotification(null),
        });
      }
    };

    setNotification({
      message: "Yakin ingin menghapus peta wilayah ini?",
      type: "confirm",
      onConfirm: proceedRemove,
      onCancel: () => setNotification(null),
    });
  };

  // Simpan peta wilayah baru
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setNotification({
        message: "Silakan pilih peta wilayah untuk diunggah!",
        type: "alert",
        onCancel: () => setNotification(null),
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await apiClient.post<PetaWilayahData>(
        "/peta-wilayah",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
        const newImageUrl = response.data.data.image_url;
        if (newImageUrl) {
            setImage(`${newImageUrl}?v=${new Date().getTime()}`);
        }

      setNotification({
        message: "Peta wilayah berhasil disimpan!",
        type: "alert",
        onCancel: () => setNotification(null),
      });
    } catch (error: any) {
      setNotification({
        message:
          "Gagal menyimpan peta wilayah: " +
          (error.response?.data?.message || error.message),
        type: "alert",
        onCancel: () => setNotification(null),
      });
    }
  };

  if (loading) {
    return <div className="text-center p-8">Memuat...</div>;
  }

  return (
    <>
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onConfirm={notification.onConfirm}
          onCancel={() => setNotification(null)}
        />
      )}
      <form className="space-y-6 mt-8" onSubmit={handleSave}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
          <h1 className="text-3xl font-bold mb-2">Edit Peta Wilayah</h1>
          <p className="text-blue-100 text-lg">
            Upload & Kelola Gambar Peta Wilayah Operasional
          </p>
        </div>

        {/* Upload & Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Map className="h-5 w-5" />
              <span>Peta Wilayah</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              {!image && (
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-8 bg-blue-50 cursor-pointer w-full max-w-xl mx-auto"
                  onClick={() => inputFileRef.current?.click()}
                  style={{ minHeight: 200 }}
                >
                  <UploadCloud size={48} className="text-blue-400 mb-2" />
                  <div className="text-blue-700 mb-2 font-semibold text-lg">
                    Upload Peta Wilayah
                  </div>
                  <div className="text-xs text-blue-500 mb-2">
                    Format JPG, PNG, atau SVG. Max 2MB.
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Pilih Gambar
                  </button>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleFileChange}
                    ref={inputFileRef}
                    className="hidden"
                  />
                </div>
              )}

              {image && (
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center mb-2 gap-2">
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-100 rounded px-2 py-1"
                    >
                      <Trash2 size={16} /> Hapus Peta
                    </button>
                    <button
                      type="button"
                      onClick={() => inputFileRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-2"
                    >
                      Ganti Peta
                    </button>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleFileChange}
                      ref={inputFileRef}
                      className="hidden"
                    />
                  </div>
                  <div
                    className="border rounded-lg overflow-auto max-h-[500px] max-w-full bg-white"
                    style={{ boxShadow: "0 2px 8px #0002" }}
                  >
                    <img
                      src={image}
                      alt="Peta Wilayah"
                      className="block"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Pratinjau gambar asli (ukuran sesuai file yang diupload).
                  </div>
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
    </>
  );
};

export default EditPetaWilayah;
