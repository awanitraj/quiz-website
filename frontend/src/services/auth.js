import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Auto logout if 401 response
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || error.message);
  }
);

const authService = {
  register: async (username, email, password, role = 'user') => {
    try {
      const response = await api.post('/register', {
        username,
        email,
        password,
        role
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.token) {
        localStorage.setItem('user', JSON.stringify(response));
        
        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  refreshToken: async () => {
    try {
      const user = this.getCurrentUser();
      if (!user?.token) return null;
      
      const response = await api.post('/refresh-token', {
        token: user.token
      });
      
      if (response.token) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...response
        }));
        return response.token;
      }
    } catch (error) {
      this.logout();
      throw error;
    }
  }
};

// Initialize auth header if user exists
const user = authService.getCurrentUser();
if (user?.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
}

export default authService;