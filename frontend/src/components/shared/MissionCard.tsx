import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { DailyMissionResponse } from "@/types/missions";

export function MissionCard({ titulo, progresso, meta }: DailyMissionResponse) {
  const concluida = progresso >= meta;
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn("flex items-center gap-3 p-4", concluida && "border-success-500/30 bg-success-500/5")}>
        {concluida ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success-500" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-brand-300" />
        )}
        <div className="flex-1">
          <p className={cn("text-sm font-medium text-slate-700", concluida && "text-success-600")}>{titulo}</p>
          <Progress value={(progresso / meta) * 100} className="mt-2 h-2" />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {progresso}/{meta}
        </span>
      </Card>
    </motion.div>
  );
}
