import { api } from "./api";
import type { DailyMissionResponse } from "@/types/missions";

export const missionsService = {
  hoje: () => api.get<DailyMissionResponse[]>("/api/missions/hoje").then((r) => r.data),
};
