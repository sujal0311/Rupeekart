import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Avatar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    let profilePictureBase64 = null;

    if (profilePicture) {
      try {
        const options = {
          maxSizeMB: 0.2, // Reduce size to 200KB
          maxWidthOrHeight: 400, // Reduce dimensions
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(profilePicture, options);
        profilePictureBase64 = await convertToBase64(compressedFile);
      } catch (error) {
        toast.error("Failed to convert profile picture. Please try again.");
        return;
      }
    }

    const data = {
      name,
      email,
      password,
      profilePicture: profilePictureBase64,
    };

    try {
      const response = await fetch(SummaryApi.signup.url, {
        method: SummaryApi.signup.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
      setProfilePicturePreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{marginTop:"100px"}}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: "90%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <Avatar
            src={profilePicturePreview}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Button variant="contained" component="label">
            Upload Profile Picture
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignup}
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          <Link component={RouterLink} to="/login" sx={{ mt: 2 }}>
            Already have an account? Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
