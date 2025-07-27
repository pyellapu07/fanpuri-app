import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  IconButton,
  Badge,
  Alert,
} from '@mui/material';
import {
  LocalOffer,
  Favorite,
  ShoppingCart,
  Timer,
  Star,
  TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const LimitedDrops = () => {
  const [timeLeft, setTimeLeft] = useState({});

  // Mock limited drops data
  const limitedDrops = [
    {
      id: 1,
      name: "Avengers: Endgame Limited Edition Poster",
      artist: "Marvel Masterpieces",
      originalPrice: 89.99,
      salePrice: 59.99,
      endDate: "2024-02-15T23:59:59",
      totalQuantity: 500,
      soldQuantity: 342,
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
      fandom: "Marvel",
      description: "Exclusive limited edition poster featuring all Avengers in their final battle. Only 500 pieces worldwide.",
      artistAvatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop",
      rating: 4.9,
      reviews: 89,
      featured: true,
    },
    {
      id: 2,
      name: "Dragon Ball Z Collector's Set",
      artist: "Anime Legends",
      originalPrice: 129.99,
      salePrice: 89.99,
      endDate: "2024-02-20T23:59:59",
      totalQuantity: 300,
      soldQuantity: 156,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
      fandom: "Anime",
      description: "Complete Dragon Ball Z character set with exclusive artwork and collectible packaging.",
      artistAvatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop",
      rating: 4.8,
      reviews: 67,
      featured: true,
    },
    {
      id: 3,
      name: "RRR Movie Premium T-Shirt Collection",
      artist: "Tollywood Creations",
      originalPrice: 49.99,
      salePrice: 34.99,
      endDate: "2024-02-10T23:59:59",
      totalQuantity: 1000,
      soldQuantity: 789,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      fandom: "Tollywood",
      description: "Premium cotton t-shirts featuring iconic scenes from RRR. Limited to 1000 pieces.",
      artistAvatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop",
      rating: 4.7,
      reviews: 234,
      featured: false,
    },
    {
      id: 4,
      name: "Batman: The Dark Knight Art Print",
      artist: "ComicVerse Art",
      originalPrice: 74.99,
      salePrice: 49.99,
      endDate: "2024-02-25T23:59:59",
      totalQuantity: 200,
      soldQuantity: 45,
      image: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=400&h=500&fit=crop",
      fandom: "DC Comics",
      description: "Hand-numbered art print of Batman in Gotham City. Only 200 pieces available.",
      artistAvatar: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=50&h=50&fit=crop",
      rating: 4.6,
      reviews: 123,
      featured: false,
    },
    {
      id: 5,
      name: "Harry Potter Hogwarts Express Mug Set",
      artist: "Wizarding World Crafts",
      originalPrice: 39.99,
      salePrice: 24.99,
      endDate: "2024-02-18T23:59:59",
      totalQuantity: 750,
      soldQuantity: 623,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
      fandom: "Harry Potter",
      description: "Ceramic mug set featuring the Hogwarts Express. Perfect for your morning coffee.",
      artistAvatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop",
      rating: 4.5,
      reviews: 178,
      featured: false,
    },
    {
      id: 6,
      name: "Star Wars Darth Vader Hoodie",
      artist: "Galaxy Gear",
      originalPrice: 79.99,
      salePrice: 54.99,
      endDate: "2024-02-12T23:59:59",
      totalQuantity: 400,
      soldQuantity: 398,
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
      fandom: "Star Wars",
      description: "Premium hoodie with Darth Vader artwork. Almost sold out!",
      artistAvatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop",
      rating: 4.4,
      reviews: 156,
      featured: false,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {};
      limitedDrops.forEach(drop => {
        const now = new Date().getTime();
        const end = new Date(drop.endDate).getTime();
        const difference = end - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          newTimeLeft[drop.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeft[drop.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeLeft = (time) => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
    } else {
      return `${time.minutes}m ${time.seconds}s`;
    }
  };

  const getProgressPercentage = (sold, total) => {
    return (sold / total) * 100;
  };

  const isExpired = (endDate) => {
    return new Date() > new Date(endDate);
  };

  const isAlmostSoldOut = (sold, total) => {
    return (sold / total) > 0.9;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Limited Edition Drops
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Exclusive fan art and collectibles available for a limited time only
        </Typography>
      </Box>

      {/* Featured Drop Alert */}
      {limitedDrops.filter(drop => drop.featured && !isExpired(drop.endDate)).length > 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="h6">
            🔥 Featured Drop: {limitedDrops.find(drop => drop.featured && !isExpired(drop.endDate))?.name}
          </Typography>
          <Typography variant="body2">
            Don't miss out on our featured limited edition items. Once they're gone, they're gone forever!
          </Typography>
        </Alert>
      )}

      {/* Limited Drops Grid */}
      <Grid container spacing={4}>
        {limitedDrops.map((drop) => {
          const expired = isExpired(drop.endDate);
          const almostSoldOut = isAlmostSoldOut(drop.soldQuantity, drop.totalQuantity);
          const progressPercentage = getProgressPercentage(drop.soldQuantity, drop.totalQuantity);

          return (
            <Grid item xs={12} sm={6} lg={4} key={drop.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  position: 'relative',
                }}
              >
                {/* Featured Badge */}
                {drop.featured && (
                  <Chip
                    icon={<Star />}
                    label="Featured"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Sold Out Overlay */}
                {expired && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <Typography variant="h4" color="white" fontWeight="bold">
                      SOLD OUT
                    </Typography>
                  </Box>
                )}

                {/* Almost Sold Out Badge */}
                {almostSoldOut && !expired && (
                  <Chip
                    label="Almost Sold Out!"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                    }}
                  />
                )}

                <CardMedia
                  component="img"
                  height="300"
                  image={drop.image}
                  alt={drop.name}
                />
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Fandom Tag */}
                  <Chip
                    label={drop.fandom}
                    size="small"
                    sx={{ mb: 2, bgcolor: 'primary.main', color: 'white', alignSelf: 'flex-start' }}
                  />

                  {/* Product Title */}
                  <Typography variant="h6" component="h3" gutterBottom>
                    {drop.name}
                  </Typography>

                  {/* Artist Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={drop.artistAvatar} sx={{ mr: 2, width: 32, height: 32 }} />
                    <Typography variant="body2" color="text.secondary">
                      by {drop.artist}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {drop.description}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" color="primary.main" fontWeight={600} sx={{ mr: 2 }}>
                      ${drop.salePrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ${drop.originalPrice}
                    </Typography>
                    <Chip
                      label={`${Math.round(((drop.originalPrice - drop.salePrice) / drop.originalPrice) * 100)}% OFF`}
                      color="error"
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {drop.soldQuantity} of {drop.totalQuantity} sold
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round(progressPercentage)}% sold
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {/* Time Left */}
                  {!expired && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Timer sx={{ mr: 1, color: 'error.main' }} />
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        {formatTimeLeft(timeLeft[drop.id])} left
                      </Typography>
                    </Box>
                  )}

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {drop.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({drop.reviews} reviews)
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton color="primary">
                      <Favorite />
                    </IconButton>
                    {!expired ? (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        disabled={almostSoldOut}
                      >
                        {almostSoldOut ? 'Almost Sold Out' : 'Buy Now'}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                      >
                        Sold Out
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* CTA Section */}
      <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Never Miss a Drop
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Get notified about new limited edition releases and exclusive offers
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<TrendingUp />}
        >
          Enable Notifications
        </Button>
      </Box>
    </Container>
  );
};

export default LimitedDrops; 