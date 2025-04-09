import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Card, CardContent, List, ListItem, Divider } from '@mui/material';
import api from '../../services/api';
import AuthContext from '../../context/authContext';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = React.useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.getQuiz(id);
        setQuiz(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleStartQuiz = () => {
    if (isAuthenticated) {
      navigate(`/take-quiz/${id}`);
    } else {
      navigate('/login', { state: { from: `/take-quiz/${id}` } });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Typography variant="h6" color="error" mt={4}>
        Quiz not found
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {quiz.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {quiz.description}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Time Limit: {quiz.timeLimit} minutes
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              size="large"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizDetail;