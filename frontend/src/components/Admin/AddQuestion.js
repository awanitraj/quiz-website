import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Paper, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { CircularProgress } from '@mui/material';

const AddQuestion = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.getQuiz(quizId);
        setQuiz(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const validationSchema = Yup.object({
    questionText: Yup.string().required('Question text is required'),
    options: Yup.array()
      .of(Yup.string().required('Option is required'))
      .min(2, 'At least 2 options required')
      .max(4, 'Maximum 4 options allowed'),
    correctAnswer: Yup.string().required('Correct answer is required'),
    points: Yup.number()
      .min(1, 'Minimum 1 point')
      .required('Points are required')
  });

  const formik = useFormik({
    initialValues: {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        // Filter out empty options
        const filteredOptions = values.options.filter(option => option.trim() !== '');
        await api.addQuestion({
          quizId,
          questionText: values.questionText,
          options: filteredOptions,
          correctAnswer: values.correctAnswer,
          points: values.points
        });
        navigate('/admin');
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  });

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
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add Question to: {quiz.title}
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="questionText"
            name="questionText"
            label="Question Text"
            margin="normal"
            multiline
            rows={3}
            value={formik.values.questionText}
            onChange={formik.handleChange}
            error={formik.touched.questionText && Boolean(formik.errors.questionText)}
            helperText={formik.touched.questionText && formik.errors.questionText}
          />
          
          <Typography variant="h6" sx={{ mt: 3 }}>
            Options
          </Typography>
          
          {[0, 1, 2, 3].map((index) => (
            <TextField
              key={index}
              fullWidth
              id={`options[${index}]`}
              name={`options[${index}]`}
              label={`Option ${index + 1}`}
              margin="normal"
              value={formik.values.options[index]}
              onChange={formik.handleChange}
              error={
                formik.touched.options && 
                formik.touched.options[index] && 
                Boolean(formik.errors.options?.[index])
              }
              helperText={
                formik.touched.options && 
                formik.touched.options[index] && 
                formik.errors.options?.[index]
              }
            />
          ))}
          
          <FormControl component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">Correct Answer</FormLabel>
            <RadioGroup
              name="correctAnswer"
              value={formik.values.correctAnswer}
              onChange={formik.handleChange}
            >
              {formik.values.options.map((option, index) => (
                option.trim() !== '' && (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={`Option ${index + 1}`}
                  />
                )
              ))}
            </RadioGroup>
            {formik.touched.correctAnswer && formik.errors.correctAnswer && (
              <Typography color="error" variant="body2">
                {formik.errors.correctAnswer}
              </Typography>
            )}
          </FormControl>
          
          <TextField
            fullWidth
            id="points"
            name="points"
            label="Points"
            type="number"
            margin="normal"
            value={formik.values.points}
            onChange={formik.handleChange}
            error={formik.touched.points && Boolean(formik.errors.points)}
            helperText={formik.touched.points && formik.errors.points}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ mt: 3 }}
          >
            {submitting ? 'Adding...' : 'Add Question'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddQuestion;