import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/actions";
import { AppBar, Toolbar, Typography, Box, TextField, Button, Paper, CircularProgress, Alert } from "@mui/material";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate("/login"); // Redirect to login page after successful registration
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      dispatch(registerUser(formData));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f4f4", p: 3 }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ width: "100%", backgroundColor: "#1976D2" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>📝 Register</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />

      {/* Register Form */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8, width: "100%" }}>
        <Paper sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
            Create an Account
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Name *"
            type="text"
            fullWidth
            variant="outlined"
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email *"
            type="email"
            fullWidth
            variant="outlined"
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password *"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#1976D2", "&:hover": { backgroundColor: "#1565C0" } }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
