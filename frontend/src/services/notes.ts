import { api } from "./api";
import type { NoteRequest, NoteResponse } from "@/types/notes";

export const notesService = {
  listar: () => api.get<NoteResponse[]>("/api/notes").then((r) => r.data),
  obter: (id: string) => api.get<NoteResponse>(`/api/notes/${id}`).then((r) => r.data),
  criar: (data: NoteRequest) => api.post<NoteResponse>("/api/notes", data).then((r) => r.data),
  atualizar: (id: string, data: NoteRequest) =>
    api.put<NoteResponse>(`/api/notes/${id}`, data).then((r) => r.data),
  remover: (id: string) => api.delete(`/api/notes/${id}`),
};
