import api from './axios';
import type { User, PaginatedUsers, UserFilters, CreateUserPayload, UpdateUserPayload } from '../types/user';

export const userApi = {
  getUsers: async (filters: UserFilters = {}): Promise<PaginatedUsers> => {
    const { data } = await api.get('/users', { params: filters });
    return data;
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/users/me');
    return data;
  },

  createUser: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await api.post('/users', payload);
    return data;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};