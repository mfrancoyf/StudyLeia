/**
 * ==========================================================================
 * LEIA — Biblioteca de formas dos acessórios
 * ==========================================================================
 * Cada forma é um componente SVG puro, centrado no próprio ponto de
 * encaixe (0,0) — nunca usa <image>/emoji. Isso garante o mesmo estilo
 * "chibi" flat do resto da Leia e escala perfeitamente com o SVG pai
 * (emoji tem fonte própria e renderiza diferente por SO/navegador,
 * que era uma das causas do desalinhamento antigo).
 *
 * Para adicionar uma forma nova: crie a função aqui (recebe `cores`,
 * devolve markup SVG) e registre em `accessoryConfig.tsx`.
 * ==========================================================================
 */
import type { CSSProperties, ReactElement } from "react";

export interface AccessoryColors {
  principal?: string;
  secundaria?: string;
  armacao?: string;
  lente?: string;
}

export type ShapeComponent = (props: { cores: AccessoryColors }) => ReactElement;

const softShadow: CSSProperties = { filter: "drop-shadow(0 1px 1px rgba(58,46,38,0.25))" };

/** Laço — preso entre as orelhas, dois laços + nó central. */
export const Laco: ShapeComponent = ({ cores }) => {
  const c1 = cores.principal ?? "#E85D8A";
  const c2 = cores.secundaria ?? "#B23D66";
  return (
    <g style={softShadow}>
      <path d="M -13 2 Q -20 -7 -13 -15 Q -5 -11 -1 -2 Q -5 3 -13 2 Z" fill={c1} stroke={c2} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M 13 2 Q 20 -7 13 -15 Q 5 -11 1 -2 Q 5 3 13 2 Z" fill={c1} stroke={c2} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M -3 5 L -7 11 L 0 8 L 7 11 L 3 5 Z" fill={c1} stroke={c2} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="0" cy="1" r="3.6" fill={c2} />
    </g>
  );
};

/** Óculos redondos — lentes centradas exatamente nos dois olhos (dist. 22, igual EyeAberto). */
export const OculosRedondo: ShapeComponent = ({ cores }) => {
  const armacao = cores.armacao ?? "#3A2E26";
  const lente = cores.lente ?? "rgba(255,255,255,0.18)";
  return (
    <g style={softShadow}>
      <circle cx="-11" cy="0" r="9" fill={lente} stroke={armacao} strokeWidth="1.8" />
      <circle cx="11" cy="0" r="9" fill={lente} stroke={armacao} strokeWidth="1.8" />
      <path d="M -2 -1 Q 0 1.5 2 -1" fill="none" stroke={armacao} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M -20 -1 Q -25 -1 -26 3" fill="none" stroke={armacao} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 20 -1 Q 25 -1 26 3" fill="none" stroke={armacao} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="-14" cy="-3" r="1.3" fill="#FFFFFF" opacity="0.8" />
      <circle cx="8" cy="-3" r="1.3" fill="#FFFFFF" opacity="0.8" />
    </g>
  );
};

/** Óculos de sol — mesma geometria dos redondos, lentes opacas + haste. */
export const OculosSol: ShapeComponent = ({ cores }) => {
  const armacao = cores.armacao ?? "#1C2B4A";
  const lente = cores.lente ?? "#2B3A55";
  return (
    <g style={softShadow}>
      <path d="M -20 -2 Q -11 -6 -2 -1.5 Q 0 -3 2 -1.5 Q 11 -6 20 -2 L 20 -0.5 Q 11 -4.5 2 0 Q 0 -1.5 -2 0 Q -11 -4.5 -20 -0.5 Z" fill={armacao} />
      <circle cx="-11" cy="0.5" r="8" fill={lente} stroke={armacao} strokeWidth="1.6" />
      <circle cx="11" cy="0.5" r="8" fill={lente} stroke={armacao} strokeWidth="1.6" />
      <path d="M -20 -0.5 Q -25 0 -26 3.5" fill="none" stroke={armacao} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 20 -0.5 Q 25 0 26 3.5" fill="none" stroke={armacao} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M -14 -2 Q -12 -3.5 -9 -3" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    </g>
  );
};

