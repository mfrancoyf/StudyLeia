import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { AchievementCard } from "@/components/shared/AchievementCard";
import { Skeleton } from "@/components/ui/skeleton";
import { gamificationService } from "@/services/gamification";

export default function AchievementsPage() {
  const { data: catalogo, isLoading: isLoadingCatalogo } = useQuery({
    queryKey: ["gamification", "achievements", "catalogo"],
    queryFn: gamificationService.catalogoAchievements,
  });

  const { data: desbloqueadasList, isLoading: isLoadingDesbloqueadas } = useQuery({
    queryKey: ["gamification", "achievements"],
    queryFn: gamificationService.achievements,
  });

  const isLoading = isLoadingCatalogo || isLoadingDesbloqueadas;

  // O catálogo traz todos os tipos possíveis, mas sempre com
  // desbloqueadaEm nulo (é estático). Precisamos mesclar com a lista
  // de conquistas realmente desbloqueadas pelo usuário para saber
  // quais já foram concluídas e quando.
  const desbloqueadasPorTipo = new Map(
    (desbloqueadasList ?? []).map((d) => [d.tipo, d.desbloqueadaEm])
  );

  const conquistas = catalogo?.map((c) => ({
    ...c,
    desbloqueadaEm: desbloqueadasPorTipo.get(c.tipo) ?? null,
  }));

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
