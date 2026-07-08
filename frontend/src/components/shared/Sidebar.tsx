import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Cat,
  BrainCircuit,
  CalendarClock,
  NotebookPen,
  Timer,
  Sprout,
  ShoppingBag,
  BarChart3,
  Trophy,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leia", label: "A Leia", icon: Cat },
  { to: "/quizzes", label: "Quizzes", icon: BrainCircuit },
  { to: "/study-plans", label: "Plano de Estudos", icon: CalendarClock },
  { to: "/notes", label: "Anotações", icon: NotebookPen },
  { to: "/calendar", label: "Calendário", icon: CalendarClock },
  { to: "/focus", label: "Modo Foco", icon: Timer },
  { to: "/missions", label: "Missões", icon: ListChecks },
  { to: "/garden", label: "Jardim", icon: Sprout },
  { to: "/shop", label: "Loja", icon: ShoppingBag },
  { to: "/statistics", label: "Estatísticas", icon: BarChart3 },
  { to: "/achievements", label: "Conquistas", icon: Trophy },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-brand-100 bg-white/70 p-4 backdrop-blur md:flex">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700",
              isActive && "bg-brand-100 text-brand-700"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </aside>
  );
}
