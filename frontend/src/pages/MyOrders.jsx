import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(SummaryApi.getOrders.url, {
          method: SummaryApi.getOrders.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        toast.error("An error occurred while fetching orders");
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <Container sx={{ marginTop: "120px", marginBottom: "40px", color:"#01348B" }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600 }}>
        My Orders
      </Typography>
      {orders.length > 0 ? (
        <Grid container spacing={1}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper elevation={3}>
                <Box padding={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Order ID: {order.orderId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {order.status}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1, fontWeight: 600 }}>
                      Amount: ₹{(order.amount / 100).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                      Receipt: {order.receipt}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handleOrderClick(order.orderId)}
                      sx={{ textTransform: "none" }}
                    >
                      View Order
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ marginY: 2 }} />
                
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center">
          No orders found
        </Typography>
      )}
    </Container>
  );
};

export default MyOrders;
