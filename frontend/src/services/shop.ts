import { api } from "./api";
import type {
  ItemLojaResponse,
  InventoryItemResponse,
  PurchaseHistoryResponse,
  ComprarItemRequest,
  EquiparItemRequest,
  CompraResultado,
} from "@/types/shop";

/**
 * IMPORTANTE: o backend (`ShopController.equipar`/`desequipar`) recebe
 * `tipoItem` e `itemRefId` como QUERY PARAMS (`@RequestParam`), não como
 * corpo JSON. Antes isto mandava só `{ itemRefId }` no body e nem sequer
 * enviava `tipoItem` — a API sempre respondia 400 e o item nunca era
 * marcado como equipado (por isso não aparecia na Leia). Os dois
 * endpoints abaixo usam `params`, que o axios serializa na querystring.
 */
export const shopService = {
  catalogo: () => api.get<ItemLojaResponse[]>("/api/shop/catalogo").then((r) => r.data),
  inventory: () => api.get<InventoryItemResponse[]>("/api/shop/inventory").then((r) => r.data),
  history: () => api.get<PurchaseHistoryResponse[]>("/api/shop/history").then((r) => r.data),
  comprar: (data: ComprarItemRequest) =>
    api.post<CompraResultado>("/api/shop/comprar", data).then((r) => r.data),
  equipar: ({ tipoItem, itemRefId }: EquiparItemRequest) =>
    api.post("/api/shop/equipar", null, { params: { tipoItem, itemRefId } }),
  desequipar: ({ tipoItem, itemRefId }: EquiparItemRequest) =>
    api.post("/api/shop/desequipar", null, { params: { tipoItem, itemRefId } }),
};
