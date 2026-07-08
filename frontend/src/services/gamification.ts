import { api } from "./api";
import type { ProgressoResponse, AchievementResponse } from "@/types/gamification";

export const gamificationService = {
  progresso: () => api.get<ProgressoResponse>("/api/gamification/progresso").then((r) => r.data),
  achievements: () => api.get<AchievementResponse[]>("/api/gamification/achievements").then((r) => r.data),
  catalogoAchievements: () =>
    api.get<AchievementResponse[]>("/api/gamification/achievements/catalogo").then((r) => r.data),
};
