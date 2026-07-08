import { api } from "./api";
import type {
  QuizResumoResponse,
  QuizResponse,
  QuizCriarRequest,
  GerarQuizIARequest,
  ResponderQuestaoRequest,
  RespostaQuestaoResultado,
} from "@/types/quiz";
import type { RecompensaResponse } from "@/types/gamification";

export const quizService = {
  listar: () => api.get<QuizResumoResponse[]>("/api/quizzes").then((r) => r.data),
  obter: (id: string) => api.get<QuizResponse>(`/api/quizzes/${id}`).then((r) => r.data),
  criar: (data: QuizCriarRequest) => api.post<QuizResponse>("/api/quizzes", data).then((r) => r.data),
  gerarComIA: (data: GerarQuizIARequest) =>
    api.post<QuizResponse>("/api/quizzes/gerar-com-ia", data).then((r) => r.data),
  responder: (quizId: string, questaoId: string, data: ResponderQuestaoRequest) =>
    api
      .post<RespostaQuestaoResultado>(
        `/api/quizzes/${quizId}/questoes/${questaoId}/responder`,
        data
      )
      .then((r) => r.data),
  concluir: (quizId: string) =>
    api.post<RecompensaResponse>(`/api/quizzes/${quizId}/concluir`).then((r) => r.data),
  remover: (id: string) => api.delete(`/api/quizzes/${id}`),
};
