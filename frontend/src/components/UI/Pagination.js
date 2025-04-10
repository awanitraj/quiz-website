import React from 'react';
import { 
  Pagination as MuiPagination,
  Stack,
  Typography,
  Select,
  MenuItem,
  Box
} from '@mui/material';

export const Pagination = ({
  count,
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
  showRowSelect = true
}) => {
  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      sx={{ mt: 3, p: 1 }}
    >
      {showRowSelect && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(e.target.value)}
            size="small"
            sx={{ minWidth: 80 }}
          >
            {rowsPerPageOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
      
      <MuiPagination
        count={count}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};