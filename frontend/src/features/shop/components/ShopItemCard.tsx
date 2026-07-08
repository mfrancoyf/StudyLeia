import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ItemLojaResponse } from "@/types/shop";

const RARIDADE_VARIANT = {
  COMUM: "outline",
  RARA: "default",
  EPICA: "accent",
  LEGENDARIA: "xp",
} as const;

interface ShopItemCardProps extends ItemLojaResponse {
  onComprar: () => void;
  onEquipar: () => void;
  onDesequipar: () => void;
  comprando?: boolean;
}

export function ShopItemCard({
  nome,
  descricao,
  raridade,
  preco,
  icone,
  gradiente,
  possuido,
  equipado,
  onComprar,
  onEquipar,
  onDesequipar,
  comprando,
}: ShopItemCardProps) {
  return (
    <Card className={cn("overflow-hidden", raridade === "LEGENDARIA" && "ring-2 ring-xp-500/40")}>
      <div
        className="flex h-24 items-center justify-center text-4xl"
        style={{ background: gradiente || "var(--color-brand-100)" }}
      >
        {icone}
      </div>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-slate-800">{nome}</p>
          <Badge variant={RARIDADE_VARIANT[raridade]}>{raridade}</Badge>
        </div>
        <p className="text-xs text-slate-500">{descricao}</p>

        {!possuido && (
          <Button size="sm" disabled={comprando} onClick={onComprar} className="mt-1 w-full">
            <span className="inline-flex items-center gap-1 leading-none">
              <span aria-hidden className="text-base leading-none">🪙</span>
              <span className="leading-none">{preco}</span>
            </span>
          </Button>
        )}
        {possuido && !equipado && (
          <Button size="sm" variant="secondary" onClick={onEquipar} className="mt-1 w-full">
            Equipar
          </Button>
        )}
        {possuido && equipado && (
          <Button size="sm" variant="outline" onClick={onDesequipar} className="mt-1 w-full">
            <Check className="h-4 w-4" /> Equipado
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
