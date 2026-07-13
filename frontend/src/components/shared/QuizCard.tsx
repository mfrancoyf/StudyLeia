import { BrainCircuit, Sparkles, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRemoverQuiz } from "@/features/quiz/hooks/useQuizzes";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const removerQuiz = useRemoverQuiz();

  async function handleExcluir() {
    const confirmado = window.confirm(`Excluir o quiz "${titulo}"? Essa ação não pode ser desfeita.`);
    if (!confirmado) return;

    try {
      await removerQuiz.mutateAsync(id);
      toast({ title: "Quiz excluído" });
    } catch {
      toast({ title: "Não foi possível excluir o quiz" });
    }
  }

  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            {origem === "IA" && (
              <Badge variant="accent">
                <Sparkles className="h-3 w-3" /> IA
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-danger-500"
              disabled={removerQuiz.isPending}
              onClick={handleExcluir}
              aria-label="Excluir quiz"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
