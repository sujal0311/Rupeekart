const backendDomain = "https://rupeekart-backend-six.vercel.app";
const SummaryApi = {
  signup: {
    url: `${backendDomain}/api/signup`,
    method: "post",
  },
  signin: {
    url: `${backendDomain}/api/signin`,
    method: "post",
  },
  forgotPassword: {
    url: `${backendDomain}/api/forgot-password`,
    method: "post",
  },
  resetPassword: {
    url: `${backendDomain}/api/reset-password`,
    method: "post",
  },
  currentUser: {
    url: `${backendDomain}/api/user-details`,
    method: "get",
  },
  logoutUser: {
    url: `${backendDomain}/api/userlogout`,
    method: "get",
  },
  allUsers: {
    url: `${backendDomain}/api//all-users`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomain}/api/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomain}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomain}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomain}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomain}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomain}/api/product-details`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomain}/api/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomain}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomain}/api/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomain}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomain}/api/delete-cart-product`,
    method: "post",
  },
  EmptyCartProduct: {
    url: `${backendDomain}/api//empty-cart-products`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomain}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomain}/api/filter-product`,
    method: "post",
  },
  createOrder:{
    url: `${backendDomain}/api/create-order`,
    method: "post",
  },
  verifyPayment:{
    url: `${backendDomain}/api/verify-payment`,
    method: "post",
  },
  getOrders:{
    url: `${backendDomain}/api/my-orders`,
    method: "get",
  },
  getOrderById:{
    url: `${backendDomain}/api/get-order`,
    method: "post",
  },
  SendNotification:{
    url: `${backendDomain}/api/send-notification`,
    method: "post",
  },
  GetNotification:{
    url: `${backendDomain}/api/get-notification`,
    method: "get",
  },
  countNotification:{
    url: `${backendDomain}/api/count-notifications`,
    method: "get",
  },
  allOrders:{
    url: `${backendDomain}/api/all-orders`,
    method:"get",
  },
  updateOrderStatus:{
    url: `${backendDomain}/api/update-order-status`,
    method:"post",
  },
  deleteOrder:{
    url: `${backendDomain}/api/delete-order`,
    method:"post",
  },
  downloadInvoice:{
    url: `${backendDomain}/api/generate-invoice`,
    method:"post",
  },
  createTicket: {
    url: `${backendDomain}/api/tickets`,
    method: 'POST',
  },
  getUserTickets: {
    url: `${backendDomain}/api/tickets`,
    method: 'GET',
  },
  getAllTickets: {
    url: `${backendDomain}/api/admin/tickets`,
    method: 'GET',
  },
  updateTicketStatus: {
    url: `${backendDomain}/api/admin/updateTicketStatus`,
    method: 'POST',
  },
};

export default SummaryApi;
