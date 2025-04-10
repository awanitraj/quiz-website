import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  People as PeopleIcon,
  Quiz as QuizIcon,
  EmojiEvents as ResultsIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';
import { useQuiz, useAuth } from '../../context';
import { Alert, Loader } from '../../ui';
import { BarChart, PieChart } from '../../components/Charts';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    quizzes, 
    quizResults, 
    loading, 
    error,
    fetchQuizzes,
    fetchQuizResults 
  } = useQuiz();
  
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    growthRate: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await Promise.all([
          fetchQuizzes(),
          fetchQuizResults()
        ]);
        
        // In a real app, you would get these from your API
        const dashboardStats = {
          totalUsers: 1245,
          totalQuizzes: quizzes?.length || 0,
          totalAttempts: quizResults?.length || 0,
          growthRate: calculateGrowthRate()
        };
        
        setStats(dashboardStats);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const calculateGrowthRate = () => {
    // Mock growth calculation - replace with real data
    return quizzes?.length > 0 
      ? Math.round(((quizzes.length - 10) / 10) * 100) 
      : 0;
  };

  const getTopQuizzes = () => {
    if (!quizResults || quizResults.length === 0) return [];
    
    // Count attempts per quiz
    const quizAttempts = {};
    quizResults.forEach(result => {
      quizAttempts[result.quizId] = (quizAttempts[result.quizId] || 0) + 1;
    });
    
    // Sort by attempts
    return Object.entries(quizAttempts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([quizId, attempts]) => {
        const quiz = quizzes.find(q => q._id === quizId);
        return {
          name: quiz?.title || 'Deleted Quiz',
          attempts
        };
      });
  };

  const getPerformanceData = () => {
    // Mock performance data - replace with real data
    return [
      { name: 'Mon', score: 65 },
      { name: 'Tue', score: 72 },
      { name: 'Wed', score: 80 },
      { name: 'Thu', score: 68 },
      { name: 'Fri', score: 85 },
      { name: 'Sat', score: 75 },
      { name: 'Sun', score: 90 }
    ];
  };

  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Loader fullPage text="Verifying admin access..." />
      </Box>
    );
  }

  if (loading.quizzes || loading.results) {
    return <Loader fullPage />;
  }

  if (error) {
    return <Alert severity="error" message={error} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" component="h2">
          Dashboard Overview
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <PeopleIcon color="primary" />
              </Box>
              <Typography variant="h4">{stats.totalUsers}</Typography>
              <Typography variant="body2" color="textSecondary">
                Registered users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Quizzes
                </Typography>
                <QuizIcon color="primary" />
              </Box>
              <Typography variant="h4">{stats.totalQuizzes}</Typography>
              <Typography variant="body2" color="textSecondary">
                Available quizzes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary" gutterBottom>
                  Quiz Attempts
                </Typography>
                <ResultsIcon color="primary" />
              </Box>
              <Typography variant="h4">{stats.totalAttempts}</Typography>
              <Typography variant="body2" color="textSecondary">
                This {timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : 'year'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="textSecondary" gutterBottom>
                  Growth Rate
                </Typography>
                <GrowthIcon color={stats.growthRate >= 0 ? 'success' : 'error'} />
              </Box>
              <Typography 
                variant="h4" 
                color={stats.growthRate >= 0 ? 'success.main' : 'error.main'}
              >
                {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Since last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quiz Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <BarChart data={getPerformanceData()} />
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Quizzes
            </Typography>
            <Box sx={{ height: 300 }}>
              {getTopQuizzes().length > 0 ? (
                <PieChart data={getTopQuizzes()} />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%'
                }}>
                  <Typography color="textSecondary">
                    No quiz attempts yet
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;