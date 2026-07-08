/**
 * ==========================================================================
 * LEIA — AccessoryConfig
 * ==========================================================================
 * Fonte única de verdade de COMO cada acessório se encaixa na Leia.
 * Nunca usar valores soltos: toda posição parte de uma LEIA_ANCHORS
 * (`anchors.ts`) + um offset pequeno, com escala e rotação explícitas.
 *
 * Duas camadas de configuração:
 *   1. CATEGORY_DEFAULTS — fallback por `categoria` (LACO, OCULOS,
 *      CHAPEU, GRAVATA, ACESSORIO_ESPECIAL). Garante que um item novo
 *      cadastrado no banco, mesmo sem entrada específica, já apareça
 *      no lugar aproximado certo — nada quebra.
 *   2. ACCESSORY_CONFIG — ajuste fino por `nome` exato do item (o
 *      catálogo real, ver V10__criar_tabelas_shop_cosmetic_background.sql).
 *      Sempre que possível, prefira cadastrar aqui para um encaixe
 *      perfeito em vez de confiar só no fallback.
 *
 * COMO ADICIONAR UM ACESSÓRIO NOVO
 * --------------------------------------------------------------------------
 *   1. Se nenhuma forma existente servir, crie uma em `shapes.tsx`.
 *   2. Adicione uma entrada em ACCESSORY_CONFIG usando o `nome` exato
 *      cadastrado no banco (CosmeticItem.nome).
 *   3. Escolha a âncora anatômica mais próxima e ajuste offset/escala/
 *      rotação — nunca coordenadas soltas.
 * ==========================================================================
 */
import type { AnchorName } from "./anchors";
import { ACCESSORY_SHAPES, type AccessoryColors, type ShapeKey } from "./shapes";
import type { CategoriaCosmetico } from "@/types/shop";

export interface AccessoryPlacement {
  anchor: AnchorName;
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  shape: ShapeKey;
  cores?: AccessoryColors;
}

/** Fallback por categoria — usado quando não há entrada específica por nome. */
export const CATEGORY_DEFAULTS: Record<CategoriaCosmetico, AccessoryPlacement> = {
  LACO: { anchor: "topo", offsetX: 0, offsetY: -1, scale: 1, rotation: 0, shape: "laco" },
  OCULOS: { anchor: "olhos", offsetX: 0, offsetY: 0, scale: 1, rotation: 0, shape: "oculosRedondo" },
  CHAPEU: { anchor: "topo", offsetX: 0, offsetY: -5, scale: 1, rotation: 0, shape: "chapeuFormatura" },
  GRAVATA: { anchor: "pescoco", offsetX: 0, offsetY: 0, scale: 1, rotation: 0, shape: "gravataBorboleta" },
  ACESSORIO_ESPECIAL: { anchor: "pescoco", offsetX: 0, offsetY: -2, scale: 1, rotation: 0, shape: "insigniaGenerica" },
};

/**
 * Ajuste fino por nome exato do item (catálogo semeado em V10). Escala e
 * offsets foram calibrados visualmente contra a anatomia de
 * `LeiaMascot.tsx` (cabeça: cx 0 cy -14 r 27; olhos: y -16, x ±11).
 */
export const ACCESSORY_CONFIG: Record<string, AccessoryPlacement> = {
  "Laço Azul Clássico": {
    anchor: "topo",
    offsetX: 0,
    offsetY: -1,
    scale: 1,
    rotation: -4,
    shape: "laco",
    cores: { principal: "#4C6FE5", secundaria: "#2F4EA6" },
  },
  "Laço Dourado": {
    anchor: "topo",
    offsetX: 0,
    offsetY: -1,
    scale: 1.05,
    rotation: 4,
    shape: "laco",
    cores: { principal: "#FFD966", secundaria: "#C99A2E" },
  },
  "Óculos de Estudante": {
    anchor: "olhos",
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    shape: "oculosRedondo",
    cores: { armacao: "#3A2E26" },
  },
  "Óculos de Sol": {
    anchor: "olhos",
    offsetX: 0,
    offsetY: 0.5,
    scale: 1.02,
    rotation: 0,
    shape: "oculosSol",
  },
  "Chapéu de Formatura": {
    anchor: "topo",
    offsetX: 0,
    offsetY: -5,
    scale: 1,
    rotation: 0,
    shape: "chapeuFormatura",
  },
  "Chapéu de Bruxinha": {
    anchor: "topo",
    offsetX: 1,
    offsetY: -3,
    scale: 0.95,
    rotation: -6,
    shape: "chapeuBruxa",
  },
  "Gravata Borboleta": {
    anchor: "pescoco",
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    shape: "gravataBorboleta",
    cores: { principal: "#E24A4A", secundaria: "#A82E2E" },
  },
  "Coleira de Pérolas": {
    anchor: "pescoco",
    offsetX: 0,
    offsetY: 1,
    scale: 1,
    rotation: 0,
    shape: "coleiraDePerolas",
  },
  "Coroa Real": {
    anchor: "topo",
    offsetX: 0,
    offsetY: -6,
    scale: 1.05,
    rotation: 0,
    shape: "coroaReal",
  },
  "Asas de Anjo": {
    anchor: "costas",
    offsetX: 0,
    offsetY: 0,
    scale: 1.15,
    rotation: 0,
    shape: "asasDeAnjo",
  },
  "Boina de Artista": {
    anchor: "topo",
    offsetX: -1,
    offsetY: -2,
    scale: 1,
    rotation: 0,
    shape: "boinaArtista",
    cores: { principal: "#7A2E3B", secundaria: "#571F28" },
  },
  "Cachecol Listrado": {
    anchor: "pescoco",
    offsetX: 0,
    offsetY: -1,
    scale: 1,
    rotation: 0,
    shape: "cachecolListrado",
    cores: { principal: "#3E7A5C", secundaria: "#F2EDE0" },
  },
  "Óculos Gatinho Retrô": {
    anchor: "olhos",
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    shape: "oculosGatinho",
    cores: { armacao: "#C9457A" },
  },
  "Coroa de Flores": {
    anchor: "topo",
    offsetX: 0,
    offsetY: -1,
    scale: 1.05,
    rotation: 0,
    shape: "coroaDeFlores",
  },
};

/**
 * Resolve a configuração final de um item equipado: tenta o ajuste
 * fino por nome, cai para o padrão da categoria, e por fim para um
 * fallback seguro — nunca deixa de renderizar algo coerente.
 */
export function resolveAccessoryConfig(nome: string, categoria: CategoriaCosmetico | null | undefined): AccessoryPlacement {
  if (ACCESSORY_CONFIG[nome]) return ACCESSORY_CONFIG[nome];
  if (categoria && CATEGORY_DEFAULTS[categoria]) return CATEGORY_DEFAULTS[categoria];
  return CATEGORY_DEFAULTS.ACESSORIO_ESPECIAL;
}

export { ACCESSORY_SHAPES };
