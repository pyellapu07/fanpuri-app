import React, { useState } from 'react';
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
  Rating,
  Tabs,
  Tab,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Favorite,
  Instagram,
  Twitter,
  YouTube,
  Palette,
  Star,
  People,
  ShoppingCart,
  Share,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';

const ArtistProfile = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock artist data
  const artist = {
    id: 1,
    name: "ArtVault Studios",
    avatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=150&h=150&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=300&fit=crop",
    bio: "Specializing in Marvel and DC Comics artwork. Creating high-quality posters and prints for over 5 years. Our passion is bringing beloved characters to life through unique artistic interpretations that fans can proudly display in their homes.",
    location: "Los Angeles, CA",
    joinedDate: "2019",
    fandoms: ["Marvel", "DC Comics"],
    rating: 4.8,
    reviews: 127,
    followers: 15420,
    following: 234,
    products: 45,
    totalSales: 2890,
    social: {
      instagram: "@artvaultstudios",
      twitter: "@artvault",
      youtube: "ArtVault Studios",
      website: "https://artvaultstudios.com"
    },
    products: [
      {
        id: 1,
        name: "Spider-Man: No Way Home Poster",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop",
        fandom: "Marvel",
        rating: 4.8,
        reviews: 127,
        isLimited: false,
      },
      {
        id: 2,
        name: "Batman: The Dark Knight Print",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=300&h=400&fit=crop",
        fandom: "DC Comics",
        rating: 4.6,
        reviews: 156,
        isLimited: true,
      },
      {
        id: 3,
        name: "Avengers: Endgame Limited Edition",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
        fandom: "Marvel",
        rating: 4.9,
        reviews: 89,
        isLimited: true,
      },
      {
        id: 4,
        name: "Iron Man Arc Reactor T-Shirt",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
        fandom: "Marvel",
        rating: 4.7,
        reviews: 203,
        isLimited: false,
      },
    ],
    reviews: [
      {
        id: 1,
        user: "MarvelFan123",
        rating: 5,
        comment: "Amazing artwork! The Spider-Man poster is even better in person. Highly recommend!",
        date: "2024-01-15",
        product: "Spider-Man: No Way Home Poster"
      },
      {
        id: 2,
        user: "ComicCollector",
        rating: 4,
        comment: "Great quality prints. The Batman artwork is stunning. Will definitely buy more!",
        date: "2024-01-10",
        product: "Batman: The Dark Knight Print"
      },
      {
        id: 3,
        user: "AvengersFan",
        rating: 5,
        comment: "The limited edition Avengers poster is absolutely perfect. Worth every penny!",
        date: "2024-01-08",
        product: "Avengers: Endgame Limited Edition"
      },
    ]
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cover Image and Avatar */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={artist.coverImage}
            alt={artist.name}
          />
          <Avatar
            src={artist.avatar}
            sx={{
              width: 120,
              height: 120,
              position: 'absolute',
              bottom: -60,
              left: 40,
              border: 4,
              borderColor: 'white',
            }}
          />
        </Card>
      </Box>

      {/* Artist Info */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ pl: 20, mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {artist.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {artist.location} • Joined {artist.joinedDate}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {artist.bio}
            </Typography>
            
            {/* Fandom Tags */}
            <Box sx={{ mb: 2 }}>
              {artist.fandoms.map((fandom) => (
                <Chip
                  key={fandom}
                  label={fandom}
                  sx={{ mr: 1, mb: 1, bgcolor: 'primary.main', color: 'white' }}
                />
              ))}
            </Box>

            {/* Social Links */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton color="primary">
                <Instagram />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
              <IconButton color="primary">
                <YouTube />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h5" color="primary.main">
                    {artist.followers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h5" color="primary.main">
                    {artist.products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h5" color="primary.main">
                    {artist.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={artist.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({artist.reviews} reviews)
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant={isFollowing ? "outlined" : "contained"}
                fullWidth
                onClick={handleFollow}
                startIcon={<Favorite />}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <IconButton>
                <Share />
              </IconButton>
            </Box>

            <Button
              component={Link}
              to={`/shop?artist=${artist.id}`}
              variant="outlined"
              fullWidth
              startIcon={<Palette />}
            >
              View All Products
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Products" />
          <Tab label="Reviews" />
          <Tab label="About" />
        </Tabs>

        {/* Tab Content */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {artist.products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card
                  component={Link}
                  to={`/product/${product.id}`}
                  sx={{
                    textDecoration: 'none',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        label={product.fandom}
                        size="small"
                        sx={{ bgcolor: 'primary.main', color: 'white' }}
                      />
                      {product.isLimited && (
                        <Chip
                          label="Limited"
                          size="small"
                          color="error"
                        />
                      )}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {selectedTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <List>
                {artist.reviews.map((review) => (
                  <React.Fragment key={review.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{review.user[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ mr: 2 }}>
                              {review.user}
                            </Typography>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {new Date(review.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Review for: {review.product}
                            </Typography>
                            <Typography variant="body1">
                              {review.comment}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {selectedTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About {artist.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {artist.bio}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Location:</strong> {artist.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Instagram:</strong> {artist.social.instagram}
                </Typography>
                <Typography variant="body2">
                  <strong>Twitter:</strong> {artist.social.twitter}
                </Typography>
                <Typography variant="body2">
                  <strong>YouTube:</strong> {artist.social.youtube}
                </Typography>
                {artist.social.website && (
                  <Typography variant="body2">
                    <strong>Website:</strong> {artist.social.website}
                  </Typography>
                )}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main">
                      {artist.followers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Followers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main">
                      {artist.products.length}
                  </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Products
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main">
                      {artist.totalSales}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sales
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main">
                      {artist.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ArtistProfile; 