import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@/widgets/main-layout';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
