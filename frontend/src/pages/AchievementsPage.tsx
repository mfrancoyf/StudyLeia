import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { AchievementCard } from "@/components/shared/AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";
import { gamificationService } from "@/services/gamification";

export default function AchievementsPage() {
  const { data: conquistas, isLoading } = useQuery({
    queryKey: ["gamification", "achievements", "catalogo"],
    queryFn: gamificationService.catalogoAchievements,
  });

  const desbloqueadas = conquistas?.filter((c) => c.desbloqueadaEm).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Trophy className="h-6 w-6 text-xp-500" /> Conquistas
        </h1>
        <p className="text-slate-500">
          {desbloqueadas} de {conquistas?.length ?? 0} desbloqueadas
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {conquistas?.map((c) => (
          <AchievementCard key={c.tipo} {...c} />
        ))}
      </div>
    </div>
  );
}
