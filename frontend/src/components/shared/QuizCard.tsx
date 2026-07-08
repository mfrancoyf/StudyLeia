import { BrainCircuit, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { QuizResumoResponse } from "@/types/quiz";

const DIFICULDADE_VARIANT = {
  FACIL: "success",
  MEDIA: "warning",
  DIFICIL: "danger",
} as const;

interface QuizCardProps extends QuizResumoResponse {
  onAbrir?: (id: string) => void;
}

export function QuizCard({ id, titulo, tema, dificuldade, origem, totalQuestoes, onAbrir }: QuizCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <BrainCircuit className="h-5 w-5" />
          </div>
          {origem === "IA" && (
            <Badge variant="accent">
              <Sparkles className="h-3 w-3" /> IA
            </Badge>
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{titulo}</p>
          <p className="text-sm text-slate-500">{tema}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={DIFICULDADE_VARIANT[dificuldade]}>{dificuldade}</Badge>
          <Badge variant="outline">{totalQuestoes} questões</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full" onClick={() => onAbrir?.(id)}>
          Responder
        </Button>
      </CardFooter>
    </Card>
  );
}
