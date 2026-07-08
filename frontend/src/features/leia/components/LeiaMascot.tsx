import { useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HumorPet } from "@/types/pet";
import type { InventoryItemResponse } from "@/types/shop";
import { AccessoryLayer } from "@/features/leia/accessories/AccessoryLayer";
import { BACK_ANCHORS, FRONT_ANCHOR_ORDER } from "@/features/leia/accessories/anchors";

export type LeiaReaction =
  | "nenhuma"
  | "comemorando" // level up / conquista
  | "estudando" // modo foco
  | "presenteando" // compra na loja / equipar item
  | "evoluindo"; // subiu de estágio de evolução

interface LeiaMascotProps {
  mood?: HumorPet;
  reaction?: LeiaReaction;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Itens equipados (ver useEquippedAccessories) — opcional: sem isso, a Leia aparece "pelada". */
  accessories?: InventoryItemResponse[];
  /** Desliga o "cafuné" ao clicar — usar só em previews estáticos (loja, catálogo). Padrão: true. */
  interactive?: boolean;
}

const SIZES = { sm: 72, md: 128, lg: 220 };
const DURACAO_CAFUNE_MS = 900;

/**
 * Rosto por humor — versão CLEAN (v2). A primeira versão empilhava
 * máscara + 2 manchas + sombra sob o olho + marquinhas de brilho +
 * bochecha no mesmo espaço pequeno do rosto e ficava poluída. Esta
 * revisão tira tudo que não é essencial: o rosto só tem olhos, nariz
 * e boca; a identidade "tortie" da Leia de verdade (mancha caramelo +
 * mancha escura) fica só no TOPO da cabeça, longe dos olhos, igual à
 * referência que o Franco mandou.
 *
 * IMPORTANTE: este Record precisa cobrir TODOS os valores de HumorPet
 * que o backend pode enviar (ver com.memora.pet.entity.HumorPet). Uma
 * entrada faltando aqui derruba o componente inteiro em runtime
 * (`face.olhos` de `undefined`) — ver EstagioEvolucao equivalente em
 * LeiaPage.tsx.
 */
const FACE_BY_MOOD: Record<
  HumorPet,
  {
    olhos: "abertos" | "felizes" | "entediados" | "tristes";
    boca: string;
    orelhaTilt: number;
  }
> = {
  SUPER_FELIZ: { olhos: "felizes", boca: "M -8 6 Q 0 13 8 6", orelhaTilt: 10 },
  FELIZ: { olhos: "felizes", boca: "M -7 7 Q 0 11 7 7", orelhaTilt: 8 },
  NEUTRA: { olhos: "abertos", boca: "M -7 7 Q 0 10 7 7", orelhaTilt: 0 },
  ENTEDIADA: { olhos: "entediados", boca: "M -7 8 L 7 8", orelhaTilt: -6 },
  TRISTE: { olhos: "tristes", boca: "M -8 10 Q 0 5 8 10", orelhaTilt: -14 },
};

