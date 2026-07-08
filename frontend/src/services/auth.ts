import { api } from "./api";
import type {
  LoginRequest,
  RegistroRequest,
  AuthResponse,
  PerfilResponse,
  AtualizarPerfilRequest,
  EsqueciSenhaRequest,
  RedefinirSenhaRequest,
} from "@/types/auth";

export const authService = {
  registro: (data: RegistroRequest) =>
    api.post<AuthResponse>("/api/auth/registro", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/api/auth/login", data).then((r) => r.data),

  logout: () => api.post("/api/auth/logout"),

  esqueciSenha: (data: EsqueciSenhaRequest) =>
    api.post("/api/auth/esqueci-senha", data),

  redefinirSenha: (data: RedefinirSenhaRequest) =>
    api.post("/api/auth/redefinir-senha", data),

  perfil: () => api.get<PerfilResponse>("/api/auth/perfil").then((r) => r.data),

  atualizarPerfil: (data: AtualizarPerfilRequest) =>
    api.put<PerfilResponse>("/api/auth/perfil", data).then((r) => r.data),
};
