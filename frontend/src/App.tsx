import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { LeiaReactionProvider } from "@/contexts/LeiaReactionContext";
import { ToastContextProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/shared/Toaster";
import { AppRouter } from "@/routes/AppRouter";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LeiaReactionProvider>
          <ToastContextProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
            <Toaster />
          </ToastContextProvider>
        </LeiaReactionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
