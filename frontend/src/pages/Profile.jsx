import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, Avatar } from '@mui/material';

function Profile() {
  const user = useSelector(state => state?.user?.user);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
      padding={3}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src={user.profilePicture}
            alt="Profile Picture"
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {user.email}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Profile;
