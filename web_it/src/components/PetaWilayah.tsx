import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/api/apiClient";

type Peta = {
  id?: number;
  image_url: string;
};

const PetaWilayah: React.FC = () => {
  const [peta, setPeta] = useState<Peta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/peta-wilayah");
        setPeta(response.data.peta || null);
      } catch (err) {
        setError("Gagal memuat data peta wilayah.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Memuat peta...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6 mt-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl text-center">
        <h1 className="text-3xl font-bold mb-2">Peta Wilayah Operasional</h1>
        <p className="text-blue-100 text-lg">
          Cakupan Wilayah dan Infrastruktur Kereta Api Divre IV Tanjungkarang
        </p>
      </div>

      {/* Peta Interaktif */}
      <Card>
        <CardHeader>
          <CardTitle>Peta Interaktif</CardTitle>
        </CardHeader>
        <CardContent>
          {peta && peta.image_url ? (
            <img
              src={peta.image_url}
              alt="Peta Wilayah Operasional"
              className="w-full h-auto rounded-lg border shadow"
            />
          ) : (
            <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
              Peta belum tersedia.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PetaWilayah;
