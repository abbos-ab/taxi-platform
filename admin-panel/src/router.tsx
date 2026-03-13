import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { RidesListPage } from './pages/rides/RidesListPage';
import { RideDetailPage } from './pages/rides/RideDetailPage';
import { DriversListPage } from './pages/drivers/DriversListPage';
import { DriverDetailPage } from './pages/drivers/DriverDetailPage';
import { PassengersListPage } from './pages/passengers/PassengersListPage';
import { PricingPage } from './pages/pricing/PricingPage';
import { LiveMapPage } from './pages/live-map/LiveMapPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const ProtectedRoute = () => {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'rides', element: <RidesListPage /> },
      { path: 'rides/:id', element: <RideDetailPage /> },
      { path: 'drivers', element: <DriversListPage /> },
      { path: 'drivers/:id', element: <DriverDetailPage /> },
      { path: 'passengers', element: <PassengersListPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'live-map', element: <LiveMapPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
