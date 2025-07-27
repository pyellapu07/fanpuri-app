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
  TextField,
  Alert,
  Breadcrumbs,
  Link,
  Badge,
} from '@mui/material';
import {
  Favorite,
  ShoppingCart,
  Share,
  Star,
  LocalShipping,
  Security,
  Refresh,
  ZoomIn,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, Link as RouterLink } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data
  const product = {
    id: 1,
    name: "Spider-Man: No Way Home Poster",
    artist: {
      id: 1,
      name: "ArtVault Studios",
      avatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop",
    },
    price: 29.99,
    originalPrice: 39.99,
    fandom: "Marvel",
    format: "Poster",
    genre: "Action",
    rating: 4.8,
    reviews: 127,
    description: "High-quality poster featuring Spider-Man in his iconic pose from No Way Home. This stunning artwork captures the essence of the beloved superhero in a moment of triumph and determination. Perfect for any Marvel fan's collection.",
    longDescription: "This exclusive Spider-Man: No Way Home poster is a must-have for any Marvel fan. The artwork showcases Spider-Man in his most iconic pose, capturing the essence of the beloved superhero in a moment of triumph and determination. Printed on premium quality paper with vibrant colors that will last for years to come. The poster comes in a standard size that fits most frames and is perfect for displaying in your home, office, or any space that needs a touch of superhero magic. Each poster is carefully packaged to ensure it arrives in perfect condition. This is an officially licensed product created by talented fan artists who share your passion for the Marvel universe.",
    specifications: {
      dimensions: "24\" x 36\" (61cm x 91cm)",
      material: "Premium matte paper",
      weight: "0.2 lbs",
      printing: "High-quality digital print",
      packaging: "Rolled in protective tube",
    },
    images: [
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=600&h=800&fit=crop",
    ],
    inStock: true,
    stockQuantity: 45,
    isLimited: false,
    endDate: null,
    tags: ["Spider-Man", "Marvel", "Poster", "No Way Home", "Superhero"],
    reviews: [
      {
        id: 1,
        user: "MarvelFan123",
        rating: 5,
        comment: "Amazing artwork! The Spider-Man poster is even better in person. The colors are vibrant and the quality is outstanding. Highly recommend!",
        date: "2024-01-15",
        verified: true,
      },
      {
        id: 2,
        user: "SpideyLover",
        rating: 4,
        comment: "Great quality poster. The artwork is stunning and it arrived in perfect condition. Will definitely buy more from this artist!",
        date: "2024-01-10",
        verified: true,
      },
      {
        id: 3,
        user: "ComicCollector",
        rating: 5,
        comment: "Perfect addition to my Marvel collection. The poster looks exactly like the image and the shipping was fast.",
        date: "2024-01-08",
        verified: false,
      },
    ],
    relatedProducts: [
      {
        id: 2,
        name: "Batman: The Dark Knight Print",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=300&h=400&fit=crop",
        fandom: "DC Comics",
      },
      {
        id: 3,
        name: "Avengers: Endgame Limited Edition",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
        fandom: "Marvel",
      },
      {
        id: 4,
        name: "Iron Man Arc Reactor T-Shirt",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
        fandom: "Marvel",
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Adding ${quantity} of ${product.name} to cart`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const calculateDiscount = () => {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} color="inherit" to="/">
          Home
        </Link>
        <Link component={RouterLink} color="inherit" to="/shop">
          Shop
        </Link>
        <Link component={RouterLink} color="inherit" to={`/shop?fandom=${product.fandom.toLowerCase()}`}>
          {product.fandom}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="600"
              image={product.images[selectedImage]}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
          
          {/* Thumbnail Images */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {product.images.map((image, index) => (
              <Card
                key={index}
                sx={{
                  width: 80,
                  height: 80,
                  cursor: 'pointer',
                  border: selectedImage === index ? 2 : 1,
                  borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                }}
                onClick={() => setSelectedImage(index)}
              >
                <CardMedia
                  component="img"
                  height="80"
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Fandom Tag */}
            <Chip
              label={product.fandom}
              sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }}
            />

            {/* Product Title */}
            <Typography variant="h3" component="h1" gutterBottom>
              {product.name}
            </Typography>

            {/* Artist Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={product.artist.avatar} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="subtitle1">
                  by{' '}
                  <Link
                    component={RouterLink}
                    to={`/artist/${product.artist.id}`}
                    color="primary"
                    sx={{ textDecoration: 'none' }}
                  >
                    {product.artist.name}
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews} reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary.main" fontWeight={600} sx={{ mr: 2 }}>
                ${product.price}
              </Typography>
              {product.originalPrice && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ${product.originalPrice}
                  </Typography>
                  <Chip
                    label={`${calculateDiscount()}% OFF`}
                    color="error"
                    size="small"
                  />
                </Box>
              )}
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {product.inStock ? (
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  ✓ In Stock ({product.stockQuantity} available)
                </Typography>
              ) : (
                <Typography variant="body2" color="error.main">
                  Out of Stock
                </Typography>
              )}
            </Box>

            {/* Quantity and Add to Cart */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stockQuantity }}
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  sx={{ flexGrow: 1 }}
                >
                  Add to Cart
                </Button>
                <IconButton
                  color={isWishlisted ? "primary" : "default"}
                  onClick={handleWishlist}
                >
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Product Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Shipping Info */}
            <Card sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Shipping & Returns
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocalShipping sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Free shipping on orders over $50
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Security sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  Secure payment processing
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Refresh sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  30-day return policy
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>

        {/* Tab Content */}
        {selectedTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Description
              </Typography>
              <Typography variant="body1" paragraph>
                {product.longDescription}
              </Typography>
            </CardContent>
          </Card>
        )}

        {selectedTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Specifications
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </Typography>
                      <Typography variant="body2">
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {selectedTab === 2 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Customer Reviews ({product.reviews})
                </Typography>
                <Button variant="outlined">
                  Write a Review
                </Button>
              </Box>
              
              <List>
                {product.reviews.map((review) => (
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
                            {review.verified && (
                              <Chip
                                label="Verified Purchase"
                                size="small"
                                color="success"
                                sx={{ ml: 2 }}
                              />
                            )}
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                              {new Date(review.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body1">
                            {review.comment}
                          </Typography>
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
      </Box>

      {/* Related Products */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          You Might Also Like
        </Typography>
        <Grid container spacing={3}>
          {product.relatedProducts.map((relatedProduct) => (
            <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
              <Card
                component={RouterLink}
                to={`/product/${relatedProduct.id}`}
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
                  image={relatedProduct.image}
                  alt={relatedProduct.name}
                />
                <CardContent>
                  <Chip
                    label={relatedProduct.fandom}
                    size="small"
                    sx={{ mb: 1, bgcolor: 'primary.main', color: 'white' }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    {relatedProduct.name}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    ${relatedProduct.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail; 