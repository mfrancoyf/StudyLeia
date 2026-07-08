import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { focusService } from "@/services/focus";
import type { ConcluirSessaoFocoRequest } from "@/types/focus";

export function useMinutosFocoHoje() {
  return useQuery({ queryKey: ["focus", "minutos-hoje"], queryFn: focusService.minutosHoje });
}

export function useConcluirSessaoFoco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConcluirSessaoFocoRequest) => focusService.concluirSessao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
