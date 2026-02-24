import api from "./axios-config";
import { Profile } from "@/models/Profile";
import type { PaginatedResponse } from "@/models/PaginatedResponse";
import { AdminProfileResponse } from "@/models/AdminProfileResponse";
import type { AdminUpdateProfileDTO } from "@/dtos/AdminUpdateProfileDTO";

export async function getProfiles(
  page: number = 1
): Promise<PaginatedResponse<Profile>> {
  const response = await api.get("/api/admin/profiles", {
    params: { page },
  });

  return {
    ...response.data,
    data: response.data.data.map((profile: any) => new Profile(profile)),
  };
}

export async function getAdminProfile(
  username: string
): Promise<AdminProfileResponse> {
  const response = await api.get(`/api/admin/profile/${username}`);
  return new AdminProfileResponse(response.data);
}

export async function updateAdminProfile(
  username: string,
  dto: AdminUpdateProfileDTO
): Promise<Profile> {
  const response = await api.put(`/api/admin/profile/${username}`, dto);
  return new Profile(response.data);
}
