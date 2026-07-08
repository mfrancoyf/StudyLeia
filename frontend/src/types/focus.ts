import type { RecompensaResponse } from "./gamification";

export type TipoSessaoFoco = "FOCO" | "PAUSA";

export interface ConcluirSessaoFocoRequest {
  tipo: TipoSessaoFoco;
  duracaoMinutos: number;
}

export interface SessaoFocoResultado {
  concedeuXp: boolean;
  totalMinutosFocoHoje: number;
  recompensa: RecompensaResponse | null;
}
