import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import { MainLayout } from '@widgets/main-layout';
import { HomePage } from '@pages/home';
import { LoginPage } from '@pages/login';
import { NotFoundPage } from '@pages/not-found';
import { OAuthCallbackPage } from '@pages/oauth-callback';
import { RoomPage } from '@pages/room';
import { RoomCreatePage } from '@pages/room-create';
import { DiaryDetailPage } from '@pages/diary-detail';
import { DiaryWritePage } from '@pages/diary-write';
import { SettingsPage } from '@pages/settings';
import { useAuthStore } from '@shared/model';
import { AsyncBoundary, SuspenseFallback } from '@shared/ui';

const LoadingScreen = () => (
  <main className="min-h-dvh bg-white">
    <SuspenseFallback variant="screen" />
  </main>
);

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default function AppRouter() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const location = useLocation();

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  return (
    <AsyncBoundary
      fallbackVariant="screen"
      errorVariant="screen"
      resetKeys={[location.pathname, location.search]}
    >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="rooms/new" element={<RoomCreatePage />} />
            <Route path="rooms/:roomId" element={<RoomPage />} />
            <Route path="rooms/:roomId/diaries/new" element={<DiaryWritePage />} />
            <Route path="rooms/:roomId/diaries/:diaryId/edit" element={<DiaryWritePage />} />
            <Route path="rooms/:roomId/diaries/:diaryId" element={<DiaryDetailPage />} />
          </Route>
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AsyncBoundary>
  );
}
