import { api } from "./api";
import type {
  StudyPlanResumoResponse,
  StudyPlanResponse,
  GerarPlanoEstudosRequest,
} from "@/types/studyplan";

export const studyPlanService = {
  listar: () => api.get<StudyPlanResumoResponse[]>("/api/study-plans").then((r) => r.data),
  obter: (id: string) => api.get<StudyPlanResponse>(`/api/study-plans/${id}`).then((r) => r.data),
  gerarComIA: (data: GerarPlanoEstudosRequest) =>
    api.post<StudyPlanResponse>("/api/study-plans/gerar-com-ia", data).then((r) => r.data),
  concluirItem: (planId: string, itemId: string) =>
    api
      .patch<StudyPlanResponse>(`/api/study-plans/${planId}/itens/${itemId}/concluir`)
      .then((r) => r.data),
  remover: (id: string) => api.delete(`/api/study-plans/${id}`),
};