/** Chapéu de formatura — capelo apoiado no topo da cabeça + borla. */
export const ChapeuFormatura: ShapeComponent = ({ cores }) => {
  const banda = cores.armacao ?? cores.secundaria ?? "#1C2B4A";
  const topo = cores.principal ?? "#243B6B";
  const borla = cores.lente ?? "#FFC94D";
  return (
    <g style={softShadow}>
      <ellipse cx="0" cy="2" rx="13" ry="4.2" fill={banda} />
      <path d="M -20 -3 L 0 -12 L 20 -3 L 0 6 Z" fill={topo} stroke={banda} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="0" cy="-3" r="1.4" fill={borla} />
      <path d="M 0 -3 L 12 1" stroke={borla} strokeWidth="1" />
      <path d="M 12 1 L 12 8 Q 12 10 10 10.5" stroke={borla} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="11" r="1.6" fill={borla} />
    </g>
  );
};

/** Chapéu de bruxinha — reconstruído em cima da arte de referência que
 * o Franco mandou: cone com sombra atrás + painel claro na frente
 * (dobra do tecido), ponta curvada pro lado (não uma bolinha), aba
 * com sombra embaixo pra dar volume, faixa escura com fivela clara
 * e risco laranja no centro. */
export const ChapeuBruxa: ShapeComponent = ({ cores }) => {
  const escuro = cores.armacao ?? "#3E3057";
  const claro = cores.principal ?? "#7B5FAE";
  const faixa = cores.secundaria ?? "#26404F";
  const fivela = cores.lente ?? "#F7E4A8";
  return (
    <g style={softShadow}>
      {/* sombra da aba, dá volume */}
      <ellipse cx="0" cy="5.3" rx="14" ry="3.7" fill={escuro} />
      {/* cone — camada de sombra (silhueta cheia, alta e afunilada, com
          uma curvinha só na pontinha — versão anterior tinha base larga
          e pouca altura, o que lia como chapéu de pagode em vez de
          bruxa; SVG raiz não recorta conteúdo fora do viewBox (só os
          elementos não-raiz têm overflow:hidden por padrão), então dá
          pra deixar alto sem medo de cortar no topo. */}
      <path
        d="M -9 2.5 Q -8 -12 -3.5 -22 Q -1 -28 1.5 -31.5 Q 4.5 -34.5 8 -32 Q 9.5 -30 6 -28 Q 2.5 -26 3 -20 Q 3.5 -10 9 2.5 Z"
        fill={escuro}
      />
      {/* cone — painel claro (dobra frontal), por cima da sombra */}
      <path
        d="M -5.5 2.5 Q -5 -10 -1.5 -19 Q 0.5 -25 2.5 -27.5 Q 3.5 -25 1.5 -20 Q 0 -14 0.5 -6 Q 1 -2 2.5 2.5 Z"
        fill={claro}
      />
      {/* faixa escura na base */}
      <path d="M -8.6 0.3 Q 0 2.6 8.6 0.3 L 8.9 3.3 Q 0 5.9 -8.9 3.3 Z" fill={faixa} />
      {/* aba */}
      <ellipse cx="0" cy="4" rx="13.5" ry="3.5" fill={claro} />
      {/* fivela */}
      <rect x="-3.6" y="0.6" width="7.2" height="3.4" rx="0.7" fill={fivela} />
      <rect x="-2.2" y="1.9" width="4.4" height="0.9" rx="0.4" fill="#E08A2E" />
    </g>
  );
};

/** Gravata borboleta — alinhada logo abaixo da boca/queixo. */
export const GravataBorboleta: ShapeComponent = ({ cores }) => {
  const c1 = cores.principal ?? "#E24A4A";
  const c2 = cores.secundaria ?? "#A82E2E";
  return (
    <g style={softShadow}>
      <path d="M -10 0 Q -15 -5 -15 0 Q -15 5 -10 0 L -2 -3 L -2 3 Z" fill={c1} stroke={c2} strokeWidth="1" strokeLinejoin="round" />
      <path d="M 10 0 Q 15 -5 15 0 Q 15 5 10 0 L 2 -3 L 2 3 Z" fill={c1} stroke={c2} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="0" cy="0" r="2.6" fill={c2} />
    </g>
  );
};

