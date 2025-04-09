import axios from 'axios';
import auth from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get current user token
const getAuthHeader = () => {
  const user = auth.getCurrentUser();
  return user ? { 'x-auth-token': user.token } : {};
};

const api = {
  // Auth endpoints
  login: (email, password) => {
    return axios.post(`${API_URL}/auth/login`, { email, password });
  },
  register: (username, email, password, role) => {
    return axios.post(`${API_URL}/auth/register`, { username, email, password, role });
  },

  // Quiz endpoints
  getQuizzes: () => {
    return axios.get(`${API_URL}/quiz`);
  },
  getQuiz: (id) => {
    return axios.get(`${API_URL}/quiz/${id}`);
  },
  getQuestions: (quizId) => {
    return axios.get(`${API_URL}/question/${quizId}`);
  },
  submitQuiz: (quizId, answers) => {
    return axios.post(`${API_URL}/result`, { quizId, answers }, {
      headers: getAuthHeader()
    });
  },

  // Admin Quiz endpoints
  getAdminQuizzes: () => {
    return axios.get(`${API_URL}/admin/quizzes`, {
      headers: getAuthHeader()
    });
  },
  addQuiz: (quizData) => {
    return axios.post(`${API_URL}/admin/quiz`, quizData, {
      headers: getAuthHeader()
    });
  },
  updateQuiz: (quizId, quizData) => {
    return axios.put(`${API_URL}/admin/quiz/${quizId}`, quizData, {
      headers: getAuthHeader()
    });
  },
  deleteQuiz: (quizId) => {
    return axios.delete(`${API_URL}/admin/quiz/${quizId}`, {
      headers: getAuthHeader()
    });
  },
  publishQuiz: (quizId, publish) => {
    return axios.put(`${API_URL}/admin/quiz/${quizId}/publish`, { publish }, {
      headers: getAuthHeader()
    });
  },

  // Question endpoints
  addQuestion: (questionData) => {
    return axios.post(`${API_URL}/admin/question`, questionData, {
      headers: getAuthHeader()
    });
  },
  updateQuestion: (questionId, questionData) => {
    return axios.put(`${API_URL}/admin/question/${questionId}`, questionData, {
      headers: getAuthHeader()
    });
  },
  deleteQuestion: (questionId) => {
    return axios.delete(`${API_URL}/admin/question/${questionId}`, {
      headers: getAuthHeader()
    });
  },

  // User management endpoints
  getUsers: () => {
    return axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader()
    });
  },
  getUser: (userId) => {
    return axios.get(`${API_URL}/admin/user/${userId}`, {
      headers: getAuthHeader()
    });
  },
  updateUser: (userId, userData) => {
    return axios.put(`${API_URL}/admin/user/${userId}`, userData, {
      headers: getAuthHeader()
    });
  },
  updateUserStatus: (userId, isActive) => {
    return axios.put(`${API_URL}/admin/user/${userId}/status`, { isActive }, {
      headers: getAuthHeader()
    });
  },
  deleteUser: (userId) => {
    return axios.delete(`${API_URL}/admin/user/${userId}`, {
      headers: getAuthHeader()
    });
  },

  // Results endpoints
  getResults: () => {
    return axios.get(`${API_URL}/results`, {
      headers: getAuthHeader()
    });
  },
  getUserResults: (userId) => {
    return axios.get(`${API_URL}/results/user/${userId}`, {
      headers: getAuthHeader()
    });
  },
  getQuizResults: (quizId) => {
    return axios.get(`${API_URL}/results/quiz/${quizId}`, {
      headers: getAuthHeader()
    });
  }
};

export default api;