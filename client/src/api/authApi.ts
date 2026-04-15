import api from './axios';
import type { AuthUser } from '../types/user';

export const authApi = {
  login: async (email: string, password: string): Promise<{ accessToken: string; user: AuthUser }> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const { data } = await api.post('/auth/refresh');
    return data;
  },
};