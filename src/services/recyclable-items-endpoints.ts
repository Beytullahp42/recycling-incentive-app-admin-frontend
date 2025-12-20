import api from "./axios-config";
import { RecyclableItem } from "@/models/RecyclableItem";
import type { RecyclableItemDTO } from "@/dtos/RecyclableItemDTO";

export async function getAllRecyclableItems(): Promise<RecyclableItem[]> {
  const response = await api.get("/api/recyclable-items");
  return response.data.map((item: RecyclableItem) => new RecyclableItem(item));
}

export async function getRecyclableItem(
  id: number | string
): Promise<RecyclableItem> {
  const response = await api.get(`/api/recyclable-items/${id}`);
  return new RecyclableItem(response.data);
}

export async function createRecyclableItem(
  data: RecyclableItemDTO
): Promise<RecyclableItem> {
  const response = await api.post("/api/recyclable-items", data);
  return new RecyclableItem(response.data);
}

export async function updateRecyclableItem(
  id: number | string,
  data: Partial<RecyclableItemDTO>
): Promise<RecyclableItem> {
  const response = await api.put(`/api/recyclable-items/${id}`, data);
  return new RecyclableItem(response.data);
}

export async function deleteRecyclableItem(id: number | string): Promise<void> {
  await api.delete(`/api/recyclable-items/${id}`);
}
