/**
 * useEquippedAccessories — única ponte entre a camada de DADOS (React Query
 * + /api/shop/inventory) e o sistema visual de acessórios. Qualquer tela que
 * precise mostrar a Leia "vestida" usa este hook — nunca chama o serviço de
 * inventário diretamente para essa finalidade.
 */
import { useInventory } from "@/features/shop/hooks/useShop";

export function useEquippedAccessories() {
  const { data, isLoading } = useInventory();

  const accessories = (data ?? []).filter((item) => item.tipoItem === "COSMETICO" && item.equipado);

  return { accessories, isLoading };
}
