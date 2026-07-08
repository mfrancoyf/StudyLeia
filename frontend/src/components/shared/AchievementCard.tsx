import { Trophy, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AchievementResponse } from "@/types/gamification";

export function AchievementCard({ titulo, descricao, desbloqueadaEm }: AchievementResponse) {
  const desbloqueada = !!desbloqueadaEm;
  return (
    <Card
      className={cn(
        "flex items-center gap-3 p-4 transition-opacity",
        !desbloqueada && "opacity-50 grayscale"
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          desbloqueada ? "bg-xp-500/15 text-amber-600" : "bg-slate-100 text-slate-400"
        )}
      >
        {desbloqueada ? <Trophy className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{titulo}</p>
        <p className="text-xs text-slate-500">{descricao}</p>
      </div>
    </Card>
  );
}
