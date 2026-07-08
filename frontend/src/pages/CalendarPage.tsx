import { AlertTriangle, GraduationCap, Briefcase, Presentation, Bell, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EventFormDialog } from "@/features/calendar/components/EventFormDialog";
import { useEvents, useEventAlerts, useRemoverEvento } from "@/features/calendar/hooks/useCalendarEvents";
import { cn } from "@/lib/utils";
import type { TipoEvento } from "@/types/calendar";

const ICON_POR_TIPO: Record<TipoEvento, typeof GraduationCap> = {
  PROVA: GraduationCap,
  TRABALHO: Briefcase,
  APRESENTACAO: Presentation,
  LEMBRETE: Bell,
};

const BADGE_POR_TIPO: Record<TipoEvento, "danger" | "warning" | "accent" | "default"> = {
  PROVA: "danger",
  TRABALHO: "warning",
  APRESENTACAO: "accent",
  LEMBRETE: "default",
};

export default function CalendarPage() {
  const { data: eventos, isLoading } = useEvents();
  const { data: alertas } = useEventAlerts();
  const remover = useRemoverEvento();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendário</h1>
          <p className="text-slate-500">Provas, trabalhos, apresentações e lembretes.</p>
        </div>
        <EventFormDialog />
      </div>

      {!!alertas?.length && (
        <Card className="border-warning-500/30 bg-warning-500/5">
          <CardContent className="flex flex-col gap-2 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
              <AlertTriangle className="h-4 w-4" /> Chegando perto:
            </p>
            {alertas.map((evento) => (
              <p key={evento.id} className="text-sm text-amber-700">
                <strong>{evento.titulo}</strong> — em {evento.diasRestantes}{" "}
                {evento.diasRestantes === 1 ? "dia" : "dias"}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      )}

      {!isLoading && eventos?.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center text-slate-500">
          Nenhum evento marcado ainda.
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {eventos
          ?.slice()
          .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
          .map((evento) => {
            const Icon = ICON_POR_TIPO[evento.tipo];
            const próximo = evento.diasRestantes <= 3 && evento.diasRestantes >= 0;
            return (
              <Card key={evento.id} className={cn("group", próximo && "border-warning-500/30")}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-800">{evento.titulo}</p>
                      <Badge variant={BADGE_POR_TIPO[evento.tipo]}>{evento.tipo}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(evento.dataHora).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {evento.descricao && ` · ${evento.descricao}`}
                    </p>
                  </div>
                  <button
                    onClick={() => remover.mutate(evento.id)}
                    className="text-slate-300 opacity-0 transition-opacity hover:text-danger-500 group-hover:opacity-100"
                    aria-label="Remover evento"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
