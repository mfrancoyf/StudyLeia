import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeiaMascot } from "@/features/leia/components/LeiaMascot";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useEquippedAccessories } from "@/features/leia/hooks/useEquippedAccessories";
import { Link } from "react-router-dom";

/**
 * Widget flutuante persistente — a Leia acompanha a navegação inteira,
 * não só a página /leia. Sempre visível no canto inferior direito,
 * reage em tempo real a qualquer `react(...)` disparado por outra
 * parte do app (quiz, loja, missões, gamificação...).
 */
export function LeiaWidget() {
  const { mood, reaction, message } = useLeiaReaction();
  const { accessories } = useEquippedAccessories();
  const [aberto, setAberto] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {(message || aberto) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="max-w-[220px] rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-sm text-slate-700 shadow-lg shadow-brand-900/10"
          >
            {message ?? (
              <>
                Oi! Sou a Leia 🐾{" "}
                <Link to="/leia" className="font-semibold text-brand-600 underline">
                  vem me ver
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setAberto((v) => !v)}
        whileTap={{ scale: 0.92 }}
        className="rounded-full bg-white p-1 shadow-lg shadow-brand-900/10 ring-2 ring-brand-100 hover:ring-brand-300"
        aria-label="Abrir a Leia"
      >
        <LeiaMascot mood={mood} reaction={reaction} size="sm" accessories={accessories} />
      </motion.button>
    </div>
  );
}
