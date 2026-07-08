import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { usuario, logout } = useAuth();
  const iniciais = usuario?.nome?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <header className="flex items-center justify-between border-b border-brand-100 bg-white/80 px-6 py-3.5 backdrop-blur">
      <Link to="/" className="text-lg font-bold text-brand-700">
        StudyLeia
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pr-1 outline-none">
          <span className="hidden text-sm font-medium text-slate-600 sm:inline">
            {usuario?.nome ?? "..."}
          </span>
          <Avatar>
            <AvatarFallback>{iniciais}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/perfil">
              <User className="h-4 w-4" /> Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
