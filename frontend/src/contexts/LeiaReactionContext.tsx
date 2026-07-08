import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import type { HumorPet } from "@/types/pet";
import type { LeiaReaction } from "@/features/leia/components/LeiaMascot";

interface LeiaReactionContextValue {
  mood: HumorPet;
  reaction: LeiaReaction;
  message: string | null;
  setMood: (mood: HumorPet) => void;
  react: (reaction: LeiaReaction, message?: string) => void;
}

const LeiaReactionContext = createContext<LeiaReactionContextValue | undefined>(undefined);

const DURACAO_REACAO_MS = 1600;

/**
 * Ponto único de "emoção" da Leia. Qualquer feature (quiz, loja,
 * missões, gamificação) chama `useLeiaReaction().react(...)` quando
 * algo acontece — sem precisar saber onde a Leia está renderizada na
 * tela. É isso que faz ela ser o centro da experiência, e não mais
 * um componente isolado dentro da página /leia.
 *
 * Exemplos de uso (a partir da Fase 5/6, quando as telas reais forem
 * implementadas):
 *   react("comemorando", "Subiu pro nível 5! 🎉")   // ao subir de nível
 *   react("presenteando", "Novo chapéu equipado!")   // ao comprar/equipar na loja
 *   react("evoluindo", "A Leia evoluiu!")            // ao trocar de estágio
 *   setMood(petStatus.humor)                          // ao carregar /api/pet/status
 */
export function LeiaReactionProvider({ children }: { children: ReactNode }) {
  const [mood, setMoodState] = useState<HumorPet>("NEUTRA");
  const [reaction, setReaction] = useState<LeiaReaction>("nenhuma");
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setMood(novoMood: HumorPet) {
    setMoodState(novoMood);
  }

  function react(novaReacao: LeiaReaction, novaMensagem?: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setReaction(novaReacao);
    setMessage(novaMensagem ?? null);
    timeoutRef.current = setTimeout(() => {
      setReaction("nenhuma");
      setMessage(null);
    }, DURACAO_REACAO_MS);
  }

  return (
    <LeiaReactionContext.Provider value={{ mood, reaction, message, setMood, react }}>
      {children}
    </LeiaReactionContext.Provider>
  );
}

export function useLeiaReaction() {
  const ctx = useContext(LeiaReactionContext);
  if (!ctx) throw new Error("useLeiaReaction precisa estar dentro de <LeiaReactionProvider>");
  return ctx;
}
