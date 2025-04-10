import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import { useAuth, useQuiz } from '../context';
import { 
  AdminDashboard, 
  QuizManagement, 
  UserManagement,
  AddQuiz,
  AddQuestion 
} from '../components/Admin';
import { Alert, Loader } from '../UI';

const AdminPanel = () => {
  const { user } = useAuth();
  const { loading, error, setError } = useQuiz();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/';
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setShowAddQuiz(false);
    setShowAddQuestion(false);
  };

  const handleAddQuizSuccess = () => {
    setShowAddQuiz(false);
    setTabValue(1); // Switch to Quiz Management tab
  };

  const handleAddQuestionSuccess = () => {
    setShowAddQuestion(false);
    setTabValue(1); // Switch to Quiz Management tab
  };

  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Loader fullPage text="Verifying admin access..." />
      </Box>
    );
  }

  if (loading.admin) {
    return <Loader fullPage />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        
        {tabValue === 1 && !showAddQuiz && !showAddQuestion && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddQuiz(true)}
            sx={{ ml: 2 }}
          >
            Add Quiz
          </Button>
        )}
      </Box>

      {error && (
        <Alert 
          severity="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {showAddQuiz ? (
        <AddQuiz 
          onSuccess={handleAddQuizSuccess}
          onCancel={() => setShowAddQuiz(false)}
        />
      ) : showAddQuestion ? (
        <AddQuestion 
          quizId={selectedQuizId}
          onSuccess={handleAddQuestionSuccess}
          onCancel={() => setShowAddQuestion(false)}
        />
      ) : (
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Quiz Management" icon={<QuizIcon />} iconPosition="start" />
            <Tab label="User Management" icon={<PeopleIcon />} iconPosition="start" />
          </Tabs>

          <Box sx={{ pt: 2 }}>
            {tabValue === 0 && <AdminDashboard />}
            {tabValue === 1 && (
              <QuizManagement 
                onAddQuestion={quizId => {
                  setSelectedQuizId(quizId);
                  setShowAddQuestion(true);
                }}
              />
            )}
            {tabValue === 2 && <UserManagement />}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminPanel;import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  People as PeopleIcon,
  Add as AddIcon 
} from '@mui/icons-material';
import { useAuth, useQuiz } from '../context';
import { 
  AdminDashboard, 
  QuizManagement, 
  UserManagement,
  AddQuiz,
  AddQuestion 
} from '../components/Admin';
import { Alert, Loader } from '../ui';

const AdminPanel = () => {
  const { user } = useAuth();
  const { loading, error, setError } = useQuiz();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/';
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setShowAddQuiz(false);
    setShowAddQuestion(false);
  };

  const handleAddQuizSuccess = () => {
    setShowAddQuiz(false);
    setTabValue(1); // Switch to Quiz Management tab
  };

  const handleAddQuestionSuccess = () => {
    setShowAddQuestion(false);
    setTabValue(1); // Switch to Quiz Management tab
  };

  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Loader fullPage text="Verifying admin access..." />
      </Box>
    );
  }

  if (loading.admin) {
    return <Loader fullPage />;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography variant="h4" component="h1">
          Admin Panel
        </Typography>
        
        {tabValue === 1 && !showAddQuiz && !showAddQuestion && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddQuiz(true)}
            sx={{ ml: 2 }}
          >
            Add Quiz
          </Button>
        )}
      </Box>

      {error && (
        <Alert 
          severity="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {showAddQuiz ? (
        <AddQuiz 
          onSuccess={handleAddQuizSuccess}
          onCancel={() => setShowAddQuiz(false)}
        />
      ) : showAddQuestion ? (
        <AddQuestion 
          quizId={selectedQuizId}
          onSuccess={handleAddQuestionSuccess}
          onCancel={() => setShowAddQuestion(false)}
        />
      ) : (
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
            <Tab label="Quiz Management" icon={<QuizIcon />} iconPosition="start" />
            <Tab label="User Management" icon={<PeopleIcon />} iconPosition="start" />
          </Tabs>

          <Box sx={{ pt: 2 }}>
            {tabValue === 0 && <AdminDashboard />}
            {tabValue === 1 && (
              <QuizManagement 
                onAddQuestion={quizId => {
                  setSelectedQuizId(quizId);
                  setShowAddQuestion(true);
                }}
              />
            )}
            {tabValue === 2 && <UserManagement />}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminPanel;