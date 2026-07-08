import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AppLayout } from "@/layouts/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";

// Cada página é carregada sob demanda (code-splitting por rota) —
// com 20+ telas, carregar tudo de uma vez no primeiro load não faz
// sentido. O Suspense abaixo cobre a troca de página com um esqueleto
// simples; os componentes internos de cada página já têm seus
// próprios loading states granulares (via TanStack Query).
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegistroPage = lazy(() => import("@/pages/RegistroPage"));
const EsqueciSenhaPage = lazy(() => import("@/pages/EsqueciSenhaPage"));
const RedefinirSenhaPage = lazy(() => import("@/pages/RedefinirSenhaPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const LeiaPage = lazy(() => import("@/pages/LeiaPage"));
const QuizzesPage = lazy(() => import("@/pages/QuizzesPage"));
const QuizPlayPage = lazy(() => import("@/pages/QuizPlayPage"));
const StudyPlansPage = lazy(() => import("@/pages/StudyPlansPage"));
const StudyPlanDetailPage = lazy(() => import("@/pages/StudyPlanDetailPage"));
const NotesPage = lazy(() => import("@/pages/NotesPage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const FocusPage = lazy(() => import("@/pages/FocusPage"));
const MissionsPage = lazy(() => import("@/pages/MissionsPage"));
const GardenPage = lazy(() => import("@/pages/GardenPage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const StatisticsPage = lazy(() => import("@/pages/StatisticsPage"));
const AchievementsPage = lazy(() => import("@/pages/AchievementsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function CarregandoPagina() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<CarregandoPagina />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
        </Route>
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leia" element={<LeiaPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/quizzes/:id" element={<QuizPlayPage />} />
            <Route path="/study-plans" element={<StudyPlansPage />} />
            <Route path="/study-plans/:id" element={<StudyPlanDetailPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
