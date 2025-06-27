import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common/index";
import Context from "../context/index";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);
  const navigate = useNavigate();

  const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
    return formatter.format(num);
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();

    if (responseData.success) {
      setData(responseData.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Load shipping address from local storage if it exists
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
      setShowAddress(true);
    }
  }, []);

  const updateCart = async (id, qty) => {
    setLoading(true);
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
    setLoading(false);
  };

  const increaseQty = (id, qty) => {
    updateCart(id, qty + 1);
  };

  const decreaseQty = (id, qty) => {
    if (qty > 1) {
      updateCart(id, qty - 1);
    }
  };

  const confirmDeleteCartProduct = (id) => {
    setDeleteProductId(id);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteProductId(null);
  };

  const deleteCartProduct = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: deleteProductId,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
    setLoading(false);
    handleCloseDeleteDialog();
  };

  const handleShippingAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlebeforeshippingaddress = () => {
    toast.error("Please add shipping address before proceeding for payment");
    return;
  };

  const handleOpenAddressDialog = () => {
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
  };

  const validateFields = () => {
    let tempErrors = {};
    if (!shippingAddress.name) tempErrors.name = "Name is required";
    if (!shippingAddress.address) tempErrors.address = "Address is required";
    if (!shippingAddress.city) tempErrors.city = "City is required";
    if (!shippingAddress.state) tempErrors.state = "State is required";
    if (!shippingAddress.zip) tempErrors.zip = "ZIP/Postal Code is required";
    if (!shippingAddress.country) tempErrors.country = "Country is required";
    if (!shippingAddress.phone) tempErrors.phone = "Phone Number is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };

  const handleSaveAddress = () => {
    if (validateFields()) {
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
      setShowAddress(true);
      handleCloseAddressDialog();
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );
  const totalPrice = data.reduce(
    (prev, curr) => prev + curr.quantity * curr?.productId?.price,
    0
  );
  const totalSellingPrice = data.reduce(
    (prev, curr) => prev + curr.quantity * curr?.productId?.sellingPrice,
    0
  );
  const totalDiscount = data.reduce(
    (prev, curr) =>
      prev +
      curr.quantity * (curr?.productId?.price - curr?.productId?.sellingPrice),
    0
  );
  const shippingCharge = totalPrice > 2000 ? 0 : 150;
  const totalamount = totalSellingPrice + shippingCharge;

  // payment
  const handleCheckout = async () => {
    if (!showAddress) {
      handlebeforeshippingaddress();
      return;
    }

    const productDetails = data.map((product) => ({
      productId: product.productId._id,
      productName: product.productId.productName,
      quantity: product.quantity,
      price: product.productId.sellingPrice,
    }));

    const orderPayload = {
      amount: totalamount,
      shippingAddress: shippingAddress,
      productDetails: productDetails,
    };

    try {
      const response = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();

      if (responseData.success) {
        const { order } = responseData;
        const options = {
          key: "rzp_test_ZPdGbfHThBEhMF",
          amount: order.amount,
          currency: order.currency,
          name: "Rupeekart",
          description: "Test Transaction",
          order_id: order.id,
          handler: async (response) => {
            const verifyResponse = await fetch(SummaryApi.verifyPayment.url, {
              method: SummaryApi.verifyPayment.method,
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResponseData = await verifyResponse.json();

            if (verifyResponseData.success) {
              const EmptyCartProduct = async () => {
                setLoading(true);
                const response = await fetch(SummaryApi.EmptyCartProduct.url, {
                  method: SummaryApi.EmptyCartProduct.method,
                  credentials: "include",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify({
                    _id: deleteProductId,
                  }),
                });
              };
              EmptyCartProduct()
              toast.success("Payment Successful");
              navigate(`/order-success/${order.id}`); // Redirect to a success page
            } else {
              toast.error("Payment Verification Failed");
            }
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto mt-20 lg:mt-24 min-h-[78vh]">
      <div className="text-center text-lg my-2">
        {data.length === 0 && !loading && (
          <div className="flex-col items-center justify-center mt-48">
            <img
              src="https://github.com/sujal0311/temp/blob/main/Animation%20-%201722797133024.gif?raw=true"
              alt=""
              className="mx-auto "
            />
            <h1>Your cart is empty</h1>
          </div>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart.map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-blue-50 h-32 my-2 border border-slate-300 animate-pulse rounded"
                ></div>
              ))
            : data.map((product) => {
                const discountPercentage =
                  ((product?.productId?.price -
                    product?.productId?.sellingPrice) /
                    product?.productId?.price) *
                  100;
                return (
                  <div
                    key={product?._id}
                    className="w-full bg-white h-auto lg:h-44 my-4 border border-slate-300 rounded grid grid-cols-1 lg:grid-cols-[128px,1fr]"
                  >
                    <div className="w-full lg:w-32 h-44 bg-blue-50 ">
                      <img
                        src={product?.productId?.productImage[0]}
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer transition-all "
                        alt="product"
                        onClick={() => {
                          navigate(`/product/${product?.productId?._id}`);
                        }}
                      />
                    </div>
                    <div className="px-4 py-2 relative">
                      <div
                        className="absolute right-0 top-0 text-blue-600 rounded-full p-2 hover:bg-blue-600 hover:text-white cursor-pointer text-xl mx-1"
                        onClick={() => confirmDeleteCartProduct(product?._id)}
                      >
                        <MdDelete />
                      </div>
                      <h2
                        className="text-lg lg:text-xl text-ellipsis line-clamp-1 cursor-pointer hover:text-blue-600 transition-all"
                        onClick={() => {
                          navigate(`/product/${product?.productId?._id}`);
                        }}
                      >
                        {product?.productId?.productName}
                      </h2>
                      <p className="capitalize text-slate-500">
                        {product?.productId.category}
                      </p>
                      <div className="flex items-center justify-start ">
                        <p className="text-blue-800 font-semibold text-lg mr-2 mb-0">
                          {displayINRCurrency(
                            product?.productId?.sellingPrice * product?.quantity
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600 font-semibold text-lg mb-2">
                          <span className="line-through mr-2 mb-0">
                            {displayINRCurrency(
                              product?.productId?.price * product?.quantity
                            )}
                          </span>
                          <span className="text-[#33AE61] mx-2">
                            ({Math.round(discountPercentage)}% off)
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ">
                        <button
                          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                          onClick={() =>
                            decreaseQty(product?._id, product?.quantity)
                          }
                        >
                          -
                        </button>
                        <span>{product?.quantity}</span>
                        <button
                          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                          onClick={() =>
                            increaseQty(product?._id, product?.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
        {data.length > 0 && (
          <div className="w-full max-w-md bg-white p-4 rounded shadow-md h-[fit-content]">
            <h2 className="text-lg font-semibold text-slate-600">
              Price Details
            </h2>
            <Divider className="my-2" />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Price ({totalQty} Items)</span>
                <span>{displayINRCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="text-[#33AE61]">
                  {" "}
                  - {displayINRCurrency(totalDiscount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Charges</span>
                <span className="text-[#33AE61]">
                  {shippingCharge === 0
                    ? "Free"
                    : `+ ${displayINRCurrency(shippingCharge)}`}
                </span>
              </div>
            </div>
            <Divider className="my-2" />
            <div className="flex items-center justify-between my-2">
              <span className="font-semibold text-lg">Total Amount</span>
              <span className="font-semibold text-lg">
                {displayINRCurrency(totalamount)}
              </span>
            </div>
            <Divider className="my-2" />
            <div>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleOpenAddressDialog}
              >
                {showAddress ? "Edit Shipping Address" : "Add Shipping Address"}
              </Button>
              {showAddress && (
                <div className="bg-blue-50 p-2 my-2 rounded shadow-md">
                  <Typography variant="subtitle1" gutterBottom>
                    {shippingAddress.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {shippingAddress.address}, {shippingAddress.city},{" "}
                    {shippingAddress.state}, {shippingAddress.zip}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {shippingAddress.country}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Phone: {shippingAddress.phone}
                  </Typography>
                </div>
              )}
            </div>
            <button
              className="bg-[#01348B] p-2 text-white w-full mt-8 rounded-3xl opacity-85 hover:opacity-100 transition-all"
              onClick={() =>
                showAddress ? handleCheckout() : handlebeforeshippingaddress()
              }
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteProductId !== null} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item from your cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={deleteCartProduct} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shipping Address Dialog */}
      <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog}>
        <DialogTitle>
          {showAddress ? "Edit Shipping Address" : "Add Shipping Address"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your shipping address details:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={shippingAddress.name}
            onChange={handleShippingAddressChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            value={shippingAddress.address}
            onChange={handleShippingAddressChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            value={shippingAddress.city}
            onChange={handleShippingAddressChange}
            error={!!errors.city}
            helperText={errors.city}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            value={shippingAddress.state}
            onChange={handleShippingAddressChange}
            error={!!errors.state}
            helperText={errors.state}
          />
          <TextField
            margin="dense"
            name="zip"
            label="ZIP/Postal Code"
            type="text"
            fullWidth
            value={shippingAddress.zip}
            onChange={handleShippingAddressChange}
            error={!!errors.zip}
            helperText={errors.zip}
          />
          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            fullWidth
            value={shippingAddress.country}
            onChange={handleShippingAddressChange}
            error={!!errors.country}
            helperText={errors.country}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="text"
            fullWidth
            value={shippingAddress.phone}
            onChange={handleShippingAddressChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;
