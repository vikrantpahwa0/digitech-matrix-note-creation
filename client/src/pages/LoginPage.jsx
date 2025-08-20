import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/actions";
import { AppBar, Toolbar, Typography, Box, TextField, Button, Paper, Link, CircularProgress, Alert } from "@mui/material";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Redirect user if login is successful
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (token || storedToken) {
      navigate("/home"); // Redirect to /home after successful login
    }
  }, [token, navigate]);

  const handleLogin = () => {
    setEmailError(!email);
    setPasswordError(!password);
    
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#f4f4f4", p: 3 }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ width: "100%", backgroundColor: "#1976D2" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>🔑 Login</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />

      {/* Login Form */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8, width: "100%" }}>
        <Paper sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
            Welcome Back
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField 
            label="Email *" 
            type="email" 
            fullWidth 
            variant="outlined" 
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={emailError}
            helperText={emailError ? "Email is required" : ""}
          />
          <TextField 
            label="Password *" 
            type="password" 
            fullWidth 
            variant="outlined" 
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={passwordError}
            helperText={passwordError ? "Password is required" : ""}
          />
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, backgroundColor: "#1976D2", "&:hover": { backgroundColor: "#1565C0" } }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            Don't have an account? 
            <Link
              component="button"
              onClick={() => navigate("/register")}
              sx={{ ml: 1, fontWeight: "bold", cursor: "pointer" }}
            >
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
