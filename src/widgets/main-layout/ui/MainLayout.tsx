import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { setUnauthorizedHandler } from '@shared/api';
import { useAuthStore } from '@shared/model';

export default function MainLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      navigate('/login', { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [logout, navigate]);

  return (
    <div className="min-h-svh bg-white dark:bg-white">
      <div
        className="relative mx-auto min-h-svh max-w-120 bg-white"
        style={{
          boxShadow: '0 0 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
