import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@shared/model';
import { LoadingDots } from '@shared/ui';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function confirm() {
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();
      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated) {
        navigate('/', { replace: true });
      } else {
        setFailed(true);
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    }
    void confirm();
  }, [navigate]);

  if (failed) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white">
        <p className="text-sm text-red-500">로그인에 실패했습니다. 잠시 후 이동합니다...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <LoadingDots />
        <p className="text-sm text-[#9ca3af]">로그인 처리 중...</p>
      </div>
    </main>
  );
}
