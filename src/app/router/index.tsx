import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@widgets/main-layout';
import { HomePage } from '@pages/home';
import { LoginPage } from '@pages/login';
import { NotFoundPage } from '@pages/not-found';
import { RoomPage } from '@pages/room';
import { RoomCreatePage } from '@pages/room-create';
import { DiaryDetailPage } from '@pages/diary-detail';
import { DiaryWritePage } from '@pages/diary-write';
import { SettingsPage } from '@pages/settings';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="rooms/new" element={<RoomCreatePage />} />
        <Route path="rooms/:roomId" element={<RoomPage />} />
        <Route path="rooms/:roomId/diaries/new" element={<DiaryWritePage />} />
        <Route path="rooms/:roomId/diaries/:diaryId" element={<DiaryDetailPage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
