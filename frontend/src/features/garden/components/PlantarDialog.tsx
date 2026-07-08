import { useState } from "react";
import { Sprout } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePlantar } from "@/features/garden/hooks/useGarden";
import { useToast } from "@/hooks/use-toast";
import type { TipoPlanta } from "@/types/garden";

const PLANTAS: { tipo: TipoPlanta; nome: string; custo: number; emoji: string }[] = [
  { tipo: "FLOR_AZUL", nome: "Flor Azul", custo: 5, emoji: "🌼" },
  { tipo: "GIRASSOL", nome: "Girassol", custo: 8, emoji: "🌻" },
  { tipo: "ROSA", nome: "Rosa", custo: 10, emoji: "🌹" },
  { tipo: "LAVANDA", nome: "Lavanda", custo: 12, emoji: "💜" },
];

interface PlantarDialogProps {
  posicaoVaso: number;
  sementes: number;
}

export function PlantarDialog({ posicaoVaso, sementes }: PlantarDialogProps) {
  const [aberto, setAberto] = useState(false);
  const plantar = usePlantar();
  const { toast } = useToast();

  async function escolher(tipo: TipoPlanta, custo: number) {
    if (sementes < custo) {
      toast({ title: "Sementes insuficientes", description: `Você precisa de ${custo} sementes` });
      return;
    }
    try {
      await plantar.mutateAsync({ tipo, posicaoVaso });
      setAberto(false);
    } catch {
      toast({ title: "Não foi possível plantar" });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <button className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-brand-200 text-brand-300 transition-colors hover:border-brand-400 hover:text-brand-500">
          <Sprout className="h-6 w-6" />
          <span className="text-xs font-medium">Plantar</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>O que plantar? 🌱 ({sementes} sementes)</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {PLANTAS.map((p) => (
            <Button
              key={p.tipo}
              variant="outline"
              className="h-auto flex-col gap-1 py-4"
              disabled={sementes < p.custo}
              onClick={() => escolher(p.tipo, p.custo)}
            >
              <span className="text-2xl">{p.emoji}</span>
              <span>{p.nome}</span>
              <span className="text-xs text-slate-400">{p.custo} sementes</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
