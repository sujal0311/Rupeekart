import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const data = {token,newPassword:password };

    try {
      const response = await fetch(SummaryApi.resetPassword.url, {
        method: SummaryApi.resetPassword.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          navigate('/login'); 
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="78vh" sx={{ marginTop: "100px" }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '90%' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <LockResetIcon fontSize="large" color="primary" />
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleResetPassword} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
