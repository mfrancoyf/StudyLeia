import { ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShopItemCard } from "@/features/shop/components/ShopItemCard";
import {
  useCatalogo,
  useInventory,
  usePurchaseHistory,
  useComprar,
  useEquipar,
  useDesequipar,
  useSaldoMoedas,
} from "@/features/shop/hooks/useShop";
import { useLeiaReaction } from "@/contexts/LeiaReactionContext";
import { useToast } from "@/hooks/use-toast";
import type { TipoItemLoja } from "@/types/shop";

export default function ShopPage() {
  const { data: catalogo, isLoading } = useCatalogo();
  const { data: inventario } = useInventory();
  const { data: historico } = usePurchaseHistory();
  const { data: progresso } = useSaldoMoedas();
  const comprar = useComprar();
  const equipar = useEquipar();
  const desequipar = useDesequipar();
  const { react } = useLeiaReaction();
  const { toast } = useToast();

  async function handleComprar(itemRefId: string, tipoItem: "COSMETICO" | "CENARIO", nome: string) {
    try {
      await comprar.mutateAsync({ itemRefId, tipoItem });
      react("presenteando", `${nome} comprado!`);
      toast({ title: "Compra realizada! 🎁", description: nome, variant: "success" });
    } catch {
      toast({ title: "Não foi possível comprar", description: "Verifique se você tem moedas suficientes" });
    }
  }

  function handleEquipar(tipoItem: TipoItemLoja, itemRefId: string) {
    equipar.mutate(
      { tipoItem, itemRefId },
      { onError: () => toast({ title: "Não foi possível equipar", description: "Tenta de novo em instantes" }) }
    );
  }

  function handleDesequipar(tipoItem: TipoItemLoja, itemRefId: string) {
    desequipar.mutate(
      { tipoItem, itemRefId },
      { onError: () => toast({ title: "Não foi possível desequipar", description: "Tenta de novo em instantes" }) }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Loja</h1>
          <p className="text-slate-500">Cosméticos e cenários para personalizar a Leia.</p>
        </div>
        <div className="flex items-center gap-2 rounded-pill bg-xp-500/10 px-4 py-2 font-semibold text-slate-700">
          <span aria-hidden className="text-lg leading-none">🪙</span>
          {progresso ? progresso.moedas.toLocaleString("pt-BR") : "…"}
          <span className="text-xs font-normal text-slate-500">moedas</span>
        </div>
      </div>

      <Tabs defaultValue="catalogo">
        <TabsList>
          <TabsTrigger value="catalogo">Catálogo</TabsTrigger>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogo">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-56" />
              ))}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {catalogo?.map((item) => (
              <ShopItemCard
                key={item.id}
                {...item}
                comprando={comprar.isPending}
                onComprar={() => handleComprar(item.id, item.tipoItem, item.nome)}
                onEquipar={() => handleEquipar(item.tipoItem, item.id)}
                onDesequipar={() => handleDesequipar(item.tipoItem, item.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventario">
          {inventario?.length === 0 && (
            <Card className="flex flex-col items-center gap-2 p-10 text-center text-slate-500">
              <ShoppingBag className="h-8 w-8 text-brand-300" />
              Você ainda não comprou nada — dá uma olhada no catálogo!
            </Card>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inventario?.map((item) => (
              <Card key={item.itemRefId} className="flex flex-col items-center gap-2 p-4 text-center">
                <span className="text-3xl">{item.icone}</span>
                <p className="text-sm font-medium text-slate-700">{item.nome}</p>
                {item.equipado ? (
                  <button
                    onClick={() => handleDesequipar(item.tipoItem as TipoItemLoja, item.itemRefId)}
                    className="text-xs font-semibold text-success-600 hover:underline"
                  >
                    Equipado (clique pra tirar)
                  </button>
                ) : (
                  <button
                    onClick={() => handleEquipar(item.tipoItem as TipoItemLoja, item.itemRefId)}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Equipar
                  </button>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <div className="flex flex-col gap-2">
            {historico?.map((compra, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between p-4">
                  <p className="text-sm font-medium text-slate-700">{compra.nomeItem}</p>
                  <p className="text-xs text-slate-500">
                    {compra.precoPago} moedas · {new Date(compra.compradoEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
