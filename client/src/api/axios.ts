import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(api(original)));
        });
      }
      original._retry = true;
      refreshing = true;
      try {
        const { data } = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        useAuthStore.getState().setAccessToken(data.accessToken);
        queue.forEach((fn) => fn());
        queue = [];
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default api;
