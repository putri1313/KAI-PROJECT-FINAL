
import React from 'react';
import { 
  Building, 
  Camera, 
  Ticket, 
  Train, 
  Users, 
  Network,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Stasiun',
      value: '45',
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Titik CCTV',
      value: '324',
      icon: Camera,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Layanan Ticketing',
      value: '128',
      icon: Ticket,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Unit Lokotrack',
      value: '67',
      icon: Train,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6 mt-15">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Selamat Datang di Portal IT Divre IV
            </h1>
            <p className="text-blue-100 text-lg">
              PT Kereta Api Indonesia - Divisi Regional IV Tanjungkarang
            </p>
            <p className="text-blue-200 mt-2">
              Sistem Informasi Pengelolaan IT dan Infrastruktur Teknologi
            </p>
          </div>
          <div className="hidden md:block">
            <Activity size={80} className="text-blue-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8" />
              <span>Ringkasan Operasional</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Infrastruktur Jaringan</h4>
                <p className="text-sm text-gray-600 mb-3">Status konektivitas dan perangkat jaringan</p>
                <div className="flex items-center space-x-2">
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Sistem Ticketing</h4>
                <p className="text-sm text-gray-600 mb-3">Monitoring layanan tiket real-time</p>
                <div className="flex items-center space-x-2">
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">CCTV Monitoring</h4>
                <p className="text-sm text-gray-600 mb-3">Pengawasan keamanan stasiun dan fasilitas</p>
                <div className="flex items-center space-x-2">
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Lokotrack System</h4>
                <p className="text-sm text-gray-600 mb-3">Tracking dan monitoring kereta api</p>
                <div className="flex items-center space-x-2">
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wilayah Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Provinsi Lampung</span>
                <span className="text-sm font-medium">32 Stasiun</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Provinsi Bengkulu</span>
                <span className="text-sm font-medium">8 Stasiun</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sumatra Selatan (Sebagian)</span>
                <span className="text-sm font-medium">5 Stasiun</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
