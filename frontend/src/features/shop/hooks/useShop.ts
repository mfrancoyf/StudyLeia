import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { gamificationService } from "@/services/gamification";
import type { ComprarItemRequest, EquiparItemRequest } from "@/types/shop";

export function useCatalogo() {
  return useQuery({ queryKey: ["shop", "catalogo"], queryFn: shopService.catalogo });
}

export function useInventory() {
  return useQuery({ queryKey: ["shop", "inventory"], queryFn: shopService.inventory });
}

export function usePurchaseHistory() {
  return useQuery({ queryKey: ["shop", "history"], queryFn: shopService.history });
}

/**
 * Saldo de moedas do usuário — a Loja precisa mostrar isso (senão a
 * pessoa não sabe quanto pode gastar). Usa a mesma queryKey prefixada
 * por "gamification" que `useComprar` já invalida após uma compra, então
 * o saldo exibido aqui atualiza sozinho assim que o usuário compra algo.
 */
export function useSaldoMoedas() {
  return useQuery({ queryKey: ["gamification", "progresso"], queryFn: gamificationService.progresso });
}

export function useComprar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ComprarItemRequest) => shopService.comprar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
    },
  });
}

export function useEquipar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EquiparItemRequest) => shopService.equipar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shop"] }),
  });
}

export function useDesequipar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EquiparItemRequest) => shopService.desequipar(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shop"] }),
  });
}
