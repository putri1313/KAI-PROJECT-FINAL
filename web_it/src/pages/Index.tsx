import React from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import Profile from "../components/Profile";
import VisiMisi from "../components/VisiMisi";
import StrukturOrganisasi from "../components/StrukturOrganisasi";
import InfrastrukturJaringan from "../components/InfrastrukturJaringan";
import DataStasiun from "../components/DataStasiun";
import DataCCTV from "../components/DataCCTV";
import LayananTicketing from "../components/LayananTicketing";
import RekapitulasiTiket from "../components/RekapitulasiTiket";
import AplikasiInternal from "../components/AplikasiInternal";
import DataLokotrack from "../components/DataLokotrack";
import PetaWilayah from "../components/PetaWilayah";
import ProgramRealisasiKinerjaIT from "../components/ProgramRealisasiKinerjaIT";
import EditProfil from "../components/admin/EditProfil";
import EditVisiMisi from "../components/admin/EditVisiMisi";
import EditStruktur from "../components/admin/EditStruktur";
import EditInfrastrukturJaringan from "../components/admin/EditInfrastrukturJaringan";
import EditStasiun from "@/components/admin/EditStasiun";
import EditCCTV from "@/components/admin/EditCCTV";
import EditLayananTicketing from "@/components/admin/EditLayananTicketing";
import EditAplikasiInternal from "@/components/admin/EditAplikasiInternal";
import EditPetaWilayah from "@/components/admin/EditPetaWilayah";
import EditProgramRealisasiKinerjaIT from "@/components/admin/EditProgramRealisasiKinerjaIT"; 

const Index = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {isAdmin ? <SidebarAdmin /> : <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/visi-misi" element={<VisiMisi />} />
              <Route
                path="/struktur-organisasi"
                element={<StrukturOrganisasi />}
              />
              <Route
                path="/infrastruktur-jaringan"
                element={<InfrastrukturJaringan />}
              />
              <Route path="/data-stasiun" element={<DataStasiun />} />
              <Route path="/data-cctv" element={<DataCCTV />} />
              <Route path="/layanan-ticketing" element={<LayananTicketing />} />
              <Route
                path="/rekapitulasi-tiket"
                element={<RekapitulasiTiket />}
              />
              <Route path="/aplikasi-internal" element={<AplikasiInternal />} />
              <Route path="/data-lokotrack" element={<DataLokotrack />} />
              <Route path="/peta-wilayah" element={<PetaWilayah />} />
              <Route path="/program-realisasi-kinerja-it" element={<ProgramRealisasiKinerjaIT />} />

              <Route path="/admin/edit-profil" element={<EditProfil />} />
              <Route path="/admin/edit-visimisi" element={<EditVisiMisi />} />
              <Route path="/admin/edit-struktur" element={<EditStruktur />} />
              <Route
                path="/admin/edit-infrastruktur-jaringan"
                element={<EditInfrastrukturJaringan />}
              />
              <Route path="/admin/edit-stasiun" element={<EditStasiun />} />
              <Route path="/admin/edit-cctv" element={<EditCCTV />} />
              <Route
                path="/admin/edit-layanan-ticketing"
                element={<EditLayananTicketing />}
              />
              <Route
                path="/admin/edit-aplikasi"
                element={<EditAplikasiInternal />}
              />
              <Route path="admin/edit-peta-wilayah" element={<EditPetaWilayah />} />
              <Route 
                path="/admin/edit-program-realisasi-kinerja-it" 
                element={<EditProgramRealisasiKinerjaIT />} /> 
    
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;