import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  CircularProgress, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/authContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState({
    profile: true,
    quizzes: true,
    results: true
  });
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.updateUser(user._id, values);
        updateUser(response.data);
        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        setEditing(false);
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [quizzesRes, resultsRes] = await Promise.all([
          api.getUserQuizzes(user._id),
          api.getUserResults(user._id)
        ]);
        setUserQuizzes(quizzesRes.data);
        setQuizResults(resultsRes.data);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading({ profile: false, quizzes: false, results: false });
      }
    };

    if (user) {
      fetchUserData();
      formik.setValues({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {user.username[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            {editing ? (
              <>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </>
            ) : (
              <>
                <Typography variant="h4">{user.username}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </>
            )}
          </Box>
          <Box>
            {editing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={formik.handleSubmit}
                  sx={{ mr: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* User Content Sections */}
      <Grid container spacing={3}>
        {/* Created Quizzes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Quizzes ({userQuizzes.length})
            </Typography>
            {loading.quizzes ? (
              <CircularProgress />
            ) : (
              <List>
                {userQuizzes.map(quiz => (
                  <React.Fragment key={quiz._id}>
                    <ListItem>
                      <ListItemText
                        primary={quiz.title}
                        secondary={`${quiz.questionsCount} questions - Created ${new Date(quiz.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quiz Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quiz Results ({quizResults.length})
            </Typography>
            {loading.results ? (
              <CircularProgress />
            ) : (
              <List>
                {quizResults.map(result => (
                  <React.Fragment key={result._id}>
                    <ListItem>
                      <ListItemText
                        primary={result.quizTitle}
                        secondary={`Score: ${result.score}/${result.totalQuestions} - Completed ${new Date(result.completedAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;