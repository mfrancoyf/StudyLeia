import { api } from "./api";
import type { StatisticsResponse } from "@/types/statistics";

export const statisticsService = {
  obter: () => api.get<StatisticsResponse>("/api/statistics").then((r) => r.data),
};
