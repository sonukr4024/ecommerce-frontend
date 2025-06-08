import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 2, textAlign: 'center' }}>
      <Typography variant="body2">
        © 2025 MyEcommerce. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
