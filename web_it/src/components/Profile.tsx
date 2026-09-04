import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Target, Award, Network, Shield } from 'lucide-react';
import apiClient from '@/api/apiClient'; // 1. Import API client

// 2. Definisikan tipe data sesuai dengan response API
type Fungsi = {
  title: string;
  desc: string;
};

type TanggungJawab = {
  title: string;
  items: string[];
};

type Kontak = {
  alamat: string;
  telepon: string;
  email: string;
};

type ProfileData = {
  deskripsi: string;
  tahun: string;
  lokasi: string;
  fungsi: Fungsi[];
  tanggungjawab: TanggungJawab[];
  kontak: Kontak;
};

const Profile: React.FC = () => {
  // 3. Buat state untuk data, loading, dan error
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 4. Gunakan useEffect untuk mengambil data dari backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<ProfileData>('/profil-divisi');
        setProfileData(response.data);
      } catch (err) {
        setError('Gagal memuat data profil. Pastikan data sudah disimpan di halaman admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Array kosong berarti hanya dijalankan sekali

  // 5. Tampilkan pesan loading atau error
  if (loading) {
    return <div className="text-center p-8">Memuat data profil...</div>;
  }

  if (error || !profileData) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  // 6. Render komponen dengan data dinamis
  return (
    <div className="space-y-6 mt-15">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Profil Divisi Sistem Informasi</h1>
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
              <h4 className="font-semibold text-gray-900 mb-2">Deskripsi Umum</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                  {profileData.deskripsi}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tahun Pembentukan</h4>
              <p className="text-gray-600 text-sm">{profileData.tahun}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Lokasi Kantor Pusat</h4>
              <p className="text-gray-600 text-sm">
                  {profileData.lokasi}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Functions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Fungsi Utama</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData.fungsi.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {/* Anda bisa membuat pemetaan icon jika diperlukan, atau gunakan icon default */}
                    <Network className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{item.title}</h5>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle>Tanggung Jawab dan Lingkup Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.tanggungjawab.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-3">{section.title}</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
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
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {profileData.kontak.alamat}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Telepon</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {profileData.kontak.telepon}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {profileData.kontak.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
