import api from "./axios-config";
import { RecyclableItemCategory } from "@/models/RecyclableItemCategory";
import type { RecyclableItemCategoryDTO } from "@/dtos/RecyclableItemCategoryDTO";

export async function getAllRecyclableItemCategories(): Promise<
  RecyclableItemCategory[]
> {
  const response = await api.get("/api/recyclable-item-categories");
  return response.data.map(
    (item: RecyclableItemCategory) => new RecyclableItemCategory(item)
  );
}

export async function getRecyclableItemCategory(
  id: number | string
): Promise<RecyclableItemCategory> {
  const response = await api.get(`/api/recyclable-item-categories/${id}`);
  return new RecyclableItemCategory(response.data);
}

export async function createRecyclableItemCategory(
  data: RecyclableItemCategoryDTO
): Promise<RecyclableItemCategory> {
  const response = await api.post("/api/recyclable-item-categories", data);
  return new RecyclableItemCategory(response.data);
}

export async function updateRecyclableItemCategory(
  id: number | string,
  data: Partial<RecyclableItemCategoryDTO>
): Promise<RecyclableItemCategory> {
  const response = await api.put(`/api/recyclable-item-categories/${id}`, data);
  return new RecyclableItemCategory(response.data);
}

export async function deleteRecyclableItemCategory(
  id: number | string
): Promise<void> {
  await api.delete(`/api/recyclable-item-categories/${id}`);
}
