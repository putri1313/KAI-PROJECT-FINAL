import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import axios from 'axios'; // Import axios secara langsung

// Konfigurasi instance apiClient langsung di sini untuk mengatasi masalah resolusi path
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Sesuaikan dengan URL backend Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipe data ini sudah benar (menggunakan camelCase)
type JenisLayanan =
  | "Loket"
  | "CIC"
  | "Boarding"
  | "Sisa Tempat Duduk"
  | "Mesin Antrian"
  | "Informasi Jalur KA";

type TicketingPoint = {
  id?: number;
  lokasi: string;
  alamat: string;
  totalCounter?: number;
  counterAktif?: number;
  jenisLayanan: JenisLayanan[];
};

const LayananTicketing: React.FC = () => {
  const [ticketingPoints, setTicketingPoints] = useState<TicketingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/layanan-ticketing");

        console.log("API Response (User):", response.data);

        // 1. Ambil data langsung dari response.data.points
        const responseData = response.data.points || [];

        // 2. Lakukan mapping dari snake_case (API) ke camelCase (State React)
        const formattedData = responseData.map((point: any) => ({
          id: point.id,
          lokasi: point.lokasi,
          alamat: point.alamat,
          totalCounter: point.total_counter, // Transformasi
          counterAktif: point.counter_aktif, // Transformasi
          // Pastikan jenis_layanan adalah array, karena dari DB bisa jadi string JSON
          jenisLayanan: Array.isArray(point.jenis_layanan) 
            ? point.jenis_layanan 
            : (typeof point.jenis_layanan === 'string' ? JSON.parse(point.jenis_layanan) : []),
        }));

        // 3. Simpan data yang sudah diformat ke dalam state
        setTicketingPoints(formattedData);

      } catch (err) {
        setError("Gagal memuat data layanan ticketing.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6 mt-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Layanan Ticketing</h1>
        <p className="text-blue-100 text-lg">
          Sistem dan Infrastruktur Penjualan Tiket Kereta Api Divre IV
        </p>
      </div>

      {/* Ticketing Points Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ticket className="h-5 w-5" />
            <span>Titik Layanan Ticketing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ticketingPoints.map((point) => (
              <div key={point.id} className="p-4 border rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {point.lokasi}
                </h4>
                {point.alamat && (
                  <p className="text-sm text-gray-600 mb-2">{point.alamat}</p>
                )}
                <p className="text-sm text-gray-700">
                  <b>Total Counter:</b> {point.totalCounter ?? "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <b>Counter Aktif:</b> {point.counterAktif ?? "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <b>Jenis Layanan:</b>{" "}
                  {point.jenisLayanan && point.jenisLayanan.length > 0
                    ? point.jenisLayanan.join(", ")
                    : "Tidak ada layanan"}
                </p>
              </div>
            ))}
            {ticketingPoints.length === 0 && !loading && (
              <p className="text-sm text-gray-500 col-span-full">
                Belum ada data titik layanan yang tersedia.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayananTicketing;

