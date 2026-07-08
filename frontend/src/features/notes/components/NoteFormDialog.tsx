import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCriarNota, useAtualizarNota } from "@/features/notes/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";
import type { NoteResponse } from "@/types/notes";

const schema = z.object({
  titulo: z.string().min(1, "Dê um título").max(200),
  conteudo: z.string().min(1, "Escreva algo"),
  categoria: z.string().max(80).optional(),
  tagsTexto: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface NoteFormDialogProps {
  nota?: NoteResponse;
}

/** Um único diálogo serve tanto para criar quanto para editar (se `nota` for passada). */
export function NoteFormDialog({ nota }: NoteFormDialogProps) {
  const [aberto, setAberto] = useState(false);
  const criar = useCriarNota();
  const atualizar = useAtualizarNota(nota?.id ?? "");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (aberto) {
      reset({
        titulo: nota?.titulo ?? "",
        conteudo: nota?.conteudo ?? "",
        categoria: nota?.categoria ?? "",
        tagsTexto: nota?.tags.join(", ") ?? "",
      });
    }
  }, [aberto, nota, reset]);

  async function onSubmit(data: FormValues) {
    const payload = {
      titulo: data.titulo,
      conteudo: data.conteudo,
      categoria: data.categoria ?? "",
      tags: data.tagsTexto ? data.tagsTexto.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    try {
      if (nota) {
        await atualizar.mutateAsync(payload);
        toast({ title: "Anotação atualizada" });
      } else {
        await criar.mutateAsync(payload);
        toast({ title: "Anotação criada" });
      }
      setAberto(false);
    } catch {
      toast({ title: "Não foi possível salvar" });
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        {nota ? (
          <button className="text-slate-400 hover:text-brand-600">
            <Pencil className="h-4 w-4" />
          </button>
        ) : (
          <Button size="sm">
            <Plus className="h-4 w-4" /> Nova anotação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nota ? "Editar anotação" : "Nova anotação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Título" htmlFor="titulo" error={errors.titulo?.message}>
            <Input id="titulo" {...register("titulo")} />
          </FormField>
          <FormField label="Categoria" htmlFor="categoria">
            <Input id="categoria" placeholder="Ex: Cálculo" {...register("categoria")} />
          </FormField>
          <FormField label="Conteúdo" htmlFor="conteudo" error={errors.conteudo?.message}>
            <Textarea id="conteudo" rows={6} {...register("conteudo")} />
          </FormField>
          <FormField label="Tags (separadas por vírgula)" htmlFor="tagsTexto">
            <Input id="tagsTexto" placeholder="prova, revisão" {...register("tagsTexto")} />
          </FormField>
          <Button type="submit" disabled={criar.isPending || atualizar.isPending} className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
