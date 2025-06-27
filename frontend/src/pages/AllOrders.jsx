import React, { useState, useEffect } from "react";
import moment from "moment";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import BackToTopButton from "../components/BackToTopButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
function AllOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(SummaryApi.allOrders.url, {
        method: SummaryApi.allOrders.method,
        credentials: "include",
      });
      const dataResponse = await response.json();
      if (dataResponse.success) {
        setAllOrders(dataResponse.orders);
      } else {
        console.error(dataResponse.message);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response=await fetch(SummaryApi.deleteOrder.url, {
        method: SummaryApi.deleteOrder.method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId:selectedOrder._id})
      });
      const dataresponse=await response.json()
      if(dataresponse.success){
        toast.success("Order Cancelled Successfully")
        fetchAllOrders();
      }
      
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleChangeOrderStatus = async () => {
    try {
        console.log(selectedOrder)
      const response=await fetch(SummaryApi.updateOrderStatus.url, {
        method: SummaryApi.updateOrderStatus.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId:selectedOrder._id,status: newStatus }),
      });
      const dataResponse = await response.json();
      if(dataResponse.success){
        toast.success("Status Updated")
        fetchAllOrders();
      }
      
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setOpenStatusDialog(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <Typography variant="h4" component="h1" gutterBottom>
          All Orders
        </Typography>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.shippingAddress.name}</TableCell>
                  <TableCell> ₹{order.amount / 100}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{moment(order.createdAt).format("LL")}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenDetailsDialog(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenStatusDialog(true);
                        setNewStatus(order.status);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Change Status
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenDeleteDialog(true);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Order Details Dialog */}
      <Dialog
        maxWidth="xs"
        fullWidth
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography variant="h6">Products:</Typography>
              <List>
                {selectedOrder.productDetails.map((product) => (
                  <ListItem key={product._id}>
                    <ShoppingCartIcon
                      sx={{ marginRight: 4, color: "#1565C0" }}
                    />
                    <ListItemText
                      primary={`${product.productName} - ₹${product.price} x ${product.quantity}`}
                      secondary={`Total: ₹${product.price * product.quantity}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Shipping Address:
              </Typography>
              <Typography>
                {selectedOrder.shippingAddress.name},<br />
                {selectedOrder.shippingAddress.address},<br />
                {selectedOrder.shippingAddress.city},<br />
                {selectedOrder.shippingAddress.state},<br />
                {selectedOrder.shippingAddress.zip},<br />
                {selectedOrder.shippingAddress.country}.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Change Order Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
      >
        <DialogTitle>Change Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a new status for the order.
          </DialogContentText>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={handleChangeOrderStatus}
            variant="contained"
            color="primary"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Order Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteOrder}
            variant="contained"
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <BackToTopButton />
    </div>
  );
}

export default AllOrders;
