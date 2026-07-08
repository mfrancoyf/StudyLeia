import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import {
  esqueciSenhaSchema,
  type EsqueciSenhaFormValues,
} from "@/features/auth/schemas/authSchemas";

export default function EsqueciSenhaPage() {
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EsqueciSenhaFormValues>({ resolver: zodResolver(esqueciSenhaSchema) });

  async function onSubmit(data: EsqueciSenhaFormValues) {
    // Por segurança, sempre mostramos a mesma confirmação, exista ou
    // não o e-mail na base — evita permitir enumeração de contas.
    try {
      await authService.esqueciSenha(data);
    } finally {
      setEnviado(true);
    }
  }

  if (enviado) {
    return (
      <AuthLayout titulo="Verifique seu e-mail" subtitulo="A Leia já correu pra levar as instruções">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="h-10 w-10 text-success-500" />
          <p className="text-sm text-slate-600">
            Se esse e-mail estiver cadastrado, você vai receber um link para redefinir sua senha em instantes.
          </p>
          <Link to="/login" className="mt-2 text-sm font-semibold text-brand-600 hover:underline">
            Voltar para o login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout titulo="Esqueceu a senha?" subtitulo="Sem problemas, vamos te ajudar">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Lembrou a senha?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Voltar ao login
        </Link>
      </p>
    </AuthLayout>
  );
}
