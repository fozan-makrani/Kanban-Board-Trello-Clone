import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Normalize error responses so components don't need to know
// the difference between "server responded with an error" vs
// "request never reached the server" (network down, CORS, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request ? 'Unable to reach the server. Is the backend running?' : error.message);
    return Promise.reject(new Error(message));
  }
);

export default api;
