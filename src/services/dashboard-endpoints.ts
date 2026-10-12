import api from "./axios-config";

export interface AdminDashboard {
  profiles_count: number;
  sessions_count: number;
  bins_count: number;
  items_count: number;
  accepted_scans_count: number;
  top_categories: { id: number; name: string; scan_count: number }[];
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const response = await api.get<AdminDashboard>("/api/admin/dashboard");
  return response.data;
}
