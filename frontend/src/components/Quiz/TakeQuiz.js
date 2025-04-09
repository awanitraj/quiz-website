import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import api from '../../services/api';
import AuthContext from '../../context/authContext';
import { Card, CardContent } from '@mui/material';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizResponse = await api.getQuiz(id);
        const questionsResponse = await api.getQuestions(id);
        setQuiz(quizResponse.data);
        setQuestions(questionsResponse.data);
        setTimeLeft(quizResponse.data.timeLimit * 60); // Convert to seconds
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitQuiz(id, answers);
      navigate('/');
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <Typography variant="h6" color="error" mt={4}>
        Quiz data not available
      </Typography>
    );
  }

  const currentQ = questions[currentQuestion];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h5">
          {quiz.title} - Question {currentQuestion + 1} of {questions.length}
        </Typography>
        <Typography variant="h5">
          Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currentQ.questionText}
          </Typography>
          
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup
              value={answers[currentQ._id] || ''}
              onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
            >
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="contained"
              disabled={currentQuestion === 0}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            
            {currentQuestion < questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TakeQuiz;