import { LayoutDashboard } from "lucide-react";

export function DashboardPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard size={24} className="text-[var(--color-accent)]" />
        <h1 className="text-2xl font-bold">Дашборд</h1>
      </div>
      <div className="rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] p-8 text-center text-[var(--color-muted-foreground)]">
        Здесь будет статистика и обзор системы
      </div>
    </div>
  );
}