/** Coleira de pérolas — colar delicado no pescoço. */
export const ColeiraDePerolas: ShapeComponent = ({ cores }) => {
  const perola = cores.principal ?? "#FDF6E8";
  const brilho = cores.secundaria ?? "#E8DDBF";
  const pontos = [-14, -9.5, -5, -0.5, 0.5, 5, 9.5, 14];
  return (
    <g style={softShadow}>
      <path d="M -15 -1 Q 0 8 15 -1" stroke={brilho} strokeWidth="1" fill="none" opacity="0.6" />
      {pontos.map((x, i) => {
        const y = 3.6 - Math.pow(x / 15, 2) * 4.4;
        return <circle key={i} cx={x} cy={y} r="2.1" fill={perola} stroke={brilho} strokeWidth="0.5" />;
      })}
    </g>
  );
};

/** Coroa real — item lendário, apoiada no topo da cabeça. */
export const CoroaReal: ShapeComponent = ({ cores }) => {
  const ouro = cores.principal ?? "#FFC94D";
  const sombra = cores.secundaria ?? "#D89B22";
  const gema = cores.lente ?? "#E24A6E";
  return (
    <g style={softShadow}>
      <path d="M -15 4 L -15 -4 L -8 2 L 0 -9 L 8 2 L 15 -4 L 15 4 Z" fill={ouro} stroke={sombra} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="-15" y="4" width="30" height="3.4" rx="1" fill={sombra} />
      <circle cx="0" cy="-3" r="2" fill={gema} />
      <circle cx="-8.5" cy="1" r="1.3" fill={gema} />
      <circle cx="8.5" cy="1" r="1.3" fill={gema} />
    </g>
  );
};

/** Asas de anjo — atrás do corpo, brilho suave. Desenhada na âncora "costas". */
export const AsasDeAnjo: ShapeComponent = ({ cores }) => {
  const pena = cores.principal ?? "#FFFFFF";
  const sombra = cores.secundaria ?? "#DCE7FA";
  return (
    <g style={{ filter: "drop-shadow(0 1px 3px rgba(140,160,220,0.45))" }} opacity="0.95">
      <path d="M -6 -4 Q -30 -14 -34 4 Q -30 2 -26 6 Q -30 8 -28 14 Q -20 12 -14 6 Q -10 0 -6 -4 Z" fill={pena} stroke={sombra} strokeWidth="0.8" />
      <path d="M 6 -4 Q 30 -14 34 4 Q 30 2 26 6 Q 30 8 28 14 Q 20 12 14 6 Q 10 0 6 -4 Z" fill={pena} stroke={sombra} strokeWidth="0.8" />
    </g>
  );
};

/** Selo/insígnia genérico — fallback visual para itens especiais sem shape dedicado. */
export const InsigniaGenerica: ShapeComponent = ({ cores }) => {
  const c1 = cores.principal ?? "#8A6DE0";
  const c2 = cores.secundaria ?? "#5C3FB0";
  return (
    <g style={softShadow}>
      <path
        d="M 0 -8 L 2.4 -2.4 L 8 -2.4 L 3.6 1.2 L 5.2 7 L 0 3.4 L -5.2 7 L -3.6 1.2 L -8 -2.4 L -2.4 -2.4 Z"
        fill={c1}
        stroke={c2}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </g>
  );
};

/** Boina de artista — achatada, levemente tombada, com rebordo e caniquinho no topo. */
export const BoinaArtista: ShapeComponent = ({ cores }) => {
  const cor = cores.principal ?? "#7A2E3B";
  const sombra = cores.secundaria ?? "#571F28";
  return (
    <g style={softShadow} transform="rotate(-6)">
      <ellipse cx="2" cy="1" rx="15.5" ry="8.5" fill={cor} stroke={sombra} strokeWidth="1" />
      <path d="M -12.5 4.5 Q 2 9.5 13.5 2.5" stroke={sombra} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.55" />
      <rect x="-1.3" y="-8.5" width="2.6" height="3.6" rx="1.1" fill={sombra} />
    </g>
  );
};

