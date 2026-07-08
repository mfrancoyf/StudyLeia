import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarService } from "@/services/calendar";
import type { EventRequest } from "@/types/calendar";

export function useEvents() {
  return useQuery({ queryKey: ["calendar", "events"], queryFn: calendarService.listarEventos });
}

export function useEventAlerts() {
  return useQuery({ queryKey: ["calendar", "alertas"], queryFn: calendarService.alertas });
}

export function useCriarEvento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventRequest) => calendarService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAtualizarEvento(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventRequest) => calendarService.atualizar(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendar"] }),
  });
}

export function useRemoverEvento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => calendarService.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendar"] }),
  });
}
