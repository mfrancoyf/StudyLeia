import { useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCriarQuiz } from "@/features/quiz/hooks/useQuizzes";
import { useToast } from "@/hooks/use-toast";

const alternativaSchema = z.object({ letra: z.string().min(1), texto: z.string().min(1, "Preencha a alternativa") });
const questaoSchema = z
  .object({
    pergunta: z.string().min(3, "Escreva a pergunta"),
    alternativas: z.array(alternativaSchema).length(4),
    corretaIndex: z.string(),
  });
const schema = z.object({
  titulo: z.string().min(2, "Dê um título ao quiz"),
  tema: z.string().min(2, "Informe o tema"),
  dificuldade: z.enum(["FACIL", "MEDIA", "DIFICIL"]),
  questoes: z.array(questaoSchema).min(1, "Adicione ao menos uma questão"),
});
type FormValues = z.infer<typeof schema>;

const LETRAS = ["A", "B", "C", "D"];

function questaoVazia() {
  return {
    pergunta: "",
    alternativas: LETRAS.map((letra) => ({ letra, texto: "" })),
    corretaIndex: "0",
  };
}

export function QuizCriarDialog() {
  const [aberto, setAberto] = useState(false);
  const criar = useCriarQuiz();
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dificuldade: "MEDIA", questoes: [questaoVazia()] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questoes" });

  async function onSubmit(data: FormValues) {
    try {
      const payload = {
        titulo: data.titulo,
        tema: data.tema,
        dificuldade: data.dificuldade,
        questoes: data.questoes.map((q) => ({
          pergunta: q.pergunta,
          alternativas: q.alternativas.map((alt, idx) => ({
            ...alt,
            correta: idx === Number(q.corretaIndex),
          })),
        })),
      };
      await criar.mutateAsync(payload);
      toast({ title: "Quiz criado!", description: data.titulo });
      reset({ dificuldade: "MEDIA", questoes: [questaoVazia()] });
      setAberto(false);
    } catch {
      toast({ title: "Não foi possível criar o quiz" });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="h-4 w-4" /> Criar manualmente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar quiz manualmente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Título" htmlFor="titulo" error={errors.titulo?.message}>
            <Input id="titulo" {...register("titulo")} />
          </FormField>
          <FormField label="Tema" htmlFor="tema" error={errors.tema?.message}>
            <Input id="tema" {...register("tema")} />
          </FormField>

          <FormField label="Dificuldade" htmlFor="dificuldade">
            <Controller
              control={control}
              name="dificuldade"
              render={({ field }) => (
                <select
                  id="dificuldade"
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm"
                  {...field}
                >
                  <option value="FACIL">Fácil</option>
                  <option value="MEDIA">Média</option>
                  <option value="DIFICIL">Difícil</option>
                </select>
              )}
            />
          </FormField>

          <div className="flex flex-col gap-3">
            {fields.map((questao, i) => (
              <Card key={questao.id} className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">Questão {i + 1}</p>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-danger-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Input placeholder="Pergunta" {...register(`questoes.${i}.pergunta` as const)} />
                {errors.questoes?.[i]?.pergunta && (
                  <p className="text-xs text-danger-500">{errors.questoes[i]?.pergunta?.message}</p>
                )}
                <p className="text-xs text-slate-400">Marque a alternativa correta:</p>
                <div className="grid grid-cols-2 gap-2">
                  {LETRAS.map((letra, j) => (
                    <label key={letra} className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50">
                      <input type="radio" {...register(`questoes.${i}.corretaIndex` as const)} value={j} className="accent-brand-600" />
                      <Input placeholder={`Alternativa ${letra}`} className="h-8 border-none px-1 shadow-none" {...register(`questoes.${i}.alternativas.${j}.texto` as const)} />
                    </label>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={() => append(questaoVazia())}>
            <Plus className="h-4 w-4" /> Adicionar questão
          </Button>

          <Button type="submit" disabled={criar.isPending} className="w-full">
            {criar.isPending ? "Salvando..." : "Salvar quiz"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
