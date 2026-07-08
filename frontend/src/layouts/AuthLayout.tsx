import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { LeiaMascot } from "@/features/leia/components/LeiaMascot";

interface AuthLayoutProps {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}

/**
 * Casca visual das telas públicas (login, registro, recuperar senha).
 * Propositalmente diferente do AppLayout: aqui é o primeiro contato
 * com o produto, então a Leia recebe a usuária em vez de só flutuar
 * no canto — reforça que ela é a personagem principal desde o
 * primeiro segundo.
 */
export function AuthLayout({ titulo, subtitulo, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-400/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-card border border-brand-100 bg-white/90 p-8 shadow-xl shadow-brand-900/5 backdrop-blur"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <LeiaMascot mood="FELIZ" size="md" />
          <h1 className="text-xl font-bold text-slate-800">{titulo}</h1>
          <p className="text-sm text-slate-500">{subtitulo}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
