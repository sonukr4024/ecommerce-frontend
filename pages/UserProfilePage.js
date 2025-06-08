import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function UserProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:9090/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mobile");
    navigate("/login");
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 12, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, mb: 2 }}>
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            User Profile
          </Typography>
        </Box>

        {userData ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Name
              </Typography>
              <Typography variant="h6">{userData.name || "N/A"}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Mobile
              </Typography>
              <Typography variant="h6">{userData.phoneNumber || "N/A"}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
              <Typography variant="h6">{userData.emailId || "N/A"}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Language
              </Typography>
              <Typography variant="h6">{userData.language || "N/A"}</Typography>
            </Box>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 4, py: 1.5, fontWeight: "bold" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="body1" color="error" align="center">
            Failed to load user data.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default UserProfilePage;
