import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
} from '@mui/icons-material';
import XIcon from '@mui/icons-material/Close'; // Use as X/Twitter icon

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 'auto', bgcolor: '#fff' }}>
      {/* Top Black Social Bar */}
      <Box sx={{ bgcolor: '#111', py: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <IconButton href="#" sx={{ color: '#fff' }}><Instagram fontSize="large" /></IconButton>
            <IconButton href="#" sx={{ color: '#fff' }}><YouTube fontSize="large" /></IconButton>
            <IconButton href="#" sx={{ color: '#fff' }}><Facebook fontSize="large" /></IconButton>
            <IconButton href="#" sx={{ color: '#fff' }}><XIcon fontSize="large" /></IconButton>
            <IconButton href="#" sx={{ color: '#fff' }}><Twitter fontSize="large" /></IconButton>
          </Box>
        </Container>
      </Box>
      {/* Main White Footer */}
      <Container maxWidth="xl" sx={{ pt: 6, pb: 4 }}>
        <Grid container spacing={4}>
          {/* Logo */}
          <Grid xs={12} sm={6} md={3}>
            <Box sx={{ mb: 2 }}>
              <Box component="img" src="/assets/FANPURI%20logo.png" alt="Fanpuri Logo" sx={{ height: 48, width: 'auto' }} />
            </Box>
          </Grid>
          {/* Account */}
          <Grid xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Account</Typography>
            <Link href="/profile" color="inherit" display="block" sx={{ mb: 1 }}>Account</Link>
            <Link href="/orders" color="inherit" display="block" sx={{ mb: 1 }}>Order History</Link>
            <Link href="/limited-drops" color="inherit" display="block" sx={{ mb: 1 }}>Limited Edition FAQ</Link>
            <Link href="/settings" color="inherit" display="block" sx={{ mb: 1 }}>Notification Settings</Link>
          </Grid>
          {/* Assistance */}
          <Grid xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Assistance</Typography>
            <Link href="/help" color="inherit" display="block" sx={{ mb: 1 }}>Support Center</Link>
            <Link href="/returns" color="inherit" display="block" sx={{ mb: 1 }}>Returns Policy</Link>
            <Link href="/terms" color="inherit" display="block" sx={{ mb: 1 }}>Terms & Conditions</Link>
            <Link href="/privacy" color="inherit" display="block" sx={{ mb: 1 }}>Privacy Policy</Link>
          </Grid>
          {/* About/Connect */}
          <Grid xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Connect With Us</Typography>
            <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>Contact Us</Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>Instagram</Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>YouTube</Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>Facebook</Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>X (Twitter)</Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>TikTok</Link>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Fanpuri. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 