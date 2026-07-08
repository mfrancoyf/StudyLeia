import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/features/quiz/hooks/useQuizzes";
import { QuizPlayer } from "@/features/quiz/components/QuizPlayer";

export default function QuizPlayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading, isError } = useQuiz(id);

  if (isLoading) return <Skeleton className="h-96" />;

  if (isError || !quiz) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="text-slate-600">Não encontrei esse quiz.</p>
        <Button size="sm" variant="outline" onClick={() => navigate("/quizzes")}>
          Voltar
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate("/quizzes")}
        className="flex w-fit items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <h1 className="text-xl font-bold text-slate-800">{quiz.titulo}</h1>
      <QuizPlayer quiz={quiz} />
    </div>
  );
}
