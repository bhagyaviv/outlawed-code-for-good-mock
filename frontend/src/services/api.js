import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// ==========================================
// INTERCEPTORS
// ==========================================

// Request Interceptor: Attach token if it exists in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let normalizedError = {
      message: 'Something went wrong. Please try again.',
      status: error.response?.status || 500,
      originalError: error,
    };

    if (!error.response) {
      // Network/Server down error
      normalizedError.message = 'Network error. Please check if backend server is running.';
    } else if (error.response.status === 401) {
      // Unauthorized: clear auth token and redirect to login state locally
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      normalizedError.message = 'Session expired. Please log in again.';
      
      // Optional: force trigger a page reload or state reset depending on router setup
      // window.location.href = '/login';
    } else if (error.response.status === 403) {
      normalizedError.message = 'You do not have permission to perform this action.';
    } else if (error.response.status === 404) {
      normalizedError.message = 'Requested resource not found.';
    } else if (error.response.data?.error?.message) {
      // Use clean backend error message if available
      normalizedError.message = error.response.data.error.message;
    }

    console.error('[API Error Interceptor]:', normalizedError);
    return Promise.reject(normalizedError);
  }
);

export default apiClient;
