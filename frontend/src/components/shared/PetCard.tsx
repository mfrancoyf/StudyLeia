import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeiaMascot } from "@/features/leia/components/LeiaMascot";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useEquippedAccessories } from "@/features/leia/hooks/useEquippedAccessories";
import type { PetStatusResponse } from "@/types/pet";

const HUMOR_LABEL: Record<PetStatusResponse["humor"], string> = {
  SUPER_FELIZ: "Radiante",
  FELIZ: "Feliz",
  NEUTRA: "Tranquila",
  ENTEDIADA: "Entediada",
  TRISTE: "Triste",
};

const ESTAGIO_LABEL: Record<PetStatusResponse["estagioEvolucao"], string> = {
  FILHOTE: "Filhote",
  JOVEM: "Jovem",
  ADULTA: "Adulta",
  SABIA: "Sábia",
  RAINHA_LEIA: "Rainha Leia",
};

/**
 * Card compacto da Leia para o Dashboard — usa o mesmo LeiaMascot
 * (fonte única de verdade visual), então qualquer reação disparada
 * em outra tela também aparece aqui se o usuário estiver no Dashboard.
 */
export function PetCard(status: PetStatusResponse) {
  const { reaction } = useLeiaReaction();
  const { accessories } = useEquippedAccessories();
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center gap-2 p-6">
        <LeiaMascot mood={status.humor} reaction={reaction} size="lg" accessories={accessories} />
        <p className="mt-2 text-lg font-semibold text-slate-800">{status.nomePet}</p>
        <div className="flex gap-2">
          <Badge variant="default">{HUMOR_LABEL[status.humor]}</Badge>
          <Badge variant="accent">{ESTAGIO_LABEL[status.estagioEvolucao]}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
