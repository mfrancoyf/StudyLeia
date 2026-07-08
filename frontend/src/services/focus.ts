import { api } from "./api";
import type { ConcluirSessaoFocoRequest, SessaoFocoResultado } from "@/types/focus";

export const focusService = {
  concluirSessao: (data: ConcluirSessaoFocoRequest) =>
    api.post<SessaoFocoResultado>("/api/focus/concluir", data).then((r) => r.data),
  minutosHoje: () => api.get<number>("/api/focus/minutos-hoje").then((r) => r.data),
};
