import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-4 lg:p-6">
      <div className="mx-auto max-w-4xl pt-10">
        <div className="flex items-center gap-3 mb-6">
          <Bell size={24} className="text-[var(--accent)]" />
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Уведомления</h1>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-foreground)]">
          Здесь будут ваши уведомления
        </div>
      </div>
    </div>
  );
}
