import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Button,
  Rating,
  IconButton,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Star,
  LocalShipping,
  Security,
  Refresh,
  ArrowBack,
  ExpandMore,
} from '@mui/icons-material';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Add timeout for Render's spin-up delay
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(`https://fanpuri-app-1.onrender.com/api/products/${id}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform backend data to match frontend format
        const transformedProduct = {
          id: data.product.id,
          name: data.product.name || 'Untitled Product',
          artist: {
            id: data.product.artist?.id || 1,
            name: data.product.artist?.name || 'Unknown Artist',
            avatar: data.product.artist?.avatar || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop',
          },
          price: data.product.price,
          originalPrice: data.product.originalPrice,
          fandom: data.product.category || 'General',
          format: data.product.format || 'Print',
          genre: data.product.genre || 'General',
          rating: data.product.rating || 4.5,
          reviews: data.product.reviewCount || 0,
          description: data.product.description || 'No description available.',
          longDescription: data.product.longDescription || data.product.description || 'No detailed description available.',
          specifications: {
            dimensions: data.product.dimensions || "24\" x 36\" (61cm x 91cm)",
            material: data.product.material || "Premium matte paper",
            weight: data.product.weight || "0.2 lbs",
            printing: data.product.printing || "High-quality digital print",
            packaging: data.product.packaging || "Rolled in protective tube",
          },
          images: data.product.images && data.product.images.length > 0 
            ? data.product.images.map(img => img.url)
            : ["https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop"],
          inStock: data.product.inStock !== false,
          stockQuantity: data.product.stockQuantity || 50,
          isLimited: data.product.isLimited || false,
          endDate: data.product.endDate,
          tags: data.product.tags || ["Fan Art", "Limited Edition"],
        };
        
        setProduct(transformedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        // Always use fallback data when API fails
        const fallbackProduct = {
          id: parseInt(id),
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
          description: "High-quality poster featuring Spider-Man in his iconic pose from No Way Home.",
          longDescription: "This exclusive Spider-Man: No Way Home poster is a must-have for any Marvel fan. The artwork showcases Spider-Man in his most iconic pose, capturing the essence of the beloved superhero in a moment of triumph and determination.",
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
          ],
          inStock: true,
          stockQuantity: 45,
          isLimited: false,
          endDate: null,
          tags: ["Spider-Man", "Marvel", "Poster", "No Way Home", "Superhero"],
        };
        
        setProduct(fallbackProduct);
        setError(null); // Clear any previous errors
        console.log('Using fallback product data:', fallbackProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const [product, setProduct] = useState(null);

  const cartItem = cart.find((item) => item.id === parseInt(id));

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product?.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    
    if (cartItem) {
      updateQuantity(parseInt(id), cartItem.quantity + quantity);
    } else {
      addToCart({ ...product, quantity });
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const calculateDiscount = () => {
    if (!product?.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Re-fetch the product data
    window.location.reload();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading product details...
          <br />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This may take up to 30 seconds if the server is starting up
          </Typography>
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Demo Mode: Using sample product data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The backend server is currently unavailable. This is a demo product page with sample data.
          </Typography>
        </Alert>
        <Button
          variant="outlined"
          onClick={handleRetry}
          sx={{ mr: 2 }}
        >
          Retry
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/shop')}
        >
          Back to Shop
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="warning">
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 0, px: { xs: 2, md: 0 } }}>
        {/* Breadcrumbs */}
        <Box sx={{ py: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Breadcrumbs sx={{ fontSize: '0.875rem' }}>
            <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: 'none' }}>
              Home
            </Link>
            <Link component={RouterLink} color="inherit" to="/shop" sx={{ textDecoration: 'none' }}>
              Shop
            </Link>
            <Link component={RouterLink} color="inherit" to={`/shop?fandom=${product.fandom.toLowerCase()}`} sx={{ textDecoration: 'none' }}>
              {product.fandom}
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              {product.name}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={0}>
          {/* Product Images - Left Side */}
          <Grid xs={12} md={6} sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ position: 'relative' }}>
              {/* Main Product Image */}
              <Box
                component="img"
                src={product.images[selectedImage]}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: { xs: 400, sm: 500, md: 600 },
                  objectFit: 'cover',
                  borderRadius: '8px',
                  mb: 2,
                }}
              />
              
              {/* Wishlist Icon */}
              <IconButton
                onClick={handleWishlist}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,1)',
                  },
                }}
              >
                {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>

              {/* Thumbnail Images */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #000' : '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#000',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Product Info - Right Side */}
          <Grid xs={12} md={6} sx={{ p: { xs: 2, md: 4 } }}>
            <Box>
              {/* Fandom Badge */}
              <Chip
                label={product.fandom}
                sx={{
                  mb: 2,
                  bgcolor: '#000',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              />

              {/* Product Title */}
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  color: '#000',
                }}
              >
                {product.name}
              </Typography>

              {/* Artist Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  component="img"
                  src={product.artist.avatar}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    mr: 2,
                    objectFit: 'cover',
                  }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    by{' '}
                    <Link
                      component={RouterLink}
                      to={`/artist/${product.artist.id}`}
                      sx={{
                        color: '#000',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {product.artist.name}
                    </Link>
                  </Typography>
                </Box>
              </Box>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating 
                  value={product.rating} 
                  precision={0.1} 
                  readOnly 
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews} reviews)
                </Typography>
              </Box>

              {/* Price Section */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      color: '#000',
                    }}
                  >
                    ₹{product.price}
                  </Typography>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          textDecoration: 'line-through',
                          color: '#666',
                          fontWeight: 400,
                        }}
                      >
                        ₹{product.originalPrice}
                      </Typography>
                      <Chip
                        label={`${calculateDiscount()}% OFF`}
                        sx={{
                          bgcolor: '#e74c3c',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </>
                  )}
                </Box>
                
                {/* Payment Options */}
                <Typography variant="body2" color="text.secondary">
                  4 interest-free payments with Afterpay
                </Typography>
              </Box>

              {/* Stock Status */}
              <Box sx={{ mb: 4 }}>
                {product.inStock ? (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#2ecc71',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    ✓ In Stock ({product.stockQuantity} available)
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error.main" fontWeight={600}>
                    Out of Stock
                  </Typography>
                )}
              </Box>

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 80 }}>
                    Quantity
                  </Typography>
                  {cartItem ? (
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: '#000',
                        color: '#fff',
                        borderRadius: '50px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        py: 1.5,
                        textTransform: 'uppercase',
                        boxShadow: 'none',
                        letterSpacing: '0.5px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 3,
                      }}
                    >
                      <span>IN CART</span>
                      <Select
                        value={cartItem.quantity}
                        onChange={e => updateQuantity(parseInt(id), Number(e.target.value))}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          borderRadius: '50px',
                          fontWeight: 700,
                          minWidth: 50,
                          fontSize: '0.8rem',
                          color: 'white',
                          '& .MuiSelect-select': { 
                            textAlign: 'center', 
                            py: 0.5,
                            color: 'white',
                            pr: 1,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                          },
                        }}
                      >
                        {[...Array(12)].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: '0.8rem' }}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </Button>
                  ) : (
                    <>
                      <Select
                        value={quantity}
                        onChange={handleQuantityChange}
                        size="small"
                        sx={{
                          minWidth: 80,
                          height: 45,
                          borderRadius: '50px',
                          '& .MuiSelect-select': {
                            textAlign: 'center',
                            py: 1,
                          },
                        }}
                      >
                        {[...Array(Math.min(12, product.stockQuantity))].map((_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        sx={{
                          bgcolor: '#F3F3F7',
                          color: 'black',
                          textTransform: 'uppercase',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: '50px',
                          letterSpacing: '0.5px',
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: '#e0e0e0',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {/* Final Sale Notice */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>
                  THIS ITEM IS FINAL SALE.
                </Typography>
              </Box>

              {/* Gift Box Option */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input type="checkbox" id="giftBox" />
                  <label htmlFor="giftBox">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Gift Box (₹3.50)
                    </Typography>
                  </label>
                </Box>
              </Box>

              {/* Product Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#333' }}>
                  {product.description}
                </Typography>
              </Box>

              {/* Shipping Info */}
              <Card sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: '8px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Shipping & Returns
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShipping sx={{ mr: 1, fontSize: 20, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    Free shipping on orders over ₹500
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Security sx={{ mr: 1, fontSize: 20, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    Secure payment processing
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Refresh sx={{ mr: 1, fontSize: 20, color: '#666' }} />
                  <Typography variant="body2" color="text.secondary">
                    30-day return policy
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetail; 