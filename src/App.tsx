import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/components/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
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
