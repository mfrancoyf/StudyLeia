import type { PetStatusResponse } from "./pet";
import type { ProgressoResponse } from "./gamification";
import type { EventResponse } from "./calendar";

export interface DashboardResponse {
  saudacao: string;
  nomeUsuario: string;
  pet: PetStatusResponse;
  progresso: ProgressoResponse;
  proximosEventos: EventResponse[];
}
