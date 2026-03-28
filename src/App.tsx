import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BrandingProvider } from "@/hooks/use-branding";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Units from "./pages/Units";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import ComingSoon from "./pages/ComingSoon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrandingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/units" element={<ProtectedRoute><Units /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/cashflow" element={<ProtectedRoute><ComingSoon title="Arus Kas" description="Modul arus kas sedang dipersiapkan untuk kebutuhan komersial (DP, pelunasan, dan laporan kas harian)." /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><ComingSoon title="Inventori" description="Modul inventori siap diaktivasi dengan sinkron stok spare part dan costing servis." /></ProtectedRoute>} />
            <Route path="/technicians" element={<ProtectedRoute><ComingSoon title="Teknisi" description="Manajemen teknisi akan mencakup workload, SLA, dan performa per teknisi." /></ProtectedRoute>} />
            <Route path="/aging" element={<ProtectedRoute><ComingSoon title="Laporan Aging" description="Laporan aging akan membantu prioritasi unit yang melewati target penyelesaian." /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><ComingSoon title="Analitik" description="Analitik enterprise akan menampilkan trend servis, conversion, dan profitability." /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BrandingProvider>
  </QueryClientProvider>
);

export default App;
