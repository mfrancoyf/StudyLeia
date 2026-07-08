import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Envolve as rotas que exigem sessão ativa. Enquanto o perfil ainda
 * está sendo carregado (checagem do token na primeira renderização),
 * não redireciona — evita um "flash" de tela de login para quem já
 * está autenticado.
 */
export function ProtectedRoute() {
  const { autenticado, carregando } = useAuth();

  if (carregando) return null;
  if (!autenticado) return <Navigate to="/login" replace />;

  return <Outlet />;
}
