import api from "./axios-config";
import { RecyclingBin } from "@/models/RecyclingBin";
import type { RecyclingBinDTO } from "@/dtos/RecyclingBinDTO";

export async function getAllRecyclingBins(): Promise<RecyclingBin[]> {
  const response = await api.get("/api/recycling-bins");
  return response.data.map((bin: RecyclingBin) => new RecyclingBin(bin));
}

export async function getRecyclingBin(
  id: number | string
): Promise<RecyclingBin> {
  const response = await api.get(`/api/recycling-bins/${id}`);
  return new RecyclingBin(response.data);
}

export async function createRecyclingBin(
  data: RecyclingBinDTO
): Promise<RecyclingBin> {
  const response = await api.post("/api/recycling-bins", data);
  return new RecyclingBin(response.data);
}

export async function updateRecyclingBin(
  id: number | string,
  data: Partial<RecyclingBinDTO>
): Promise<RecyclingBin> {
  const response = await api.put(`/api/recycling-bins/${id}`, data);
  return new RecyclingBin(response.data);
}

export async function deleteRecyclingBin(id: number | string): Promise<void> {
  await api.delete(`/api/recycling-bins/${id}`);
}
