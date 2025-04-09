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
  MenuItem,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Lock, 
  LockOpen 
} from '@mui/icons-material';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await api.updateUserStatus(userId, !isActive);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !isActive } : u
      ));
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser._id) {
        await api.updateUser(currentUser._id, currentUser);
      }
      fetchUsers();
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to update user:', err);
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
      <Typography variant="h4" gutterBottom>User Management</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography 
                    color={user.role === 'admin' ? 'secondary' : 'primary'}
                    fontWeight="bold"
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={user.isActive ? 'Active' : 'Inactive'}>
                    <IconButton
                      color={user.isActive ? 'success' : 'error'}
                      onClick={() => handleToggleStatus(user._id, user.isActive)}
                    >
                      {user.isActive ? <LockOpen /> : <Lock />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEdit(user)}>
                    <Tooltip title="Edit">
                      <Edit />
                    </Tooltip>
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(user._id)}
                    disabled={user.role === 'admin'}
                  >
                    <Tooltip title={user.role === 'admin' ? "Can't delete admin" : "Delete"}>
                      <Delete />
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              required
              value={currentUser?.username || ''}
              onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
              value={currentUser?.email || ''}
              onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
            />
            <TextField
              select
              margin="dense"
              label="Role"
              fullWidth
              value={currentUser?.role || 'user'}
              onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Box display="flex" alignItems="center" mt={2}>
              <Typography variant="body2" mr={2}>
                Status:
              </Typography>
              <Tooltip title={currentUser?.isActive ? 'Active' : 'Inactive'}>
                <IconButton
                  color={currentUser?.isActive ? 'success' : 'error'}
                  onClick={() => setCurrentUser({...currentUser, isActive: !currentUser.isActive})}
                >
                  {currentUser?.isActive ? <LockOpen /> : <Lock />}
                </IconButton>
              </Tooltip>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;