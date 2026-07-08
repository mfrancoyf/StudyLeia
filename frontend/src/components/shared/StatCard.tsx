import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: "brand" | "accent" | "xp" | "success";
  className?: string;
}

const ACCENTS = {
  brand: "bg-brand-100 text-brand-700",
  accent: "bg-accent-500/15 text-accent-500",
  xp: "bg-xp-500/15 text-amber-600",
  success: "bg-success-500/15 text-success-500",
};

export function StatCard({ icon, label, value, accent = "brand", className }: StatCardProps) {
  return (
    <Card className={cn("flex items-center gap-4 p-4", className)}>
      <CardContent className="flex items-center gap-4 p-0">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", ACCENTS[accent])}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
