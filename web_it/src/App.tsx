import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "@/components/LoginPage"; // ✅ Import halaman login admin

const queryClient = new QueryClient();

const AppLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="pt-20 px-6 bg-gray-50 min-h-screen overflow-y-auto ml-0 md:ml-64">
          <Routes>
            <Route path="/*" element={<Index />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppRouter = () => {
  const location = useLocation();

  // Halaman yang tidak perlu layout utama (sidebar + header)
  const isAuthPage = location.pathname === "/admin-login";

  return isAuthPage ? (
    <LoginPage />
  ) : (
    <AppLayout />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
