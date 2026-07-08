import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  senha: z.string().min(1, "Informe sua senha"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registroSchema = z
  .object({
    nome: z.string().min(2, "Nome muito curto"),
    email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
    senha: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });
export type RegistroFormValues = z.infer<typeof registroSchema>;

export const esqueciSenhaSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
});
export type EsqueciSenhaFormValues = z.infer<typeof esqueciSenhaSchema>;
