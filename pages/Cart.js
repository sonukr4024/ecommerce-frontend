import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => navigate('/checkout');

  if (!cart.length) return <Typography sx={{ mt: 4 }}>Your cart is empty.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Your Cart</Typography>
      <List>
        {cart.map((item, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeItem(idx)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary={item.name} secondary={`₹${item.price}`} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Total: ₹{total}
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleCheckout}>
        Proceed to Checkout
      </Button>
    </Container>
  );
}
