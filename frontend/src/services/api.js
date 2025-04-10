import axios from 'axios';
import auth from './auth';

// Configure axios defaults
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const user = auth.getCurrentUser();
    if (user?.token) {
      config.headers['x-auth-token'] = user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Auto logout if 401 response returned from API
          auth.logout();
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden access
          console.error('Forbidden access:', error.config.url);
          break;
        case 404:
          console.error('Endpoint not found:', error.config.url);
          break;
        case 500:
          console.error('Server error:', error.config.url);
          break;
        default:
          console.error('Unhandled error:', error);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API responses consistently
const handleResponse = (response) => {
  return {
    success: true,
    data: response.data,
    status: response.status
  };
};

const handleError = (error) => {
  return {
    success: false,
    message: error.response?.data?.message || error.message,
    status: error.response?.status,
    error: error.response?.data
  };
};

const apiService = {
  // Auth endpoints
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  register: async (username, email, password, role) => {
    try {
      const response = await api.post('/auth/register', { username, email, password, role });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Quiz endpoints
  getQuizzes: async () => {
    try {
      const response = await api.get('/quiz');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getQuiz: async (id) => {
    try {
      const response = await api.get(`/quiz/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ... (similar pattern for all other endpoints)

  // Admin endpoints
  getAdminQuizzes: async () => {
    try {
      const response = await api.get('/admin/quizzes');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  addQuiz: async (quizData) => {
    try {
      const response = await api.post('/admin/quiz', quizData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // ... (similar pattern for all other admin endpoints)

  // Results endpoints
  getResults: async () => {
    try {
      const response = await api.get('/results');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export default apiService;