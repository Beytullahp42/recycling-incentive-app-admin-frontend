import api from "./axios-config";
import { RecyclingSession } from "@/models/RecyclingSession";
import type { PaginatedResponse } from "@/models/PaginatedResponse";

export async function getRecyclingSessions(
  page: number = 1
): Promise<PaginatedResponse<RecyclingSession>> {
  const response = await api.get("/api/recycling-sessions", {
    params: { page },
  });

  return {
    ...response.data,
    data: response.data.data.map(
      (session: any) => new RecyclingSession(session)
    ),
  };
}

import type { TransactionStatus } from "@/models/Transaction";

export async function getRecyclingSession(
  id: number | string
): Promise<RecyclingSession> {
  const response = await api.get(`/api/recycling-sessions/${id}`);
  return new RecyclingSession(response.data);
}

export async function updateRecyclingSessionStatus(
  id: number | string,
  status: TransactionStatus
): Promise<void> {
  await api.put(`/api/recycling-sessions/${id}`, { status });
}
