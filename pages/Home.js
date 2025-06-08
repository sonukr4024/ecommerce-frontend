import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:1010/api/allproducts", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // Group products category wise
        const grouped = {};
        data.forEach((product) => {
          const categoryName = product.category.name;
          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }
          grouped[categoryName].push(product);
        });
        setGroupedProducts(grouped);
      })
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to ShopSmart 👌
      </Typography>

      {Object.keys(groupedProducts).map((category, index) => (
        <Box key={index} sx={{ mb: 5 }}>
          <Typography variant="h5" gutterBottom>
            {category}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ overflowX: "auto", flexWrap: "nowrap" }}
          >
            {groupedProducts[category].map((product, idx) => (
              <Grid item key={idx} sx={{ minWidth: 250 }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="160"
                    image={
                      product.image
                        ? `data:image/png;base64,${product.image}`
                        : "https://via.placeholder.com/160"
                    }
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      ₹{product.price}
                    </Typography>
                    <Button variant="contained" fullWidth sx={{ mt: 1 }}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
}

export default HomePage;
