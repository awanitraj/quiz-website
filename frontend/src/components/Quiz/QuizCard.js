import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccessTime, EmojiEvents, QuestionAnswer } from '@mui/icons-material';

const QuizCard = ({ quiz }) => {
  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }
    }}>
      {/* Quiz Thumbnail */}
      <CardMedia
        component="img"
        height="140"
        image={quiz.imageUrl || '/default-quiz.jpg'}
        alt={quiz.title}
        loading="lazy"
     />
      
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Quiz Title */}
        <Typography gutterBottom variant="h5" component="h2">
          {quiz.title}
        </Typography>
        
        {/* Quiz Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {quiz.description.length > 100 
            ? `${quiz.description.substring(0, 100)}...` 
            : quiz.description}
        </Typography>
        
        {/* Quiz Metadata */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<AccessTime fontSize="small" />} 
            label={`${quiz.timeLimit} mins`} 
            size="small" 
          />
          <Chip 
            icon={<QuestionAnswer fontSize="small" />} 
            label={`${quiz.questionsCount} questions`} 
            size="small" 
          />
          {quiz.difficulty && (
            <Chip 
              label={quiz.difficulty} 
              size="small"
              color={
                quiz.difficulty === 'Easy' ? 'success' : 
                quiz.difficulty === 'Medium' ? 'warning' : 'error'
              }
            />
          )}
        </Box>
        
        {/* Quiz Categories */}
        {quiz.categories && quiz.categories.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {quiz.categories.slice(0, 3).map((category, index) => (
              <Chip 
                key={index} 
                label={category} 
                size="small" 
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </CardContent>
      
      {/* Action Area */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          component={Link} 
          to={`/quiz/${quiz._id}`}
          variant="outlined"
          size="small"
        >
          View Details
        </Button>
        {quiz.highScore && (
          <Chip 
            icon={<EmojiEvents fontSize="small" />} 
            label={`High Score: ${quiz.highScore}`} 
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
    </Card>
  );
};

export default QuizCard;