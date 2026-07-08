export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuarioId: string;
  nome: string;
  email: string;
}

export interface PerfilResponse {
  id: string;
  nome: string;
  email: string;
  nomeDaPet: string;
}

export interface AtualizarPerfilRequest {
  nome: string;
  nomeDaPet: string;
}

export interface EsqueciSenhaRequest {
  email: string;
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
}
