import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment,
  MenuItem,
  Select,
  Chip,
  CircularProgress,
  Pagination,
  Button,
  Skeleton
} from '@mui/material';
import { 
  Search, 
  Sort, 
  FilterAlt, 
  Star, 
  Whatshot,
  ArrowForward
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import QuizCard from '../components/Quiz/QuizCard';
import api from '../services/api';
import { useAuth } from '../context/authContext';

// Safe Carousel component with error boundary
const SafeCarousel = ({ children, ...props }) => {
  try {
    const Carousel = require('react-material-ui-carousel').default;
    return <Carousel {...props}>{children}</Carousel>;
  } catch (e) {
    return <Box sx={{ display: 'flex', overflowX: 'auto' }}>{children}</Box>;
  }
};

const Home = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);
  const [loading, setLoading] = useState({
    main: true,
    featured: true,
    recommended: true
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const quizzesPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          quizzesRes, 
          categoriesRes, 
          featuredRes,
          recommendedRes
        ] = await Promise.all([
          api.getQuizzes(),
          api.getCategories(),
          api.getFeaturedQuizzes(),
          user ? api.getRecommendedQuizzes(user.id) : Promise.resolve({ data: [] })
        ]);

        setQuizzes(quizzesRes.data);
        setFeaturedQuizzes(featuredRes.data);
        setRecommendedQuizzes(recommendedRes.data);
        setCategories(['all', ...categoriesRes.data]);
      } catch (err) {
        setError('Failed to load quizzes');
        console.error(err);
      } finally {
        setLoading({
          main: false,
          featured: false,
          recommended: false
        });
      }
    };
    fetchData();
  }, [user]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleFilterChange = (category) => setFilterCategory(category);
  const handlePageChange = (e, value) => setPage(value);

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || 
                          quiz.categories?.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch(sortOption) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'popular': return (b.participants || 0) - (a.participants || 0);
      case 'title-asc': return a.title.localeCompare(b.title);
      case 'title-desc': return b.title.localeCompare(a.title);
      default: return 0;
    }
  });

  const paginatedQuizzes = sortedQuizzes.slice(
    (page - 1) * quizzesPerPage,
    page * quizzesPerPage
  );

  const renderQuizSection = (title, quizzes, loading, icon, viewAllPath) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Box component="span" ml={1}>{title}</Box>
        </Typography>
        {quizzes.length > 0 && (
          <Button 
            component={Link}
            to={viewAllPath}
            size="small"
            endIcon={<ArrowForward />}
            sx={{ textTransform: 'none' }}
          >
            View All
          </Button>
        )}
      </Box>
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={`skeleton-${i}`}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : quizzes.length > 0 ? (
        <Grid container spacing={3}>
          {quizzes.slice(0, 4).map(quiz => (
            <Grid item xs={12} sm={6} md={3} key={`${title}-${quiz._id}`}>
              <QuizCard quiz={quiz} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No quizzes available in this section.
        </Typography>
      )}
    </Box>
  );

  if (loading.main && loading.featured && loading.recommended) {
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Featured Quizzes Carousel */}
      {featuredQuizzes.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              <Star color="primary" sx={{ mr: 1 }} />
              Featured Quizzes
            </Typography>
            <Button 
              component={Link}
              to="/featured"
              size="small"
              endIcon={<ArrowForward />}
              sx={{ textTransform: 'none' }}
            >
              View All
            </Button>
          </Box>
          <SafeCarousel
            autoPlay
            animation="fade"
            navButtonsAlwaysVisible
            indicators
          >
            {featuredQuizzes.map(quiz => (
              <Box key={`featured-${quiz._id}`} sx={{ p: 2 }}>
                <QuizCard quiz={quiz} featured />
              </Box>
            ))}
          </SafeCarousel>
        </Box>
      )}

      {/* Recommended for You */}
      {user && renderQuizSection(
        "Recommended For You",
        recommendedQuizzes,
        loading.recommended,
        <Whatshot color="secondary" sx={{ mr: 1 }} />,
        "/recommended"
      )}

      {/* Main Quiz Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Discover Quizzes
      </Typography>
      
      {/* Search and Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        gap: 2, 
        mb: 4 
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            startAdornment={
              <InputAdornment position="start">
                <Sort />
              </InputAdornment>
            }
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="title-asc">Title (A-Z)</MenuItem>
            <MenuItem value="title-desc">Title (Z-A)</MenuItem>
          </Select>
        </Box>
      </Box>
      
      {/* Category Filters */}
      <Box sx={{ mb: 3, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => handleFilterChange(category)}
            color={filterCategory === category ? 'primary' : 'default'}
            variant={filterCategory === category ? 'filled' : 'outlined'}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
      
      {/* Quiz Grid */}
      {paginatedQuizzes.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No quizzes found matching your criteria.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedQuizzes.map(quiz => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={quiz._id}>
                <QuizCard quiz={quiz} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(sortedQuizzes.length / quizzesPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;