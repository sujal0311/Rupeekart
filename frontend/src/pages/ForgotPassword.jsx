import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import SummaryApi from '../common/index';
import {toast} from 'react-toastify';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    const data = { email };
  
    try {
      const response = await fetch(SummaryApi.forgotPassword.url, {
        method: SummaryApi.forgotPassword.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success(result.message);
        
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="78vh" sx={{marginTop:"100px"}}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '90%' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <LockResetIcon fontSize="large" color="primary" />
          <Typography variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleForgotPassword} sx={{ mt: 2 }}>
            Reset Password
          </Button>
          <Link component={RouterLink} to="/login" sx={{ mt: 2 }}>
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
