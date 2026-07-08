import { ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MissionCard } from "@/components/shared/MissionCard";
import { useDailyMissions } from "@/features/dashboard/hooks/useDashboard";

export default function MissionsPage() {
  const { data: missoes, isLoading } = useDailyMissions();
  const concluidas = missoes?.filter((m) => m.progresso >= m.meta).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <ListChecks className="h-6 w-6 text-brand-600" /> Missões de hoje
        </h1>
        <p className="text-slate-500">
          {concluidas} de {missoes?.length ?? 0} concluídas — cada uma dá XP e moedas extras.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      )}

      {!isLoading && missoes?.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center text-slate-500">
          Nenhuma missão hoje — aproveite pra descansar 🌿
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {missoes?.map((missao) => (
          <MissionCard key={missao.id} {...missao} />
        ))}
      </div>
    </div>
  );
}
