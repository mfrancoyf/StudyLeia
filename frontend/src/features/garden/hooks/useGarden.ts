import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gardenService } from "@/services/garden";
import type { PlantarRequest } from "@/types/garden";

export function useGarden() {
  return useQuery({ queryKey: ["garden"], queryFn: gardenService.obter });
}

export function usePlantar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlantarRequest) => gardenService.plantar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["garden"] }),
  });
}

export function useColher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (plantaId: string) => gardenService.colher(plantaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["garden"] }),
  });
}
