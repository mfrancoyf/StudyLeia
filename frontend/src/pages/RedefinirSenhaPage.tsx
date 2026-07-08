import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";

const schema = z
  .object({
    novaSenha: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });
type FormValues = z.infer<typeof schema>;

export default function RedefinirSenhaPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();
  const [erro, setErro] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setErro(null);
    try {
      await authService.redefinirSenha({ token, novaSenha: data.novaSenha });
      navigate("/login", { replace: true });
    } catch {
      setErro("Esse link expirou ou é inválido. Peça um novo.");
    }
  }

  if (!token) {
    return (
      <AuthLayout titulo="Link inválido" subtitulo="Não encontramos o token de redefinição">
        <Link to="/esqueci-senha" className="text-sm font-semibold text-brand-600 hover:underline">
          Solicitar um novo link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout titulo="Nova senha" subtitulo="Escolha uma senha forte para sua conta">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Nova senha" htmlFor="novaSenha" error={errors.novaSenha?.message}>
          <Input id="novaSenha" type="password" placeholder="Mínimo de 8 caracteres" {...register("novaSenha")} />
        </FormField>

        <FormField label="Confirmar nova senha" htmlFor="confirmarSenha" error={errors.confirmarSenha?.message}>
          <Input id="confirmarSenha" type="password" placeholder="••••••••" {...register("confirmarSenha")} />
        </FormField>

        {erro && <p className="text-xs font-medium text-danger-500">{erro}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}
