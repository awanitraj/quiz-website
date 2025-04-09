import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import QuizCard from './QuizCard';
import api from '../../services/api';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.getQuizzes();
        setQuizzes(response.data);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Typography align="center" mt={4}>
        No quizzes available yet.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {quizzes.map(quiz => (
        <Grid item xs={12} sm={6} md={4} key={quiz._id}>
          <QuizCard quiz={quiz} />
        </Grid>
      ))}
    </Grid>
  );
};

export default QuizList;