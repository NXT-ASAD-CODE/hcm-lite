import axios from 'axios';
import { getToken } from './session';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
});

// Attach the login token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any error into a message a person can read
export function errorMessage(err) {
  const apiError = err?.response?.data?.error;
  if (apiError) {
    if (Array.isArray(apiError.details) && apiError.details.length > 0) {
      return apiError.details
        .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
        .join(' · ');
    }
    return apiError.message || 'Request failed';
  }
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') {
    return 'Cannot reach the server. Check that the backend is running and try again.';
  }
  return err?.message || 'Something went wrong';
}

export default api;
