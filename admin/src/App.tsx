import { Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardPage } from "@/pages/dashboard";
import { OrdersPage } from "@/pages/orders";
import { DriversPage } from "@/pages/drivers";
import { ClientsPage } from "@/pages/clients";
import { FleetPage } from "@/pages/fleet";
import { TariffsPage } from "@/pages/tariffs";
import { PromosPage } from "@/pages/promos";
import { ReportsPage } from "@/pages/reports";
import { MapPage } from "@/pages/map";
import { SettingsPage } from "@/pages/settings";

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[var(--sidebar-width)] p-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/tariffs" element={<TariffsPage />} />
          <Route path="/promos" element={<PromosPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
