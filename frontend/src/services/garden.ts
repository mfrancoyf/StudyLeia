import { api } from "./api";
import type { GardenResponse, PlantarRequest } from "@/types/garden";

export const gardenService = {
  obter: () => api.get<GardenResponse>("/api/garden").then((r) => r.data),
  plantar: (data: PlantarRequest) => api.post<GardenResponse>("/api/garden/plantar", data).then((r) => r.data),
  colher: (plantaId: string) =>
    api.post<GardenResponse>(`/api/garden/${plantaId}/colher`).then((r) => r.data),
};
