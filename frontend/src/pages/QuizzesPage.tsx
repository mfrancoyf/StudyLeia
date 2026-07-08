import { useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { QuizCard } from "@/components/shared/QuizCard";
import { QuizGeradorIADialog } from "@/features/quiz/components/QuizGeradorIADialog";
import { QuizCriarDialog } from "@/features/quiz/components/QuizCriarDialog";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuizzes } from "@/features/quiz/hooks/useQuizzes";

export default function QuizzesPage() {
  const { data: quizzes, isLoading } = useQuizzes();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quizzes</h1>
          <p className="text-slate-500">Responda e ganhe XP — a Leia comemora cada acerto.</p>
        </div>
        <div className="flex gap-2">
          <QuizCriarDialog />
          <QuizGeradorIADialog />
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {!isLoading && quizzes?.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center text-slate-500">
          <BrainCircuit className="h-8 w-8 text-brand-300" />
          Nenhum quiz ainda — crie um manualmente ou gere um com IA.
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes?.map((quiz) => (
          <QuizCard key={quiz.id} {...quiz} onAbrir={(id) => navigate(`/quizzes/${id}`)} />
        ))}
      </div>
    </div>
  );
}
