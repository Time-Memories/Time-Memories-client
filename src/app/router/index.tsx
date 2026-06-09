import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@widgets/main-layout';
import { HomePage } from '@pages/home';
import { NotFoundPage } from '@pages/not-found';
import { RoomPage } from '@pages/room';
import { DiaryDetailPage } from '@pages/diary-detail';
import { DiaryWritePage } from '@pages/diary-write';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms/:roomId" element={<RoomPage />} />
        <Route path="rooms/:roomId/diaries/new" element={<DiaryWritePage />} />
        <Route path="rooms/:roomId/diaries/:diaryId" element={<DiaryDetailPage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
