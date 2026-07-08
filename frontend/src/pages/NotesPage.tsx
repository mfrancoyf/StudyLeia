import { NotebookPen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteFormDialog } from "@/features/notes/components/NoteFormDialog";
import { useNotes, useRemoverNota } from "@/features/notes/hooks/useNotes";

export default function NotesPage() {
  const { data: notas, isLoading } = useNotes();
  const remover = useRemoverNota();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Anotações</h1>
          <p className="text-slate-500">Suas notas de estudo, organizadas por categoria e tags.</p>
        </div>
        <NoteFormDialog />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {!isLoading && notas?.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-10 text-center text-slate-500">
          <NotebookPen className="h-8 w-8 text-brand-300" />
          Nenhuma anotação ainda.
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notas?.map((nota) => (
          <Card key={nota.id} className="group flex flex-col gap-2 p-4">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-slate-800">{nota.titulo}</p>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <NoteFormDialog nota={nota} />
                <button onClick={() => remover.mutate(nota.id)} className="text-slate-400 hover:text-danger-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <CardContent className="flex-1 p-0">
              <p className="line-clamp-4 text-sm text-slate-600">{nota.conteudo}</p>
            </CardContent>
            <div className="flex flex-wrap gap-1">
              {nota.categoria && <Badge variant="default">{nota.categoria}</Badge>}
              {nota.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
