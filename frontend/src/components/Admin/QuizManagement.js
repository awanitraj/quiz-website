import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add, 
  Visibility, 
  Publish, 
  Unpublished 
} from '@mui/icons-material';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await api.getAdminQuizzes();
      setQuizzes(response.data);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (quizId, isPublished) => {
    try {
      await api.publishQuiz(quizId, !isPublished);
      setQuizzes(quizzes.map(q => 
        q._id === quizId ? { ...q, isPublished: !isPublished } : q
      ));
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await api.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  const handleEdit = (quiz) => {
    setCurrentQuiz(quiz);
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentQuiz._id) {
        await api.updateQuiz(currentQuiz._id, currentQuiz);
      } else {
        await api.addQuiz(currentQuiz);
      }
      fetchQuizzes();
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to save quiz:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Quiz Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => {
            setCurrentQuiz({
              title: '',
              description: '',
              timeLimit: 10,
              isPublished: false
            });
            setOpenDialog(true);
          }}
        >
          Add New Quiz
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Time Limit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>
                  {quiz.description.length > 50 
                    ? `${quiz.description.substring(0, 50)}...` 
                    : quiz.description}
                </TableCell>
                <TableCell>{quiz.timeLimit} mins</TableCell>
                <TableCell>
                  <Tooltip title={quiz.isPublished ? 'Published' : 'Unpublished'}>
                    <Switch
                      checked={quiz.isPublished}
                      onChange={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                      color="primary"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => navigate(`/admin/add-question/${quiz._id}`)}
                  >
                    <Tooltip title="Add Questions">
                      <Add />
                    </Tooltip>
                  </IconButton>
                  <IconButton 
                    color="info" 
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    <Tooltip title="View">
                      <Visibility />
                    </Tooltip>
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleEdit(quiz)}>
                    <Tooltip title="Edit">
                      <Edit />
                    </Tooltip>
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(quiz._id)}>
                    <Tooltip title="Delete">
                      <Delete />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Quiz Edit/Create Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentQuiz?._id ? 'Edit Quiz' : 'Create New Quiz'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              fullWidth
              required
              value={currentQuiz?.title || ''}
              onChange={(e) => setCurrentQuiz({...currentQuiz, title: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={currentQuiz?.description || ''}
              onChange={(e) => setCurrentQuiz({...currentQuiz, description: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Time Limit (minutes)"
              type="number"
              fullWidth
              required
              value={currentQuiz?.timeLimit || 10}
              onChange={(e) => setCurrentQuiz({...currentQuiz, timeLimit: e.target.value})}
            />
            <Box display="flex" alignItems="center" mt={2}>
              <Switch
                checked={currentQuiz?.isPublished || false}
                onChange={(e) => setCurrentQuiz({...currentQuiz, isPublished: e.target.checked})}
                color="primary"
              />
              <Typography variant="body2">
                {currentQuiz?.isPublished ? 'Published' : 'Unpublished'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default QuizManagement;