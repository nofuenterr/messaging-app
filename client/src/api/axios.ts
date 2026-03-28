import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  withCredentials: true, // important for cookies (JWT)
});

// Optional: interceptors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // handle logout / redirect
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);
