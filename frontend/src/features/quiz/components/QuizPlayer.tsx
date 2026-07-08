import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useToast } from "@/hooks/use-toast";
import { useResponderQuestao, useConcluirQuiz } from "@/features/quiz/hooks/useQuizzes";
import type { QuizResponse } from "@/types/quiz";

interface QuizPlayerProps {
  quiz: QuizResponse;
}

/**
 * Responde o quiz questão a questão. A cada resposta, a Leia reage
 * de verdade (feliz + comemorando se acertou, triste + mensagem de
 * incentivo se errou) — este é o primeiro fluxo do produto em que
 * isso acontece a partir de uma ação real da usuária, não simulada.
 */
export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const navigate = useNavigate();
  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ correta: boolean; alternativaCorretaId: string; mensagem: string } | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState<{ xpGanho: number; moedasGanhas: number; subiuDeNivel: boolean } | null>(null);

  const { react, setMood } = useLeiaReaction();
  const { toast } = useToast();
  const responder = useResponderQuestao(quiz.id);
  const concluir = useConcluirQuiz();

  const questaoAtual = quiz.questoes[indice];
  const ultimaQuestao = indice === quiz.questoes.length - 1;

  async function escolher(alternativaId: string) {
    if (resultado) return;
    setSelecionada(alternativaId);
    const resposta = await responder.mutateAsync({ questaoId: questaoAtual.id, data: { alternativaId } });

    if (resposta.correta) {
      setAcertos((v) => v + 1);
      setMood("FELIZ");
      react("comemorando", `Certa! +${resposta.recompensa.xpGanho} XP`);
    } else {
      setMood("TRISTE");
      react("nenhuma");
    }

    setResultado({
      correta: resposta.correta,
      alternativaCorretaId: resposta.alternativaCorretaId,
      mensagem: resposta.mensagemIncentivo,
    });
  }

  async function proxima() {
    if (!ultimaQuestao) {
      setIndice((v) => v + 1);
      setSelecionada(null);
      setResultado(null);
      return;
    }

    const recompensa = await concluir.mutateAsync(quiz.id);
    if (recompensa.subiuDeNivel) {
      react("comemorando", `Subiu para o nível ${recompensa.nivelAtual}! 🎉`);
      toast({ title: "Level up! 🐾", description: `Você chegou ao nível ${recompensa.nivelAtual}`, variant: "celebration" });
    }
    if (recompensa.leiaEvoluiu) {
      react("evoluindo", "A Leia evoluiu!");
    }
    setFinalizado({
      xpGanho: recompensa.xpGanho,
      moedasGanhas: recompensa.moedasGanhas,
      subiuDeNivel: recompensa.subiuDeNivel,
    });
  }

  if (finalizado) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <Trophy className="h-10 w-10 text-xp-500" />
        <h2 className="text-xl font-bold text-slate-800">Quiz concluído!</h2>
        <p className="text-slate-500">
          Você acertou {acertos} de {quiz.questoes.length} questões.
        </p>
        <div className="flex gap-2">
          <span className="rounded-pill bg-xp-500/15 px-3 py-1 text-sm font-semibold text-amber-600">
            +{finalizado.xpGanho} XP
          </span>
          <span className="rounded-pill bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            +{finalizado.moedasGanhas} moedas
          </span>
        </div>
        <Button className="mt-2" onClick={() => navigate("/quizzes")}>
          Voltar para os quizzes
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
          <span>Questão {indice + 1} de {quiz.questoes.length}</span>
          <span>{acertos} acertos</span>
        </div>
        <Progress value={((indice + (resultado ? 1 : 0)) / quiz.questoes.length) * 100} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questaoAtual.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
        >
          <Card>
            <CardContent className="flex flex-col gap-3 p-6">
              <p className="text-lg font-semibold text-slate-800">{questaoAtual.pergunta}</p>

              <div className="flex flex-col gap-2">
                {questaoAtual.alternativas.map((alt) => {
                  const éSelecionada = selecionada === alt.id;
                  const éCorreta = resultado?.alternativaCorretaId === alt.id;
                  return (
                    <button
                      key={alt.id}
                      type="button"
                      disabled={!!resultado}
                      onClick={() => escolher(alt.id)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        resultado
                          ? éCorreta
                            ? "border-success-500 bg-success-500/10 text-success-600"
                            : éSelecionada
                              ? "border-danger-500 bg-danger-500/10 text-danger-500"
                              : "border-slate-200 text-slate-400"
                          : "border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                      }`}
                    >
                      {alt.texto}
                      {resultado && éCorreta && <CheckCircle2 className="h-4 w-4" />}
                      {resultado && éSelecionada && !éCorreta && <XCircle className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>

              {resultado && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-3 text-sm ${resultado.correta ? "bg-success-500/10 text-success-600" : "bg-brand-50 text-brand-700"}`}
                >
                  {resultado.mensagem}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {resultado && (
        <Button onClick={proxima} disabled={concluir.isPending} className="self-end">
          {ultimaQuestao ? (concluir.isPending ? "Calculando recompensa..." : "Concluir quiz") : "Próxima questão"}
        </Button>
      )}
    </div>
  );
}
