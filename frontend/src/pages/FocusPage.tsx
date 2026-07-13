import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { LeiaMascot } from "@/features/leia/components/LeiaMascot";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useEquippedAccessories } from "@/features/leia/hooks/useEquippedAccessories";
import { useToast } from "@/hooks/use-toast";
import { useMinutosFocoHoje, useConcluirSessaoFoco } from "@/features/focus/hooks/useFocus";

const DURACAO_FOCO_MIN = 25;
const DURACAO_PAUSA_MIN = 5;

export default function FocusPage() {
  const [tipo, setTipo] = useState<"FOCO" | "PAUSA">("FOCO");
  const [segundosRestantes, setSegundosRestantes] = useState(DURACAO_FOCO_MIN * 60);
  const [rodando, setRodando] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mood, react } = useLeiaReaction();
  const { accessories } = useEquippedAccessories();
  const { toast } = useToast();
  const { data: minutosHoje } = useMinutosFocoHoje();
  const concluirSessao = useConcluirSessaoFoco();

  const duracaoTotal = (tipo === "FOCO" ? DURACAO_FOCO_MIN : DURACAO_PAUSA_MIN) * 60;

  useEffect(() => {
    if (rodando) {
      intervalRef.current = setInterval(() => {
        setSegundosRestantes((s) => {
          if (s <= 1) {
            finalizarSessao();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodando]);

  async function finalizarSessao() {
    setRodando(false);
    const resultado = await concluirSessao.mutateAsync({ tipo, duracaoMinutos: tipo === "FOCO" ? DURACAO_FOCO_MIN : DURACAO_PAUSA_MIN });

    if (tipo === "FOCO") {
      react("comemorando", resultado.concedeuXp ? `+${resultado.recompensa?.xpGanho ?? 0} XP por focar!` : "Sessão concluída!");
      toast({ title: "Foco concluído! 🎯", description: "Hora de uma pausa.", variant: "success" });
      setTipo("PAUSA");
      setSegundosRestantes(DURACAO_PAUSA_MIN * 60);
    } else {
      toast({ title: "Pausa concluída", description: "Bora voltar a focar?" });
      setTipo("FOCO");
      setSegundosRestantes(DURACAO_FOCO_MIN * 60);
    }
  }

  function alternar() {
    if (!rodando) react("estudando");
    setRodando((v) => !v);
  }

  function reiniciar() {
    setRodando(false);
    setSegundosRestantes(duracaoTotal);
  }

  const minutos = Math.floor(segundosRestantes / 60).toString().padStart(2, "0");
  const segundos = (segundosRestantes % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Modo Foco</h1>
        <p className="text-slate-500">Pomodoro de {DURACAO_FOCO_MIN} min com pausas de {DURACAO_PAUSA_MIN} min — a Leia estuda com você.</p>
      </div>

      <StatCard icon={<Clock className="h-5 w-5" />} label="Minutos de foco hoje" value={minutosHoje ?? 0} accent="brand" className="max-w-xs" />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            {tipo === "FOCO" ? "Foco" : "Pausa"}
          </span>
          <LeiaMascot mood={mood} reaction={rodando ? "estudando" : "nenhuma"} size="lg" accessories={accessories} />
          <p className="text-5xl font-bold tabular-nums text-slate-800">
            {minutos}:{segundos}
          </p>
          <div className="flex gap-2">
            <Button size="lg" onClick={alternar}>
              {rodando ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {rodando ? "Pausar" : "Começar"}
            </Button>
            <Button size="lg" variant="outline" onClick={reiniciar}>
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
