import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const AddQuiz = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    timeLimit: Yup.number()
      .min(1, 'Must be at least 1 minute')
      .required('Time limit is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      timeLimit: 10
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        await api.addQuiz(values);
        navigate('/admin');
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Quiz
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Quiz Title"
            margin="normal"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            margin="normal"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            fullWidth
            id="timeLimit"
            name="timeLimit"
            label="Time Limit (minutes)"
            type="number"
            margin="normal"
            value={formik.values.timeLimit}
            onChange={formik.handleChange}
            error={formik.touched.timeLimit && Boolean(formik.errors.timeLimit)}
            helperText={formik.touched.timeLimit && formik.errors.timeLimit}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ mt: 3 }}
          >
            {submitting ? 'Creating...' : 'Create Quiz'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddQuiz;