import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardMedia component="img" height="400" image={product.imageUrl} />
        <CardContent>
          <Typography variant="h4">{product.name}</Typography>
          <Typography variant="h5" color="textSecondary">
            ₹{product.price}
          </Typography>
          <Typography paragraph>{product.description}</Typography>
          <Button variant="contained" onClick={addToCart}>
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
