import { useNavigate } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GerarPlanoDialog } from "@/features/studyplan/components/GerarPlanoDialog";
import { useStudyPlans } from "@/features/studyplan/hooks/useStudyPlans";

export default function StudyPlansPage() {
  const { data: planos, isLoading } = useStudyPlans();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Plano de Estudos</h1>
          <p className="text-slate-500">Cronogramas gerados pela IA, com revisões e simulados.</p>
        </div>
        <GerarPlanoDialog />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      )}

      {!isLoading && planos?.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center text-slate-500">
          <CalendarClock className="h-8 w-8 text-brand-300" />
          Nenhum plano ainda — informe a matéria e a data da prova e a IA monta o cronograma.
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {planos?.map((plano) => (
          <Card
            key={plano.id}
            className="cursor-pointer transition-transform hover:-translate-y-0.5"
            onClick={() => navigate(`/study-plans/${plano.id}`)}
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{plano.materia}</p>
                {plano.concluido && <Badge variant="success">Concluído</Badge>}
              </div>
              <p className="text-xs text-slate-500">
                Prova em {new Date(plano.dataProva).toLocaleDateString("pt-BR")} · {plano.totalItens} atividades
              </p>
              <Progress value={plano.percentualConcluido} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
