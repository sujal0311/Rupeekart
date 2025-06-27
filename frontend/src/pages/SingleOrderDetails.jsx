import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
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
  CircularProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import DoneIcon from "@mui/icons-material/Done";
import GetAppIcon from "@mui/icons-material/GetApp";
import easyinvoice from "easyinvoice";
const SingleOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${SummaryApi.getOrderById.url}`, {
          method: SummaryApi.getOrderById.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          toast.error("Failed to fetch order details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const downloadInvoice = async () => {
    try {
      const response = await fetch(SummaryApi.downloadInvoice.url, {
        method: SummaryApi.downloadInvoice.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }
      const data = await response.json();
      easyinvoice.download("Invoice.pdf", data.pdf);
      easyinvoice.download(`invoice_${orderId}.pdf`, data.pdf);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      toast.error("An error occurred while downloading the invoice");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Container sx={{ marginTop: "80px" }}>
        <Typography variant="h6" align="center">
          Order not found
        </Typography>
      </Container>
    );
  }

  const steps = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];
  const getStatusStep = (status) => {
    switch (status) {
      case "Ordered":
        return 0;
      case "Shipped":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const activeStep = getStatusStep(order[0].status);

  return (
    <div className="xl:mt-32">
      <Container sx={{ marginTop: "80px", marginBottom: "40px" }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Grid container spacing={3}>
            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{ padding: 3, backgroundColor: "#f0f4f8" }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Order Summary
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                    Order ID: <strong>{order[0].orderId}</strong>
                  </Typography>
                  <Chip
                    icon={<DoneIcon />}
                    label={order[0].status}
                    color={
                      order[0].status === "Delivered" ? "success" : "warning"
                    }
                    sx={{ marginBottom: 2 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Total Amount: ₹{(order[0].amount / 100).toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 1 }}
                  >
                    Receipt: {order[0].receipt}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 1 }}
                  >
                    Date: {new Date(order[0].createdAt).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GetAppIcon />}
                    sx={{ marginTop: 2 }}
                    onClick={downloadInvoice}
                  >
                    Download Invoice
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Shipping Address */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{ padding: 3, backgroundColor: "#f0f4f8" }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Shipping Address
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ marginBottom: 1 }}
                  >
                    <HomeIcon sx={{ marginRight: 4 }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {order[0].shippingAddress?.name || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {order[0].shippingAddress?.address || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {order[0].shippingAddress?.city || "N/A"},
                        {order[0].shippingAddress?.state || "N/A"},
                        {order[0].shippingAddress?.country || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Pincode-{order[0].shippingAddress?.zip || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Phone No.-{order[0].shippingAddress?.phone || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{ padding: 3, backgroundColor: "#f0f4f8" }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Products
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <List dense>
                  {Array.isArray(order[0].productDetails) &&
                  order[0].productDetails.length > 0 ? (
                    order[0].productDetails.map((product, index) => (
                      <ListItem key={index}>
                        <ShoppingCartIcon
                          sx={{ marginRight: 4, color: "#1565C0" }}
                        />
                        <ListItemText
                          primary={<strong>{product.productName}</strong>}
                          secondary={`Quantity: ${
                            product.quantity
                          }, Price: ₹${product.price.toFixed(2)}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No products found.
                    </Typography>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Delivery Progress */}
            <Grid item xs={12}>
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Delivery Progress
                </Typography>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{ marginTop: 2 }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Grid>
          </Grid>
          <h2 className=" mt-8 mb-2 mx-2">Have a query?</h2>
          <Button variant="contained" color="primary" onClick={()=>{navigate('/tickets')}}>
            Raise a ticket
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default SingleOrderDetails;
