import React from 'react';
import { 
  Snackbar,
  Alert as MuiAlert,
  AlertTitle 
} from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomAlert = ({ 
  open, 
  onClose, 
  severity, 
  title, 
  message, 
  autoHideDuration = 6000 
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export const InlineAlert = ({ severity, message }) => {
  return (
    <Alert severity={severity} sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};