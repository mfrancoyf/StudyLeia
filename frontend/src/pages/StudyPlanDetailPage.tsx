import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, BookOpen, RotateCcw, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useStudyPlan, useConcluirItemPlano } from "@/features/studyplan/hooks/useStudyPlans";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import type { TipoItemCronograma } from "@/types/studyplan";

const ICON_POR_TIPO: Record<TipoItemCronograma, typeof BookOpen> = {
  ESTUDO: BookOpen,
  REVISAO: RotateCcw,
  SIMULADO: FileCheck,
};

export default function StudyPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: plano, isLoading } = useStudyPlan(id);
  const concluirItem = useConcluirItemPlano(id ?? "");
  const { react } = useLeiaReaction();

  if (isLoading || !plano) return <Skeleton className="h-96" />;

  async function marcarConcluido(itemId: string) {
    await concluirItem.mutateAsync(itemId);
    react("comemorando", "Mais um passo do plano concluído!");
  }

  const itensPorData = plano.itens.reduce<Record<string, typeof plano.itens>>((acc, item) => {
    (acc[item.data] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate("/study-plans")}
        className="flex w-fit items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">{plano.materia}</h1>
        <p className="text-slate-500">
          Prova em {new Date(plano.dataProva).toLocaleDateString("pt-BR")} · {plano.resumo}
        </p>
        <Progress value={plano.percentualConcluido} className="mt-3" />
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(itensPorData ?? {}).map(([data, itens]) => (
          <div key={data}>
            <p className="mb-2 text-sm font-semibold text-slate-500">
              {new Date(data).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" })}
            </p>
            <div className="flex flex-col gap-2">
              {itens?.map((item) => {
                const Icon = ICON_POR_TIPO[item.tipo];
                return (
                  <Card key={item.id} className={cn("flex items-center gap-3 p-3", item.concluido && "bg-success-500/5")}>
                    <CardContent className="flex w-full items-center gap-3 p-0">
                      <button onClick={() => !item.concluido && marcarConcluido(item.id)} disabled={item.concluido}>
                        {item.concluido ? (
                          <CheckCircle2 className="h-5 w-5 text-success-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-brand-300" />
                        )}
                      </button>
                      <Icon className="h-4 w-4 text-brand-400" />
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium text-slate-700", item.concluido && "text-success-600 line-through")}>
                          {item.assunto}
                        </p>
                        <p className="text-xs text-slate-500">{item.descricao}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