export function LeiaMascot({
  mood = "NEUTRA",
  reaction = "nenhuma",
  size = "md",
  className,
  accessories = [],
  interactive = true,
}: LeiaMascotProps) {
  const px = SIZES[size];
  const clipId = useId();

  // Fallback defensivo: se algum humor não mapeado chegar da API no futuro,
  // cai em NEUTRA em vez de derrubar o componente inteiro.
  const face = FACE_BY_MOOD[mood] ?? FACE_BY_MOOD.NEUTRA;

  // Cafuné: clicar na Leia solta coraçõezinhos e ela faz uma reaçãozinha de
  // alegria — independente de qualquer reação vinda do resto do app
  // (level up, loja, etc). É um "carinho" local, tátil, só de estar aqui.
  const [cafune, setCafune] = useState(false);
  const cafuneTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCafune() {
    if (!interactive) return;
    setCafune(true);
    if (cafuneTimeout.current) clearTimeout(cafuneTimeout.current);
    cafuneTimeout.current = setTimeout(() => setCafune(false), DURACAO_CAFUNE_MS);
  }

  // Durante o cafuné, a carinha vira sempre a mais feliz possível,
  // não importa o humor "oficial" que está vindo do backend.
  const faceAtiva = cafune ? FACE_BY_MOOD.SUPER_FELIZ : face;

  const svgAnimate = cafune
    ? { scale: [1, 0.86, 1.14, 0.97, 1.03, 1], rotate: [0, -7, 8, -4, 2, 0], y: [0, 2, -8, 0, -2, 0] }
    : reaction === "comemorando"
      ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] }
      : { y: [0, -3, 0] };

  const svgTransition = cafune
    ? { duration: 0.8, ease: "easeInOut" as const }
    : reaction === "comemorando"
      ? { duration: 0.6, repeat: 2 }
      : { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div
      className={cn("relative select-none", interactive && "cursor-pointer", className)}
      style={{ width: px, height: px }}
      onClick={handleCafune}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? "Fazer carinho na Leia" : undefined}
    >
      <AnimatePresence>
        {cafune && <AffectionBurst key="cafune" />}
        {!cafune && reaction === "comemorando" && <AffectionBurst key="comemorando" />}
        {!cafune && reaction === "evoluindo" && <EvolutionFlash key="evoluindo" />}
        {!cafune && reaction === "presenteando" && <GiftPop key="presenteando" />}
        {!cafune && reaction === "estudando" && <StudyBubble key="estudando" />}
      </AnimatePresence>

      <motion.svg
        viewBox="-50 -55 100 112"
        width={px}
        height={px}
        animate={svgAnimate}
        transition={svgTransition}
        whileTap={interactive ? { scale: 0.94 } : undefined}
      >
        <defs>
          <clipPath id={`${clipId}-head`}>
            <circle cx="0" cy="-14" r="27.5" />
          </clipPath>
        </defs>

        {/* Cauda — enrolada e fofa, balança sempre no "idle" dela */}
        <motion.path
          d="M 20 36 Q 40 34 41 16 Q 42 2 32 -4 Q 26 -7 24 -2"
          stroke="var(--color-leia-fur)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M 20 36 Q 40 34 41 16 Q 42 2 32 -4 Q 26 -7 24 -2",
              "M 20 36 Q 43 40 42 22 Q 40 6 28 2 Q 24 1 24 4",
              "M 20 36 Q 40 34 41 16 Q 42 2 32 -4 Q 26 -7 24 -2",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Acessórios de "costas" (ex.: asas) — desenhados ANTES do corpo, ficam atrás */}
        <AccessoryLayer accessories={accessories} anchors={BACK_ANCHORS} />

        {/* Corpo — bem arredondado e "gordinho", estilo chibi */}
        <path
          d="M -29 40 Q -34 12 -21 -3 Q -11 -15 0 -15 Q 11 -15 21 -3 Q 34 12 29 40 Q 0 51 -29 40 Z"
          fill="var(--color-leia-fur)"
        />
        {/* Barriguinha mais clara */}
        <ellipse cx="0" cy="30" rx="17" ry="12" fill="var(--color-leia-fur-shade)" opacity="0.5" />
        {/* Patinhas fofas */}
        <ellipse cx="-15" cy="44" rx="9" ry="6" fill="var(--color-leia-fur)" />
        <ellipse cx="15" cy="44" rx="9" ry="6" fill="var(--color-leia-fur)" />

        {/* Cabeça — grande e redonda, proporção de filhote (chibi) */}
        <circle cx="0" cy="-14" r="27.5" fill="var(--color-leia-fur)" />

        {/* Orelhas — simples, uma cor só (sem orelha interna separada,
            que só adicionava mais uma camada visual no rosto) */}
        <motion.g animate={{ rotate: faceAtiva.orelhaTilt }} style={{ originX: "-20px", originY: "-32px" }}>
          <path d="M -24 -26 Q -32 -35 -29 -47 Q -16 -41 -8 -32 Z" fill="var(--color-leia-fur)" />
          {/* Pontinha escura só nesta orelha — único traço de "point" que sobra nela */}
          <path d="M -29 -47 Q -25 -44 -22 -39 Q -27 -40 -30 -45 Z" fill="var(--color-leia-patch-dark)" opacity="0.9" />
        </motion.g>
        <motion.g animate={{ rotate: -faceAtiva.orelhaTilt }} style={{ originX: "20px", originY: "-32px" }}>
          <path d="M 24 -26 Q 32 -35 29 -47 Q 16 -41 8 -32 Z" fill="var(--color-leia-fur)" />
        </motion.g>

        {/* Duas manchinhas "tortie" — só no topo da cabeça, longe dos
            olhos/nariz/boca, pra identidade dela não competir com o rosto. */}
        <g clipPath={`url(#${clipId}-head)`}>
          <ellipse cx="-8" cy="-37" rx="6.5" ry="5" fill="var(--color-leia-patch-dark)" opacity="0.85" transform="rotate(-8 -8 -37)" />
          <ellipse cx="10" cy="-35" rx="8" ry="6" fill="var(--color-leia-patch)" opacity="0.85" transform="rotate(15 10 -35)" />
        </g>

        {/* Bochechas — bem sutis, só pra dar um toque de fofura sem virar elemento de destaque */}
        <circle cx="-19" cy="-6" r="4.2" fill="var(--color-leia-blush)" opacity="0.35" />
        <circle cx="19" cy="-6" r="4.2" fill="var(--color-leia-blush)" opacity="0.3" />

        {/* Olhos — grandes e simples, mudam de verdade por humor */}
        <g transform="translate(0 -15)">
          {faceAtiva.olhos === "abertos" && (
            <>
              <EyeAberto cx={-12} />
              <EyeAberto cx={12} />
            </>
          )}
          {faceAtiva.olhos === "felizes" && (
            <>
              <path d="M -19 0 Q -12 -9 -5 0" stroke="var(--color-leia-point)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 5 0 Q 12 -9 19 0" stroke="var(--color-leia-point)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            </>
          )}
          {faceAtiva.olhos === "entediados" && (
            <>
              <path d="M -19 0 L -5 -1" stroke="var(--color-leia-point)" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 5 -1 L 19 0" stroke="var(--color-leia-point)" strokeWidth="3.2" strokeLinecap="round" />
            </>
          )}
          {faceAtiva.olhos === "tristes" && (
            <>
              <path d="M -19 -3 Q -12 4 -5 -2" stroke="var(--color-leia-point)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 5 -2 Q 12 4 19 -3" stroke="var(--color-leia-point)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>

        {/* Focinho — coraçãozinho rosado */}
        <path d="M -3 -4 Q -3 -6 0 -5.2 Q 3 -6 3 -4 Q 3 -2 0 -0.5 Q -3 -2 -3 -4 Z" fill="var(--color-leia-nose)" />
        {/* Boca */}
        <path
          d={faceAtiva.boca}
          stroke="var(--color-leia-point)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bigodes — branquinhos, contrastam com a pelagem creme */}
        <path d="M -27 -11 L -46 -14 M -27 -6 L -47 -6 M -27 -1 L -46 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
        <path d="M 27 -11 L 46 -14 M 27 -6 L 47 -6 M 27 -1 L 46 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />

        {/* Acessórios equipados (laço, óculos, chapéu, gravata...) — por cima de tudo,
            desenhados dentro do MESMO viewBox, então escalam junto com a Leia em
            qualquer tamanho de tela sem nunca se desalinhar. Ver features/leia/accessories. */}
        <AccessoryLayer accessories={accessories} anchors={FRONT_ANCHOR_ORDER} />
      </motion.svg>

      {/* Coração — aparece quando ela está feliz, igual ao sprite */}
      <AnimatePresence>
        {!cafune && mood === "FELIZ" && reaction === "nenhuma" && (
          <motion.span
            key="coracao-feliz"
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 text-lg"
            initial={{ opacity: 0, y: 4, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            ❤️
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function EyeAberto({ cx }: { cx: number }) {
  return (
    <g transform={`translate(${cx} 0)`}>
      <ellipse cx="0" cy="0" rx="7.5" ry="9" fill="var(--color-leia-eyes)" stroke="var(--color-leia-point)" strokeWidth="1.6" />
      <circle cx="-2.4" cy="-3" r="2.6" fill="white" />
    </g>
  );
}

/**
 * Chuva de coraçõezinhos e brilhos — usada tanto quando alguém faz
 * cafuné (clica na Leia) quanto na reação de "comemorando" vinda do
 * resto do app (level up etc.), pra manter a mesma sensação de carinho.
 */
function AffectionBurst() {
  const items = ["💕", "✨", "💖", "✨", "💕"];
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {items.map((s, i) => (
        <motion.span
          key={i}
          className="absolute"
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            y: -60 - i * 9,
            x: (i - 2) * 26,
            opacity: [0, 1, 0],
            scale: [0.4, 1.1, 0.9],
            rotate: (i - 2) * 12,
          }}
          transition={{ duration: 1.05, delay: i * 0.07, ease: "easeOut" }}
        >
          {s}
        </motion.span>
      ))}
    </motion.div>
  );
}

function EvolutionFlash() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-full bg-white"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.6, 1.8] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    />
  );
}

function GiftPop() {
  return (
    <motion.span
      className="pointer-events-none absolute -right-1 -top-1 text-xl"
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 12 }}
    >
      🎁
    </motion.span>
  );
}

function StudyBubble() {
  return (
    <motion.span
      className="pointer-events-none absolute -right-2 -top-3 text-lg"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2 }}
    >
      📖
    </motion.span>
  );
}
