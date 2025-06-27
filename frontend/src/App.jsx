import { useEffect, useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from "./common/index.js";
import context from "./context";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import Allproducts from "./pages/Allproducts.jsx";
import ProductDetails from "./pages/productDetails.jsx";
import Cart from "./pages/Cart.jsx";
import SearchProduct from "./pages/SearchProduct.jsx";
import CategoryProduct from "./pages/CategoryProduct.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import SingleOrderDetails from "./pages/SingleOrderDetails.jsx";
import NotificationList from "./pages/NotificationsList.jsx";
import AllOrders from "./pages/AllOrders.jsx";
import UserTickets from "./pages/UserTickets.jsx";
import AllTickets from "./pages/AllTickets.jsx";
function App() {
  const dispatch=useDispatch();
  const [cartProductCount,setCartProductCount] = useState(0)
  const [notificationCount,setnotificationCount] = useState(0)

  const fetchuserdetails = async () => {
    const dataResponse = await fetch(SummaryApi.currentUser.url, {
      method: SummaryApi.currentUser.method,
      credentials: 'include'
    });
    const dataApi = await dataResponse.json();
    // console.log(dataApi)
    if(dataApi.success){
      dispatch(setUserDetails(dataApi.data));
    }
  };

  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })

    const dataApi = await dataResponse.json()

    setCartProductCount(dataApi?.data?.count)
  }
  const fetchNotifications = async()=>{
    const dataResponse = await fetch(SummaryApi.countNotification.url,{
      method : SummaryApi.countNotification.method,
      credentials : 'include'
    })
    const dataApi = await dataResponse.json()
    // console.log(dataApi.data)
    setnotificationCount(dataApi?.data?.count)
  }

  useEffect(() => {
    fetchuserdetails()
    fetchUserAddToCart()
    fetchNotifications()
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUserAddToCart();
      fetchuserdetails()
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <context.Provider value={{ fetchuserdetails,cartProductCount,
      fetchUserAddToCart,notificationCount }}>
      <div className="bg-[#d5e5f6] h-full w-full overflow-hidden">
        <Router>
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/admin" element={<Admin />}>
              <Route path="all-users" element={<AllUsers />} />
              <Route path="all-products" element={<Allproducts />} />  
              <Route path="all-orders" element={<AllOrders />} />  
              <Route path="all-tickets" element={<AllTickets />} />  
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password/:token" element={<ResetPassword/>} />
            <Route path="/product/:id" element={<ProductDetails/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/search" element={<SearchProduct/>}/>
            <Route path="/product-category" element={<CategoryProduct/>}/>
            <Route path="/order-success/:orderId" element={<OrderSuccess/>}/>
            <Route path="/my-orders" element={<MyOrders/>}/>
            <Route path="/order/:orderId" element={<SingleOrderDetails />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/tickets" element={<UserTickets />} />
          </Routes>
        </Router>
        <Footer />
      </div>
    </context.Provider>
  );
}

export default App;
