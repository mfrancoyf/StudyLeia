import { motion } from "framer-motion";
import { Sprout, Flower2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PlantaResponse } from "@/types/garden";

interface GardenCardProps extends PlantaResponse {
  onColher?: (id: string) => void;
}

export function GardenCard({ nomeExibicao, estagio, progressoPercentual, colhida, id, onColher }: GardenCardProps) {
  const pronta = estagio === "FLORESCIDA" && !colhida;
  return (
    <Card
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 p-4 text-center transition-transform hover:-translate-y-0.5",
        pronta && "border-success-500/40 bg-success-500/5",
        colhida && "opacity-60"
      )}
      onClick={() => pronta && onColher?.(id)}
    >
      <motion.div animate={pronta ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.6 }}>
        {estagio === "FLORESCIDA" ? (
          <Flower2 className="h-8 w-8 text-success-500" />
        ) : (
          <Sprout className="h-8 w-8 text-brand-400" />
        )}
      </motion.div>
      <p className="text-sm font-medium text-slate-700">{nomeExibicao}</p>
      <Progress value={progressoPercentual} className="h-1.5" />
      {pronta && <span className="text-xs font-semibold text-success-600">Toque para colher!</span>}
      {colhida && <span className="text-xs text-slate-400">Colhida</span>}
    </Card>
  );
}
