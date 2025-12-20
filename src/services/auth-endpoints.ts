import { User } from "@/models/User";
import api from "./axios-config";

export async function getCsrfCookie(): Promise<void> {
  await api.get("/sanctum/csrf-cookie");
}

export async function login(email: string, password: string): Promise<boolean> {
  const response = await api.post("/api/admin/login", { email, password });

  if (response.status === 200 || response.status === 204) {
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  await api.post("/api/admin/logout");
}

export async function pingAdmin(): Promise<any> {
  const response = await api.get("/api/admin/ping");
  return response.data;
}

export async function pingBackend(): Promise<boolean> {
  try {
    await api.get("/api/ping");
    return true;
  } catch (error) {
    return false;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await api.get("/api/user");
  let user = response.data;
  return user ? new User(user) : null;
}
