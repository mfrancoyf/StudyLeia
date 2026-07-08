export type Raridade = "COMUM" | "RARA" | "EPICA" | "LEGENDARIA";
export type TipoItemLoja = "COSMETICO" | "CENARIO";

/** Categorias de cosmético cadastradas no backend (ver CategoriaCosmetico.java). */
export type CategoriaCosmetico = "LACO" | "OCULOS" | "CHAPEU" | "GRAVATA" | "ACESSORIO_ESPECIAL";

export interface ItemLojaResponse {
  id: string;
  tipoItem: TipoItemLoja;
  nome: string;
  descricao: string;
  categoria: string;
  raridade: Raridade;
  preco: number;
  icone: string;
  gradiente: string;
  codigoCena: string;
  possuido: boolean;
  equipado: boolean;
}

export interface InventoryItemResponse {
  itemRefId: string;
  tipoItem: string;
  nome: string;
  icone: string;
  /** Categoria do cosmético (LACO, OCULOS, CHAPEU, GRAVATA, ACESSORIO_ESPECIAL). `null` para cenários. */
  categoria: CategoriaCosmetico | null;
  posicaoOverlay: string;
  gradiente: string;
  codigoCena: string;
  equipado: boolean;
}

export interface PurchaseHistoryResponse {
  tipoItem: string;
  nomeItem: string;
  precoPago: number;
  compradoEm: string;
}

export interface ComprarItemRequest {
  tipoItem: TipoItemLoja;
  itemRefId: string;
}

export interface EquiparItemRequest {
  tipoItem: TipoItemLoja;
  itemRefId: string;
}

export interface CompraResultado {
  sucesso: boolean;
  nomeItem: string;
  precoPago: number;
  moedasRestantes: number;
}
