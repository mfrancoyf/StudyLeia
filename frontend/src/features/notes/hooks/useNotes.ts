import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notesService } from "@/services/notes";
import type { NoteRequest } from "@/types/notes";

export function useNotes() {
  return useQuery({ queryKey: ["notes"], queryFn: notesService.listar });
}

export function useCriarNota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NoteRequest) => notesService.criar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useAtualizarNota(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NoteRequest) => notesService.atualizar(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useRemoverNota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesService.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
