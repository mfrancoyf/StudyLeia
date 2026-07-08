import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";
import { missionsService } from "@/services/missions";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.obter,
  });
}

export function useDailyMissions() {
  return useQuery({
    queryKey: ["missions", "hoje"],
    queryFn: missionsService.hoje,
  });
}
