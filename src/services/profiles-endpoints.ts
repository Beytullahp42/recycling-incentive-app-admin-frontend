import api from "./axios-config";
import { Profile } from "@/models/Profile";
import type { PaginatedResponse } from "@/models/PaginatedResponse";

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
