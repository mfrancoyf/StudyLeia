/**
 * AccessoryRenderer — desenha UM acessório já resolvido (âncora + offset +
 * escala + rotação) como um <g> transformado dentro do SVG da Leia.
 *
 * Só usa `transform` (translate/rotate/scale), nunca top/left em pixels —
 * por isso o encaixe nunca "quebra" ao redimensionar: o <g> segue a mesma
 * matriz de transformação do resto da anatomia, dentro do mesmo viewBox.
 */
import { LEIA_ANCHORS } from "./anchors";
import { ACCESSORY_SHAPES, type AccessoryPlacement } from "./accessoryConfig";

interface AccessoryRendererProps {
  placement: AccessoryPlacement;
  /** Chave estável para animações de entrada (equipar/desequipar). */
  itemKey: string;
}

export function AccessoryRenderer({ placement, itemKey }: AccessoryRendererProps) {
  const anchor = LEIA_ANCHORS[placement.anchor];
  const x = anchor.x + placement.offsetX;
  const y = anchor.y + placement.offsetY;
  const Shape = ACCESSORY_SHAPES[placement.shape];

  return (
    <g key={itemKey} transform={`translate(${x} ${y}) rotate(${placement.rotation}) scale(${placement.scale})`}>
      <Shape cores={placement.cores ?? {}} />
    </g>
  );
}
