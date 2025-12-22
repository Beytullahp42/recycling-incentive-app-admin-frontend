import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout() {
  const { user, loading, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="md:hidden" />
        <div className="px-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
