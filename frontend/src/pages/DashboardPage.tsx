import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, Coins, Star, Sparkles, CalendarClock, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { PetCard } from "@/components/shared/PetCard";
import { MissionCard } from "@/components/shared/MissionCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useDashboard, useDailyMissions } from "@/features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError, refetch } = useDashboard();
  const { data: missoes, isLoading: carregandoMissoes } = useDailyMissions();
  const { setMood } = useLeiaReaction();

  // A Leia do widget flutuante (visível em todas as telas) sempre
  // reflete o humor real vindo do backend assim que o dashboard carrega.
  useEffect(() => {
    if (dashboard?.pet.humor) setMood(dashboard.pet.humor);
  }, [dashboard?.pet.humor, setMood]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="text-slate-600">Não consegui carregar seu dashboard agora.</p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" /> Tentar de novo
        </Button>
      </Card>
    );
  }

  const { pet, progresso, proximosEventos, saudacao, nomeUsuario } = dashboard;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{saudacao}, {nomeUsuario}! 👋</h1>
        <p className="text-slate-500">Vamos estudar um pouco hoje?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<Star className="h-5 w-5" />} label="XP total" value={progresso.xpTotal.toLocaleString("pt-BR")} accent="xp" />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Sequência" value={`${progresso.sequenciaAtual} dias`} accent="accent" />
        <StatCard icon={<Coins className="h-5 w-5" />} label="Moedas" value={progresso.moedas} accent="brand" />
        <StatCard icon={<Sparkles className="h-5 w-5" />} label="Nível" value={progresso.nivelAtual} accent="success" />
      </div>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <PetCard nomePet={pet.nomePet} humor={pet.humor} estagioEvolucao={pet.estagioEvolucao} />

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-600">Missões de hoje</p>
          {carregandoMissoes && (
            <>
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </>
          )}
          {missoes?.length === 0 && (
            <Card className="p-4 text-sm text-slate-500">Nenhuma missão por aqui hoje — aproveite pra descansar 🌿</Card>
          )}
          {missoes?.map((missao) => <MissionCard key={missao.id} {...missao} />)}
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <CalendarClock className="h-4 w-4 text-brand-500" /> Próximos eventos
            </p>
            <Link to="/calendar" className="text-xs font-medium text-brand-600 hover:underline">
              Ver calendário
            </Link>
          </div>

          {proximosEventos.length === 0 ? (
            <p className="text-sm text-slate-500">Nada marcado por enquanto. Bom momento para planejar a semana!</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {proximosEventos.map((evento) => (
                <li key={evento.id} className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-2.5 text-sm">
                  <span className="font-medium text-slate-700">{evento.titulo}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(evento.dataHora).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
