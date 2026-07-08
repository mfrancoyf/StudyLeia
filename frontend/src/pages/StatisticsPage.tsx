import { useQuery } from "@tanstack/react-query";
import { BarChart3, Flame, Target, Clock } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/shared/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { statisticsService } from "@/services/statistics";

export default function StatisticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: statisticsService.obter,
  });

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <BarChart3 className="h-6 w-6 text-brand-600" /> Estatísticas
        </h1>
        <p className="text-slate-500">Seu progresso de estudos ao longo do tempo.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<Clock className="h-5 w-5" />} label="Horas estudadas" value={stats.totalHorasEstudadas} accent="brand" />
        <StatCard icon={<Flame className="h-5 w-5" />} label="Maior sequência" value={`${stats.maiorSequencia} dias`} accent="accent" />
        <StatCard icon={<Target className="h-5 w-5" />} label="Taxa de acerto" value={`${stats.taxaAcertoGeral.toFixed(0)}%`} accent="success" />
        <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Dias ativos" value={stats.diasAtivos} accent="xp" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>XP por semana</CardTitle>
          </CardHeader>
          <CardContent className="h-64 p-0 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.xpPorSemana}>
                <XAxis dataKey="rotulo" tick={{ fontSize: 12 }} stroke="var(--color-brand-300)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-brand-300)" />
                <Tooltip />
                <Bar dataKey="valor" fill="var(--color-brand-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade semanal</CardTitle>
          </CardHeader>
          <CardContent className="h-64 p-0 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.atividadeSemanal}>
                <XAxis dataKey="rotulo" tick={{ fontSize: 12 }} stroke="var(--color-brand-300)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-brand-300)" />
                <Tooltip />
                <Bar dataKey="valor" fill="var(--color-accent-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Matérias mais estudadas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {stats.materiasMaisEstudadas.map((m) => (
              <div key={m.tema} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{m.tema}</span>
                <span className="text-slate-500">{m.taxaAcerto.toFixed(0)}% de acerto</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vale a pena revisar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {stats.materiasMenosEstudadas.map((m) => (
              <div key={m.tema} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{m.tema}</span>
                <span className="text-slate-500">{m.taxaAcerto.toFixed(0)}% de acerto</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
