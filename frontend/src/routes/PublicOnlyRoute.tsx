import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/** Impede que quem já está logada volte para login/registro/recuperação. */
export function PublicOnlyRoute() {
  const { autenticado, carregando } = useAuth();

  if (carregando) return null;
  if (autenticado) return <Navigate to="/" replace />;

  return <Outlet />;
}
