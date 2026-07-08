import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "@/services/auth";
import { getToken, setToken, clearToken } from "@/services/api";
import type { LoginRequest, RegistroRequest, PerfilResponse } from "@/types/auth";

interface AuthContextValue {
  usuario: PerfilResponse | null;
  carregando: boolean;
  autenticado: boolean;
  login: (data: LoginRequest) => Promise<void>;
  registrar: (data: RegistroRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<PerfilResponse | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCarregando(false);
      return;
    }
    authService
      .perfil()
      .then(setUsuario)
      .catch(() => clearToken())
      .finally(() => setCarregando(false));
  }, []);

  async function login(data: LoginRequest) {
    const resposta = await authService.login(data);
    setToken(resposta.token);
    const perfil = await authService.perfil();
    setUsuario(perfil);
  }

  async function registrar(data: RegistroRequest) {
    const resposta = await authService.registro(data);
    setToken(resposta.token);
    const perfil = await authService.perfil();
    setUsuario(perfil);
  }

  function logout() {
    clearToken();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, carregando, autenticado: !!usuario, login, registrar, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
