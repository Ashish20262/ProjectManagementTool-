import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    if (response && response.data && typeof response.data.success === 'boolean') {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || 'API responded with failure'));
      }
      if (!('data' in response.data)) {
        return Promise.reject(new Error('Malformed API response')); 
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