/** Cachecol listrado — enrolado no pescoço com uma ponta caindo, franjas na base. */
export const CachecolListrado: ShapeComponent = ({ cores }) => {
  const c1 = cores.principal ?? "#3E7A5C";
  const c2 = cores.secundaria ?? "#F2EDE0";
  return (
    <g style={softShadow}>
      <path d="M -15 -3 Q 0 6 15 -3 L 15 2 Q 0 11 -15 2 Z" fill={c1} />
      <path d="M -11 -1.5 L -8 8.5 M -3 0.5 L 0 10 M 6 -0.5 L 9 8.5" stroke={c2} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
      <path d="M -5 6 Q -6 14 -4 22 L 5 22 Q 6 13 4 5 Q -0.5 8 -5 6 Z" fill={c1} />
      <path d="M -3.4 9 L 3.6 9 M -4 13.5 L 4.2 13.5 M -4.4 18 L 4.6 18" stroke={c2} strokeWidth="1.6" opacity="0.85" />
      <path d="M -4 22 L -4 25.5 M -1.3 22 L -1.3 25.8 M 1.3 22 L 1.3 25.8 M 4 22 L 4 25.5" stroke={c1} strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
};

/** Óculos gatinho retrô — lentes em bico levantado, estilo vintage colorido. */
export const OculosGatinho: ShapeComponent = ({ cores }) => {
  const armacao = cores.armacao ?? "#C9457A";
  const lente = cores.lente ?? "rgba(255,255,255,0.2)";
  return (
    <g style={softShadow}>
      <path
        d="M -20 2 Q -19 -6 -11 -6 Q -3 -6 -2 1 Q -3 6 -11 6.5 Q -19 6.5 -20 2 Z"
        fill={lente}
        stroke={armacao}
        strokeWidth="1.8"
      />
      <path
        d="M 20 2 Q 19 -6 11 -6 Q 3 -6 2 1 Q 3 6 11 6.5 Q 19 6.5 20 2 Z"
        fill={lente}
        stroke={armacao}
        strokeWidth="1.8"
      />
      <path d="M -11 -6 L -15 -11 L -8.5 -7.2 Z" fill={armacao} />
      <path d="M 11 -6 L 15 -11 L 8.5 -7.2 Z" fill={armacao} />
      <path d="M -2 -1 Q 0 1.5 2 -1" fill="none" stroke={armacao} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M -20 1.5 Q -25 1 -26 5" fill="none" stroke={armacao} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 20 1.5 Q 25 1 26 5" fill="none" stroke={armacao} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="-15" cy="-1" r="1.2" fill="#FFFFFF" opacity="0.75" />
      <circle cx="7" cy="-1" r="1.2" fill="#FFFFFF" opacity="0.75" />
    </g>
  );
};

/** Coroa de flores — vinha fina com florzinhas alternadas, apoiada no topo da cabeça. */
export const CoroaDeFlores: ShapeComponent = ({ cores }) => {
  const vinha = cores.armacao ?? "#7FA35C";
  const florA = cores.principal ?? "#F49AC2";
  const florB = cores.secundaria ?? "#FFD966";
  const miolo = cores.lente ?? "#8A5A2B";
  const flores = [
    { x: -15, y: 1, cor: florB, r: 2.6 },
    { x: -8, y: -3.5, cor: florA, r: 3.2 },
    { x: 0, y: -5, cor: florB, r: 3.4 },
    { x: 8, y: -3.5, cor: florA, r: 3.2 },
    { x: 15, y: 1, cor: florB, r: 2.6 },
  ];
  return (
    <g style={softShadow}>
      <path d="M -17 3 Q -9 -5 0 -6 Q 9 -5 17 3" stroke={vinha} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {flores.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy={-f.r}
              rx={f.r * 0.55}
              ry={f.r * 0.68}
              fill={f.cor}
              transform={`rotate(${deg})`}
              opacity="0.95"
            />
          ))}
          <circle cx="0" cy="0" r={f.r * 0.4} fill={miolo} />
        </g>
      ))}
    </g>
  );
};

export const ACCESSORY_SHAPES = {
  laco: Laco,
  oculosRedondo: OculosRedondo,
  oculosSol: OculosSol,
  oculosGatinho: OculosGatinho,
  chapeuFormatura: ChapeuFormatura,
  chapeuBruxa: ChapeuBruxa,
  boinaArtista: BoinaArtista,
  gravataBorboleta: GravataBorboleta,
  cachecolListrado: CachecolListrado,
  coleiraDePerolas: ColeiraDePerolas,
  coroaReal: CoroaReal,
  coroaDeFlores: CoroaDeFlores,
  asasDeAnjo: AsasDeAnjo,
  insigniaGenerica: InsigniaGenerica,
} as const;

export type ShapeKey = keyof typeof ACCESSORY_SHAPES;
