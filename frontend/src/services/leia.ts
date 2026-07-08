import { api } from "./api";
import type { PetStatusResponse } from "@/types/pet";

export const leiaService = {
  status: () => api.get<PetStatusResponse>("/api/pet/status").then((r) => r.data),
  carinho: () => api.post<PetStatusResponse>("/api/pet/carinho").then((r) => r.data),
};
