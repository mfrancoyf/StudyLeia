import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { LeiaWidget } from "@/components/shared/LeiaWidget";

/**
 * Casca visual das telas autenticadas. A Leia (LeiaWidget) fica aqui,
 * no layout raiz — por isso ela aparece em toda página autenticada,
 * não só em /leia.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <LeiaWidget />
    </div>
  );
}
