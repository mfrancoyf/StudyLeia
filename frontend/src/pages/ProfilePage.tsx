import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  nomeDaPet: z.string().min(1, "Dê um nome pra sua gata"),
});
type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { usuario } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (usuario) reset({ nome: usuario.nome, nomeDaPet: usuario.nomeDaPet });
  }, [usuario, reset]);

  async function onSubmit(data: FormValues) {
    try {
      await authService.atualizarPerfil(data);
      toast({ title: "Perfil atualizado!" });
    } catch {
      toast({ title: "Não foi possível salvar" });
    }
  }

  const iniciais = usuario?.nome?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <User className="h-6 w-6 text-brand-600" /> Perfil
        </h1>
        <p className="text-slate-500">Seus dados e o nome da sua companheira de estudos.</p>
      </div>

      <Card className="max-w-md">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">{iniciais}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-800">{usuario?.nome}</p>
              <p className="text-sm text-slate-500">{usuario?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField label="Nome" htmlFor="nome" error={errors.nome?.message}>
              <Input id="nome" {...register("nome")} />
            </FormField>
            <FormField label="Nome da sua gata" htmlFor="nomeDaPet" error={errors.nomeDaPet?.message}>
              <Input id="nomeDaPet" {...register("nomeDaPet")} />
            </FormField>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
