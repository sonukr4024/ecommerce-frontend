import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!mobile || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:9090/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login success:", data);

      // Save token in localStorage (assuming backend returns token)
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("mobile", data?.mobile);
        localStorage.setItem("role", "ADMIN");
      }

      // Notify parent about login success
      onLogin();

      // Navigate to homepage
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="User Id"
            variant="outlined"
            margin="normal"
            fullWidth
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>

        <Typography sx={{ mt: 2 }}>
          New User?{" "}
          <Link
            href="#"
            onClick={() => navigate("/register")}
            underline="hover"
            color="primary"
          >
            Register here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
