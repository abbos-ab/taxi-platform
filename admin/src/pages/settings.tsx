import { Settings } from "lucide-react";

export function SettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings size={24} className="text-[var(--color-accent)]" />
        <h1 className="text-2xl font-bold">Настройки</h1>
      </div>
      <div className="rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] p-8 text-center text-[var(--color-muted-foreground)]">
        Здесь будут настройки системы
      </div>
    </div>
  );
}
