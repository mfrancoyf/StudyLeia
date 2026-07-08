import { api } from "./api";
import type { EventRequest, EventResponse } from "@/types/calendar";

export const calendarService = {
  listarEventos: () => api.get<EventResponse[]>("/api/calendar/events").then((r) => r.data),
  alertas: () => api.get<EventResponse[]>("/api/calendar/alertas").then((r) => r.data),
  criar: (data: EventRequest) => api.post<EventResponse>("/api/calendar/events", data).then((r) => r.data),
  atualizar: (id: string, data: EventRequest) =>
    api.put<EventResponse>(`/api/calendar/events/${id}`, data).then((r) => r.data),
  remover: (id: string) => api.delete(`/api/calendar/events/${id}`),
};
