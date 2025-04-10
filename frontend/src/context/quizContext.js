import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './authContext';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    quizzes: false,
    featured: false,
    recommended: false,
    categories: false
  });
  const [error, setError] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  // Fetch all quizzes
  const fetchQuizzes = useCallback(async () => {
    setLoading(prev => ({ ...prev, quizzes: true }));
    setError(null);
    try {
      const response = await api.getQuizzes();
      setQuizzes(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(prev => ({ ...prev, quizzes: false }));
    }
  }, []);

  // Fetch featured quizzes
  const fetchFeaturedQuizzes = useCallback(async () => {
    setLoading(prev => ({ ...prev, featured: true }));
    try {
      const response = await api.getFeaturedQuizzes();
      setFeaturedQuizzes(response.data);
    } catch (err) {
      console.error('Failed to fetch featured quizzes:', err);
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  }, []);

  // Fetch recommended quizzes
  const fetchRecommendedQuizzes = useCallback(async () => {
    if (!user) return;
    setLoading(prev => ({ ...prev, recommended: true }));
    try {
      const response = await api.getRecommendedQuizzes(user.id);
      setRecommendedQuizzes(response.data);
    } catch (err) {
      console.error('Failed to fetch recommended quizzes:', err);
    } finally {
      setLoading(prev => ({ ...prev, recommended: false }));
    }
  }, [user]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const response = await api.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  // Get single quiz by ID
  const getQuizById = useCallback(async (id) => {
    try {
      const response = await api.getQuiz(id);
      setCurrentQuiz(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch quiz');
      throw err;
    }
  }, []);

  // Submit quiz answers
  const submitQuiz = useCallback(async (quizId, answers) => {
    try {
      const response = await api.submitQuiz(quizId, answers);
      setQuizResults(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to submit quiz');
      throw err;
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchQuizzes(),
        fetchFeaturedQuizzes(),
        fetchRecommendedQuizzes(),
        fetchCategories()
      ]);
    };
    initializeData();
  }, [fetchQuizzes, fetchFeaturedQuizzes, fetchRecommendedQuizzes, fetchCategories]);

  // Context value
  const value = {
    quizzes,
    featuredQuizzes,
    recommendedQuizzes,
    categories,
    currentQuiz,
    quizResults,
    loading,
    error,
    fetchQuizzes,
    fetchFeaturedQuizzes,
    fetchRecommendedQuizzes,
    getQuizById,
    submitQuiz,
    setError
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for easy consumption
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export default QuizContext;