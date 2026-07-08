import { api } from "./api";
import type { DashboardResponse } from "@/types/dashboard";

export const dashboardService = {
  obter: () => api.get<DashboardResponse>("/api/dashboard").then((r) => r.data),
};
