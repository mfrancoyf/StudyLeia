/**
 * AccessoryLayer — ponte entre o INVENTÁRIO (dados: quais itens o usuário
 * equipou) e a RENDERIZAÇÃO (AccessoryRenderer). Esta é a única peça que
 * conhece o formato do `InventoryItemResponse`; o resto do sistema de
 * acessórios (config, shapes, renderer) não sabe nada sobre API/inventário.
 *
 * Fluxo:  Avatar (LeiaMascot) → AccessoryLayer → AccessoryRenderer → AccessoryConfig
 */
import { AnimatePresence, motion } from "framer-motion";
import type { InventoryItemResponse } from "@/types/shop";
import type { AnchorName } from "./anchors";
import { resolveAccessoryConfig } from "./accessoryConfig";
import { AccessoryRenderer } from "./AccessoryRenderer";

interface AccessoryLayerProps {
  /** Itens do inventário já equipados (equipado === true), tipo COSMETICO. */
  accessories: InventoryItemResponse[];
  /**
   * Filtra por âncora — permite desenhar a camada "costas" antes do corpo
   * (fica atrás) e as demais depois (ficam na frente). Ver `LeiaMascot.tsx`.
   */
  anchors: AnchorName[];
}

export function AccessoryLayer({ accessories, anchors }: AccessoryLayerProps) {
  const itensDaCamada = accessories
    .filter((item) => item.tipoItem === "COSMETICO")
    .map((item) => ({ item, placement: resolveAccessoryConfig(item.nome, item.categoria) }))
    .filter(({ placement }) => anchors.includes(placement.anchor));

  return (
    <AnimatePresence>
      {itensDaCamada.map(({ item, placement }) => (
        <motion.g
          key={item.itemRefId}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <AccessoryRenderer placement={placement} itemKey={item.itemRefId} />
        </motion.g>
      ))}
    </AnimatePresence>
  );
}
