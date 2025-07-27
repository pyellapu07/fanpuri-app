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
  Email,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'secondary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              FANPURI
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Curated platform for fan-made artworks, collectibles, and merch — by fans, for fans.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Shop
            </Typography>
            <Link href="/shop" color="inherit" display="block" sx={{ mb: 1 }}>
              All Products
            </Link>
            <Link href="/limited-drops" color="inherit" display="block" sx={{ mb: 1 }}>
              Limited Drops
            </Link>
            <Link href="/artists" color="inherit" display="block" sx={{ mb: 1 }}>
              Artists
            </Link>
            <Link href="/fanhub" color="inherit" display="block" sx={{ mb: 1 }}>
              FanHub Blog
            </Link>
          </Grid>

          {/* Fandoms */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Fandoms
            </Typography>
            <Link href="/shop?fandom=marvel" color="inherit" display="block" sx={{ mb: 1 }}>
              Marvel
            </Link>
            <Link href="/shop?fandom=tollywood" color="inherit" display="block" sx={{ mb: 1 }}>
              Tollywood
            </Link>
            <Link href="/shop?fandom=anime" color="inherit" display="block" sx={{ mb: 1 }}>
              Anime
            </Link>
            <Link href="/shop?fandom=dc" color="inherit" display="block" sx={{ mb: 1 }}>
              DC Comics
            </Link>
            <Link href="/shop?fandom=starwars" color="inherit" display="block" sx={{ mb: 1 }}>
              Star Wars
            </Link>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Link href="/help" color="inherit" display="block" sx={{ mb: 1 }}>
              Help Center
            </Link>
            <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact Us
            </Link>
            <Link href="/submit" color="inherit" display="block" sx={{ mb: 1 }}>
              Submit Work
            </Link>
            <Link href="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
              Terms of Service
            </Link>
            <Link href="/privacy" color="inherit" display="block" sx={{ mb: 1 }}>
              Privacy Policy
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="inherit">
            © 2024 Fanpuri. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, sm: 0 } }}>
            <Email sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="inherit">
              hello@fanpuri.com
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 