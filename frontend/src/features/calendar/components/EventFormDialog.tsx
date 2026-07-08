import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCriarEvento } from "@/features/calendar/hooks/useCalendarEvents";
import { useToast } from "@/hooks/use-toast";
import type { TipoEvento } from "@/types/calendar";

const schema = z.object({
  titulo: z.string().min(2, "Dê um título ao evento"),
  tipo: z.enum(["PROVA", "TRABALHO", "APRESENTACAO", "LEMBRETE"]),
  dataHora: z.string().min(1, "Escolha data e hora"),
  descricao: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const TIPOS: { value: TipoEvento; label: string }[] = [
  { value: "PROVA", label: "Prova" },
  { value: "TRABALHO", label: "Trabalho" },
  { value: "APRESENTACAO", label: "Apresentação" },
  { value: "LEMBRETE", label: "Lembrete" },
];

export function EventFormDialog() {
  const [aberto, setAberto] = useState(false);
  const criar = useCriarEvento();
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { tipo: "PROVA" } });

  async function onSubmit(data: FormValues) {
    try {
      await criar.mutateAsync({ ...data, descricao: data.descricao ?? "" });
      toast({ title: "Evento adicionado", description: data.titulo });
      reset({ tipo: "PROVA" });
      setAberto(false);
    } catch {
      toast({ title: "Não foi possível salvar o evento" });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Novo evento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Título" htmlFor="titulo" error={errors.titulo?.message}>
            <Input id="titulo" placeholder="Ex: Prova de Cálculo I" {...register("titulo")} />
          </FormField>

          <FormField label="Tipo" htmlFor="tipo">
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <select id="tipo" className="h-10 rounded-xl border border-slate-200 px-3 text-sm" {...field}>
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </FormField>

          <FormField label="Data e hora" htmlFor="dataHora" error={errors.dataHora?.message}>
            <Input id="dataHora" type="datetime-local" {...register("dataHora")} />
          </FormField>

          <FormField label="Descrição (opcional)" htmlFor="descricao">
            <Textarea id="descricao" {...register("descricao")} />
          </FormField>

          <Button type="submit" disabled={criar.isPending} className="w-full">
            {criar.isPending ? "Salvando..." : "Salvar evento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
