import { create } from 'zustand';

import { ENDPOINTS, getMe, http } from '../api';
import type { GetMeResponseBody } from '../api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GetMeResponseBody | null;
  checkAuth: () => Promise<void>;
  updateUser: (patch: Partial<GetMeResponseBody>) => void;
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

  updateUser: (patch) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...patch } : state.user,
    }));
  },

  logout: () => {
    void http.post(ENDPOINTS.auth.logout).catch(() => {});
    set({ isAuthenticated: false, user: null });
  },
}));
