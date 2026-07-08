import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { registroSchema, type RegistroFormValues } from "@/features/auth/schemas/authSchemas";

export default function RegistroPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues>({ resolver: zodResolver(registroSchema) });

  async function onSubmit(data: RegistroFormValues) {
    setErroServidor(null);
    try {
      await registrar({ nome: data.nome, email: data.email, senha: data.senha });
      navigate("/", { replace: true });
    } catch {
      setErroServidor("Não foi possível criar sua conta. Esse e-mail já pode estar em uso.");
    }
  }

  return (
    <AuthLayout titulo="Vamos começar juntas!" subtitulo="Crie sua conta e conheça a Leia">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Nome" htmlFor="nome" error={errors.nome?.message}>
          <Input id="nome" placeholder="Como a Leia vai te chamar?" {...register("nome")} />
        </FormField>

        <FormField label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
        </FormField>

        <FormField label="Senha" htmlFor="senha" error={errors.senha?.message}>
          <Input id="senha" type="password" placeholder="Mínimo de 8 caracteres" {...register("senha")} />
        </FormField>

        <FormField label="Confirmar senha" htmlFor="confirmarSenha" error={errors.confirmarSenha?.message}>
          <Input id="confirmarSenha" type="password" placeholder="••••••••" {...register("confirmarSenha")} />
        </FormField>

        {erroServidor && <p className="text-xs font-medium text-danger-500">{erroServidor}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
