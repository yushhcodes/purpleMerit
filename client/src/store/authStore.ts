import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types/user';
import { authApi } from '../api/authApi';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { accessToken, user } = await authApi.login(email, password);
          set({ accessToken, user, loading: false });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        set({ user: null, accessToken: null });
      },

      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: 'auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);