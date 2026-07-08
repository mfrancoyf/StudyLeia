interface Props {
  titulo: string;
  fase: string;
}

/**
 * Placeholder temporário — cada página aqui vira uma tela real na
 * fase do plano de migração indicada. Existe só para provar que
 * roteamento + auth + query client estão funcionando de ponta a
 * ponta antes de construirmos o Design System (Fase 3).
 */
export function PagePlaceholder({ titulo, fase }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-brand-200 bg-white/60 p-12 text-center">
      <h1 className="text-2xl font-semibold text-brand-700">{titulo}</h1>
      <p className="text-slate-500">Chega nesta fase: {fase}</p>
    </div>
  );
}
