import { useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LeiaMascot } from "@/features/leia/components/LeiaMascot";
import { leiaService } from "@/services/leia";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useEquippedAccessories } from "@/features/leia/hooks/useEquippedAccessories";
import type { HumorPet, EstagioEvolucao } from "@/types/pet";

const HUMOR_LABEL: Record<HumorPet, string> = {
  SUPER_FELIZ: "Radiante",
  FELIZ: "Feliz",
  NEUTRA: "Tranquila",
  ENTEDIADA: "Entediada",
  TRISTE: "Triste",
};

const HUMOR_DESCRICAO: Record<HumorPet, string> = {
  SUPER_FELIZ: "Ela está no auge da felicidade — vocês formam um baita time!",
  FELIZ: "Ela está radiante — continue estudando pra mantê-la assim!",
  NEUTRA: "Ela está bem, mas adoraria um pouco de atenção hoje.",
  ENTEDIADA: "Faz um tempo que vocês não estudam juntas...",
  TRISTE: "Ela está com saudade — que tal um quiz rapidinho?",
};

const ESTAGIO_LABEL: Record<EstagioEvolucao, string> = {
  FILHOTE: "Filhote",
  JOVEM: "Jovem",
  ADULTA: "Adulta",
  SABIA: "Sábia",
  RAINHA_LEIA: "Rainha Leia",
};

const ESTAGIO_ORDEM: EstagioEvolucao[] = ["FILHOTE", "JOVEM", "ADULTA", "SABIA", "RAINHA_LEIA"];

export default function LeiaPage() {
  const queryClient = useQueryClient();
  const { reaction, mood, setMood, react } = useLeiaReaction();
  const { accessories } = useEquippedAccessories();

  const { data: status, isLoading } = useQuery({
    queryKey: ["pet", "status"],
    queryFn: leiaService.status,
  });

  const carinho = useMutation({
    mutationFn: leiaService.carinho,
    onSuccess: (novoStatus) => {
      queryClient.setQueryData(["pet", "status"], novoStatus);
      setMood(novoStatus.humor);
      react("comemorando", "Ronronando de felicidade 💕");
    },
  });

  useEffect(() => {
    if (status?.humor) setMood(status.humor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.humor]);

  if (isLoading || !status) return <Skeleton className="h-96" />;

  const indiceEstagio = ESTAGIO_ORDEM.indexOf(status.estagioEvolucao);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{status.nomePet}</h1>
        <p className="text-slate-500">{HUMOR_DESCRICAO[status.humor]}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10">
          <LeiaMascot mood={mood} reaction={reaction} size="lg" accessories={accessories} />

          <div className="flex gap-2">
            <Badge variant="default">{HUMOR_LABEL[status.humor]}</Badge>
            <Badge variant="accent">{ESTAGIO_LABEL[status.estagioEvolucao]}</Badge>
          </div>

          <Button onClick={() => carinho.mutate()} disabled={carinho.isPending}>
            <Heart className="h-4 w-4" /> Dar carinho
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Sparkles className="h-4 w-4 text-brand-500" /> Jornada de evolução
          </p>
          <div className="flex items-center gap-2">
            {ESTAGIO_ORDEM.map((estagio, i) => (
              <div key={estagio} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`h-2 w-full rounded-pill ${i <= indiceEstagio ? "bg-brand-500" : "bg-brand-100"}`}
                />
                <span className={`text-xs font-medium ${i <= indiceEstagio ? "text-brand-700" : "text-slate-400"}`}>
                  {ESTAGIO_LABEL[estagio]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Continue estudando e subindo de nível — a Leia evolui automaticamente conforme sua jornada avança.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
