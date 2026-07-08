import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studyPlanService } from "@/services/studyplan";
import type { GerarPlanoEstudosRequest } from "@/types/studyplan";

export function useStudyPlans() {
  return useQuery({ queryKey: ["study-plans"], queryFn: studyPlanService.listar });
}

export function useStudyPlan(id: string | undefined) {
  return useQuery({
    queryKey: ["study-plans", id],
    queryFn: () => studyPlanService.obter(id as string),
    enabled: !!id,
  });
}

export function useGerarPlanoIA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GerarPlanoEstudosRequest) => studyPlanService.gerarComIA(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-plans"] }),
  });
}

export function useConcluirItemPlano(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => studyPlanService.concluirItem(planId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-plans", planId] });
      queryClient.invalidateQueries({ queryKey: ["study-plans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRemoverPlano() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studyPlanService.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-plans"] }),
  });
}
