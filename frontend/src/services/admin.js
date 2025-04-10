import api from './api';

const adminService = {
  // Quiz Management
  createQuiz: async (quizData) => {
    try {
      const response = await api.post('/admin/quiz', quizData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateQuiz: async (quizId, quizData) => {
    try {
      const response = await api.put(`/admin/quiz/${quizId}`, quizData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  deleteQuiz: async (quizId) => {
    try {
      const response = await api.delete(`/admin/quiz/${quizId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  publishQuiz: async (quizId, publish) => {
    try {
      const response = await api.put(`/admin/quiz/${quizId}/publish`, { publish });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Question Management
  createQuestion: async (questionData) => {
    try {
      const response = await api.post('/admin/question', questionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await api.put(`/admin/question/${questionId}`, questionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  deleteQuestion: async (questionId) => {
    try {
      const response = await api.delete(`/admin/question/${questionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // User Management
  getUsers: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/admin/users', {
        params: { page, limit }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getUser: async (userId) => {
    try {
      const response = await api.get(`/admin/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/user/${userId}`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/user/${userId}/status`, { isActive });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  // Analytics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getQuizAnalytics: async (quizId) => {
    try {
      const response = await api.get(`/admin/analytics/quiz/${quizId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getUserActivity: async (userId) => {
    try {
      const response = await api.get(`/admin/analytics/user/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
};

export default adminService;