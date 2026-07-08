import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/authSchemas";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormValues) {
    setErroServidor(null);
    try {
      await login(data);
      navigate("/", { replace: true });
    } catch {
      setErroServidor("E-mail ou senha incorretos. Tenta de novo?");
    }
  }

  return (
    <AuthLayout titulo="Que bom te ver de novo!" subtitulo="A Leia sentiu sua falta 🐾">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
        </FormField>

        <FormField label="Senha" htmlFor="senha" error={errors.senha?.message}>
          <Input id="senha" type="password" placeholder="••••••••" {...register("senha")} />
        </FormField>

        {erroServidor && <p className="text-xs font-medium text-danger-500">{erroServidor}</p>}

        <div className="flex justify-end">
          <Link to="/esqueci-senha" className="text-xs font-medium text-brand-600 hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ainda não tem conta?{" "}
        <Link to="/registro" className="font-semibold text-brand-600 hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}
