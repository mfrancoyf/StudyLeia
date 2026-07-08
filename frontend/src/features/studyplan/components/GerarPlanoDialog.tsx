import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGerarPlanoIA } from "@/features/studyplan/hooks/useStudyPlans";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  materia: z.string().min(2, "Informe a matéria"),
  dataProva: z.string().min(1, "Escolha a data da prova"),
  horasDisponiveisPorDia: z.number().min(0.5, "Mínimo de 0.5 hora por dia"),
});
type FormValues = z.infer<typeof schema>;

export function GerarPlanoDialog() {
  const [aberto, setAberto] = useState(false);
  const gerar = useGerarPlanoIA();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { horasDisponiveisPorDia: 2 } });

  async function onSubmit(data: FormValues) {
    try {
      await gerar.mutateAsync(data);
      toast({ title: "Plano de estudos criado! 📅", description: data.materia });
      reset();
      setAberto(false);
    } catch {
      toast({ title: "Não deu certo", description: "A IA não conseguiu montar o plano agora." });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="accent" size="sm">
          <Sparkles className="h-4 w-4" /> Montar plano com IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Montar plano de estudos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Matéria" htmlFor="materia" error={errors.materia?.message}>
            <Input id="materia" placeholder="Ex: Cálculo I" {...register("materia")} />
          </FormField>

          <FormField label="Data da prova" htmlFor="dataProva" error={errors.dataProva?.message}>
            <Input id="dataProva" type="date" {...register("dataProva")} />
          </FormField>

          <FormField label="Horas disponíveis por dia" htmlFor="horasDisponiveisPorDia" error={errors.horasDisponiveisPorDia?.message}>
            <Input
              id="horasDisponiveisPorDia"
              type="number"
              step="0.5"
              min={0.5}
              {...register("horasDisponiveisPorDia", { valueAsNumber: true })}
            />
          </FormField>

          <Button type="submit" disabled={gerar.isPending} className="w-full">
            {gerar.isPending ? "Montando cronograma..." : "Gerar plano"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
