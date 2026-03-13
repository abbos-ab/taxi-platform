import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './pages/auth/AuthPage';
import { OTPPage } from './pages/auth/OTPPage';
import { HomePage } from './pages/home/HomePage';
import { OrderPage } from './pages/ride/OrderPage';
import { SearchingPage } from './pages/ride/SearchingPage';
import { RidePage } from './pages/ride/RidePage';
import { RatingPage } from './pages/ride/RatingPage';
import { HistoryPage } from './pages/history/HistoryPage';
import { ChatPage } from './pages/chat/ChatPage';
import { ProfilePage } from './pages/profile/ProfilePage';

const ProtectedRoute = () => {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? (
    <AppLayout />
  ) : (
    <Navigate to="/auth" />
  );
};

const PublicRoute = () => {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? <Navigate to="/" /> : <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: 'otp', element: <OTPPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'order', element: <OrderPage /> },
      { path: 'searching', element: <SearchingPage /> },
      { path: 'ride/:id', element: <RidePage /> },
      { path: 'ride/:id/rate', element: <RatingPage /> },
      { path: 'ride/:id/chat', element: <ChatPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
