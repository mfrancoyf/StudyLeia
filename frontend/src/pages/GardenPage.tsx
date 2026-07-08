import { Sprout, Flower2 } from "lucide-react";
import { GardenCard } from "@/components/shared/GardenCard";
import { PlantarDialog } from "@/features/garden/components/PlantarDialog";
import { StatCard } from "@/components/shared/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarden, useColher } from "@/features/garden/hooks/useGarden";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useToast } from "@/hooks/use-toast";

const TOTAL_VASOS = 12;

export default function GardenPage() {
  const { data: jardim, isLoading } = useGarden();
  const colher = useColher();
  const { react } = useLeiaReaction();
  const { toast } = useToast();

  async function colherPlanta(id: string) {
    await colher.mutateAsync(id);
    react("comemorando", "Mais uma flor no jardim! 🌸");
    toast({ title: "Flor colhida!", variant: "success" });
  }

  if (isLoading || !jardim) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );
  }

  const porPosicao = new Map(jardim.plantas.map((p) => [p.posicaoVaso, p]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Jardim</h1>
        <p className="text-slate-500">Plante, cuide e colha — cada estudo rende novas sementes.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <StatCard icon={<Sprout className="h-5 w-5" />} label="Sementes" value={jardim.sementes} accent="success" />
        <StatCard icon={<Flower2 className="h-5 w-5" />} label="Flores colhidas" value={jardim.totalFloresColhidas} accent="accent" />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {Array.from({ length: TOTAL_VASOS }).map((_, posicao) => {
          const planta = porPosicao.get(posicao);
          return planta ? (
            <GardenCard key={planta.id} {...planta} onColher={colherPlanta} />
          ) : (
            <PlantarDialog key={posicao} posicaoVaso={posicao} sementes={jardim.sementes} />
          );
        })}
      </div>
    </div>
  );
}
