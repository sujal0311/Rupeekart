import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Box,
} from '@mui/material';
import SummaryApi from '../common/index';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(SummaryApi.GetNotification.url, {
          method: SummaryApi.GetNotification.method,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error('Error fetching notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box className="mt-20 xl:mt-24 p-4 xl:p-8" sx={{ maxWidth: 800, mx: 'auto' }}>
      <div className='flex items-center justify-center'> <Typography variant="h5" gutterBottom >
        Notifications
      </Typography></div>
      <Paper elevation={3}>
        <List >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <React.Fragment key={notification._id} >
                <ListItem alignItems="flex-start ">
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold">
                        {notification.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ p: 2 }}
            >
              No notifications available.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default NotificationList;
