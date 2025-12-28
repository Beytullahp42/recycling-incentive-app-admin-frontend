import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { getCsrfCookie } from "@/services/auth-endpoints";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/layouts/DashboardLayout";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import RecyclableItems from "@/pages/RecyclableItems";
import CreateRecyclableItem from "@/pages/CreateRecyclableItem";
import RecyclableItemCategories from "@/pages/RecyclableItemCategories";

import RecyclingBins from "@/pages/RecyclingBins";
import RecyclingSessions from "@/pages/RecyclingSessions";
import RecyclingSessionDetail from "@/pages/RecyclingSessionDetail";
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
                <Route path="/recyclable-items" element={<RecyclableItems />} />
                <Route
                  path="/recyclable-items/create"
                  element={<CreateRecyclableItem />}
                />

                <Route
                  path="/recyclable-item-categories"
                  element={<RecyclableItemCategories />}
                />

                <Route path="/recycling-bins" element={<RecyclingBins />} />
                <Route
                  path="/recycling-sessions"
                  element={<RecyclingSessions />}
                />
                <Route
                  path="/recycling-sessions/:id"
                  element={<RecyclingSessionDetail />}
                />
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
