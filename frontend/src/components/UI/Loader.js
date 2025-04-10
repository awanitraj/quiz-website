import React from 'react';
import { 
  CircularProgress,
  Box,
  Typography 
} from '@mui/material';

export const Loader = ({ 
  size = 40,
  text = 'Loading...',
  fullPage = false 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...(fullPage && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'background.paper',
          zIndex: 9999
        })
      }}
    >
      <CircularProgress size={size} />
      {text && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export const ButtonLoader = ({ size = 24 }) => {
  return (
    <CircularProgress 
      size={size} 
      color="inherit" 
      sx={{ mx: 1 }} 
    />
  );
};