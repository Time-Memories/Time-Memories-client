import { create } from 'zustand';

import { ENDPOINTS, getMe, http } from '@shared/api';
import type { MeResponse } from '@shared/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MeResponse | null;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  checkAuth: async () => {
    try {
      const user = await getMe();
      set({ isAuthenticated: true, isLoading: false, user });
    } catch {
      set({ isAuthenticated: false, isLoading: false, user: null });
    }
  },

  logout: () => {
    void http.post(ENDPOINTS.auth.logout).catch(() => {});
    set({ isAuthenticated: false, user: null });
  },
}));
