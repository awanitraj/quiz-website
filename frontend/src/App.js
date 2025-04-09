import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, CircularProgress } from '@mui/material';

// Import Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import QuizDetail from './components/Quiz/QuizDetail';
import TakeQuiz from './components/Quiz/TakeQuiz';
import AdminDashboard from './components/Admin/AdminDashboard';
import QuizManagement from './components/Admin/QuizManagement';
import UserManagement from './components/Admin/UserManagement';
import AddQuiz from './components/Admin/AddQuiz';
import AddQuestion from './components/Admin/AddQuestion';
import PrivateRoute from './components/Layout/PrivateRoute';
import AdminRoute from './components/Layout/AdminRoute';
import { AuthProvider } from './context/authContext';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}>
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content */}
        <Container 
          component="main" 
          maxWidth="xl"
          sx={{ 
            flex: 1, 
            py: 4,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/quiz/:id" element={<QuizDetail />} />
            
            {/* Protected Routes */}
            <Route path="/take-quiz/:id" element={
              <PrivateRoute>
                <TakeQuiz />
              </PrivateRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/quizzes" element={
              <AdminRoute>
                <QuizManagement />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/add-quiz" element={
              <AdminRoute>
                <AddQuiz />
              </AdminRoute>
            } />
            <Route path="/admin/add-question/:quizId" element={
              <AdminRoute>
                <AddQuestion />
              </AdminRoute>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={
              <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h3">404 - Page Not Found</Typography>
              </Box>
            } />
          </Routes>
        </Container>
        
        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;