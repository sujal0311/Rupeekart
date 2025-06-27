// src/components/Login.jsx
import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography, Link, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import context from "../context/index";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {fetchuserdetails, fetchUserAddToCart} = useContext(context);
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };
    const dataResponse = await fetch(SummaryApi.signin.url, {
      method: SummaryApi.signin.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataApi = await dataResponse.json();
    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate("/");
      await fetchuserdetails()
      await fetchUserAddToCart()
    } else {
      toast.error(dataApi.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="78vh"
      sx={{ borderRadius: 20 ,marginTop:"100px"}}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: "90%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <LoginIcon fontSize="large" color="primary" />
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Link component={RouterLink} to="/forgot-password" sx={{ mt: 2 }}>
            Forgot Password?
          </Link>
          <Link component={RouterLink} to="/signup" sx={{ mt: 2 }}>
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
