import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizService } from "@/services/quiz";
import type { GerarQuizIARequest, QuizCriarRequest, ResponderQuestaoRequest } from "@/types/quiz";

export function useQuizzes() {
  return useQuery({ queryKey: ["quizzes"], queryFn: quizService.listar });
}

export function useQuiz(id: string | undefined) {
  return useQuery({
    queryKey: ["quizzes", id],
    queryFn: () => quizService.obter(id as string),
    enabled: !!id,
  });
}

export function useCriarQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QuizCriarRequest) => quizService.criar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
  });
}

export function useGerarQuizIA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GerarQuizIARequest) => quizService.gerarComIA(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
  });
}

export function useResponderQuestao(quizId: string) {
  return useMutation({
    mutationFn: ({ questaoId, data }: { questaoId: string; data: ResponderQuestaoRequest }) =>
      quizService.responder(quizId, questaoId, data),
  });
}

export function useConcluirQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quizId: string) => quizService.concluir(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useRemoverQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quizService.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
  });
}
