import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { getCsrfCookie } from "@/services/auth-endpoints";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import RecyclingItems from "@/pages/RecyclingItems";
import RecyclingBins from "@/pages/RecyclingBins";
import { ThemeProvider } from "@/components/theme-provider";
import { BackendStatusProvider } from "@/context/BackendStatusContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  useEffect(() => {
    getCsrfCookie();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BackendStatusProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/recycling-items" element={<RecyclingItems />} />
                <Route path="/recycling-bins" element={<RecyclingBins />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </BackendStatusProvider>
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
