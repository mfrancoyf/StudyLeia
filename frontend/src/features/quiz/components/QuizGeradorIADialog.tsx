import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGerarQuizIA } from "@/features/quiz/hooks/useQuizzes";
import { useToast } from "@/hooks/use-toast";
import type { Dificuldade } from "@/types/quiz";

const schema = z.object({
  tema: z.string().min(2, "Descreva o tema"),
  quantidade: z.number().min(1, "Mínimo de 1 questão").max(30, "Máximo de 30 questões"),
  dificuldade: z.enum(["FACIL", "MEDIA", "DIFICIL"]),
});
type FormValues = z.infer<typeof schema>;

const DIFICULDADES: { value: Dificuldade; label: string }[] = [
  { value: "FACIL", label: "Fácil" },
  { value: "MEDIA", label: "Média" },
  { value: "DIFICIL", label: "Difícil" },
];

export function QuizGeradorIADialog() {
  const [aberto, setAberto] = useState(false);
  const gerar = useGerarQuizIA();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 10, dificuldade: "MEDIA" },
  });

  async function onSubmit(data: FormValues) {
    try {
      await gerar.mutateAsync(data);
      toast({ title: "Quiz gerado! ✨", description: `${data.quantidade} questões sobre ${data.tema}` });
      reset();
      setAberto(false);
    } catch {
      toast({ title: "Não deu certo", description: "A IA não conseguiu gerar o quiz agora. Tenta de novo?" });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="accent" size="sm">
          <Sparkles className="h-4 w-4" /> Gerar com IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar quiz com IA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Tema" htmlFor="tema" error={errors.tema?.message}>
            <Input id="tema" placeholder="Ex: Anatomia Humana" {...register("tema")} />
          </FormField>

          <FormField label="Quantidade de questões" htmlFor="quantidade" error={errors.quantidade?.message}>
            <Input id="quantidade" type="number" min={1} max={30} {...register("quantidade", { valueAsNumber: true })} />
          </FormField>

          <FormField label="Dificuldade" htmlFor="dificuldade">
            <Controller
              control={control}
              name="dificuldade"
              render={({ field }) => (
                <div className="flex gap-2">
                  {DIFICULDADES.map((d) => (
                    <button
                      type="button"
                      key={d.value}
                      onClick={() => field.onChange(d.value)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        field.value === d.value
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          <Button type="submit" disabled={gerar.isPending} className="w-full">
            {gerar.isPending ? "Gerando questões..." : "Gerar quiz"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
