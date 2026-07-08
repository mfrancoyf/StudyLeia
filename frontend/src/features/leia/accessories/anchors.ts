/**
 * ==========================================================================
 * LEIA — Âncoras anatômicas (fonte única de verdade para posicionamento)
 * ==========================================================================
 *
 * Estas coordenadas vivem no MESMO viewBox do <svg> desenhado em
 * `LeiaMascot.tsx` (viewBox="-50 -55 100 110"). Nenhum acessório é
 * posicionado com valores soltos — todo AccessoryConfig parte de uma
 * destas âncoras + um pequeno offset (ver `accessoryConfig.tsx`).
 *
 * Por que isso resolve o problema de "acessório flutuando"?
 * --------------------------------------------------------------------------
 * O acessório NÃO é um elemento HTML posicionado por cima da imagem
 * (top/left em %, que perde a relação com a anatomia ao redimensionar).
 * Ele é desenhado como um <g> DENTRO do mesmo <svg> da Leia. Como o SVG
 * inteiro escala via `viewBox` (não por pixels fixos), quando o widget
 * muda de tamanho (sm/md/lg, mobile/desktop) o acessório escala junto,
 * na mesma proporção, sempre grudado no mesmo ponto do corpo.
 */
export interface Point {
  x: number;
  y: number;
}

/** Nomes válidos de âncora — usados também como `posicaoOverlay` vindo do backend. */
export type AnchorName = "topo" | "olhos" | "pescoco" | "costas";

export const LEIA_ANCHORS: Record<AnchorName, Point> = {
  // Entre as orelhas, no topo do crânio — laços, chapéus, coroas.
  topo: { x: 0, y: -43 },
  // Centro exato entre os dois olhos — óculos.
  olhos: { x: 0, y: -16 },
  // Logo abaixo do queixo/boca, no peito — gravatas, colares.
  pescoco: { x: 0, y: 15 },
  // Atrás do corpo, entre as omoplatas — asas, capas.
  costas: { x: 0, y: 8 },
};

/**
 * Ordem de empilhamento visual. `costas` é desenhada ANTES do corpo da
 * Leia (fica por trás); as demais são desenhadas DEPOIS de tudo (por
 * cima). Ver uso em `LeiaMascot.tsx`.
 */
export const BACK_ANCHORS: AnchorName[] = ["costas"];
export const FRONT_ANCHOR_ORDER: AnchorName[] = ["pescoco", "olhos", "topo"];
