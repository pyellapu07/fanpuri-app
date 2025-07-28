import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('A4');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [limitedEditionProduct, setLimitedEditionProduct] = useState(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch limited edition product for banner
  useEffect(() => {
    const fetchLimitedEditionProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/featured`);
        if (response.ok) {
          const data = await response.json();
          // Find the first limited edition product
          const limitedProduct = data.products?.find(p => p.isLimitedEdition) || data.find(p => p.isLimitedEdition);
          if (limitedProduct) {
            setLimitedEditionProduct(limitedProduct);
          }
        }
      } catch (error) {
        console.error('Error fetching limited edition product:', error);
      }
    };

    fetchLimitedEditionProduct();
  }, []);

    // Fetch product data from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timeout for Render's spin-up delay
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Reduced timeout
        
        console.log('Fetching product with ID:', id);
        
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Product not found: ${response.status}`);
          } else {
            throw new Error(`Failed to fetch product: ${response.status}`);
          }
        }
        
        const data = await response.json();
        console.log('Received product data from backend:', data);
        console.log('Product ID from URL:', id);
        console.log('Product _id from backend:', data._id);
        console.log('Product name from backend:', data.name);
        console.log('Product artist from backend:', data.artist);
        
        // Transform backend data to match frontend format
        const transformedProduct = {
          id: data.id,
          name: data.name || 'Untitled Product',
          artist: {
            id: data.artist?._id || data.artist?.id || 1,
            name: data.artist?.name || 'Unknown Artist',
            avatar: data.artist?.avatar || 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop',
            isVerified: data.artist?.isVerified || false,
          },
          price: data.price,
          originalPrice: data.originalPrice,
          fandom: data.category || 'General',
          format: data.printType || 'Print',
          genre: data.category || 'General',
          rating: data.rating || 4.5,
          reviews: data.reviewCount || 0,
          description: data.description || 'No description available.',
          longDescription: data.description || 'No detailed description available.',
          specifications: {
            dimensions: data.dimensions ? `${data.dimensions.width}${data.dimensions.unit} x ${data.dimensions.height}${data.dimensions.unit}` : "24\" x 36\" (61cm x 91cm)",
            material: "Premium matte paper",
            weight: "0.2 lbs",
            printing: "High-quality digital print",
            packaging: "Rolled in protective tube",
          },
          images: data.images && data.images.length > 0 
            ? data.images.map(img => img.url)
            : ["https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop"],
          image: data.images && data.images.length > 0 
            ? data.images[0].url 
            : "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop",
          inStock: data.isActive !== false,
          stockQuantity: data.limitedEditionInfo?.availableCopies || 50,
          isLimited: data.isLimitedEdition === true || data.isLimitedEdition === 'true' || false,
          isSoldOut: data.isSoldOut || false,
          soldCopies: data.soldCopies || 0,
          totalCopies: data.totalCopies || 0,
          remainingCopies: Math.max(0, (data.totalCopies || 0) - (data.soldCopies || 0)),
          endDate: data.limitedEditionInfo?.endDate,
          tags: data.tags || ["Fan Art", "Limited Edition"],
        };
        
        setProduct(transformedProduct);
        console.log('Successfully loaded product from backend:', transformedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        
        // Check if it's a 404 (product not found) or other error
        if (err.message.includes('Product not found')) {
          setError('Product not found. This product may have been removed or the URL is incorrect.');
          setProduct(null);
          return;
        }
        
        // Always use fallback data when API fails
        const fallbackProduct = {
          id: parseInt(id),
          name: "Spider-Man: No Way Home Poster",
          artist: {
            id: 1,
            name: "ArtVault Studios",
            avatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop",
            isVerified: true,
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
          image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop",
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

  const cartItem = cart.find((item) => item.id === product?.id);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Swipe handlers for mobile image navigation
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistError('');
    
    if (!waitlistEmail || !waitlistEmail.includes('@')) {
      setWaitlistError('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to waitlist');
    }
      
      setWaitlistSubmitted(true);
      setWaitlistEmail('');
    } catch (error) {
      setWaitlistError(error.message);
    }
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

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
              const response = await fetch(`${API_BASE_URL}/api/products/featured`);
      const data = await response.json();
      console.log('Featured products from backend:', data);
      
      if (data && data.products && data.products.length > 0) {
        console.log('Available product IDs:', data.products.map(p => p.id));
        // Navigate to the first available product
        navigate(`/product/${data.products[0].id}`);
      } else if (data && data.length > 0) {
        console.log('Available product IDs:', data.map(p => p.id || p._id));
        // Navigate to the first available product
        navigate(`/product/${data[0].id || data[0]._id}`);
      }
    } catch (error) {
      console.error('Backend connection test failed:', error);
    }
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
            {error.includes('Product not found') ? 'Product Not Found' : 'Demo Mode: Using sample product data'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.includes('Product not found') 
              ? 'This product may have been removed or the URL is incorrect.' 
              : 'The backend server is currently unavailable. This is a demo product page with sample data.'
            }
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
          variant="outlined"
          onClick={testBackendConnection}
          sx={{ mr: 2 }}
        >
          Browse Real Products
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
      <Container maxWidth="xl" sx={{ py: 0, px: { xs: 0, md: 0 } }}>
      
      {/* Limited Edition Banner - Dynamic Promotional Product */}
      {limitedEditionProduct && (
        <Tooltip title={`Click to view ${limitedEditionProduct.name} - Limited Edition Product`} arrow>
          <Box 
            onClick={() => navigate(`/product/${limitedEditionProduct.id}`)}
            sx={{ 
              bgcolor: '#1976d2', 
              color: 'white', 
              py: 3, 
              px: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              fontSize: '1.25rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#1565c0',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
            <Box
              component="img"
              src={limitedEditionProduct.images?.[0]?.url || limitedEditionProduct.images?.[0]}
              alt={`${limitedEditionProduct.name} - Limited Edition`}
              sx={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: '4px',
                border: '2px solid white'
              }}
            />
            Limited Edition Exclusive - SOLD OUT
          </Box>
        </Tooltip>
      )}
      
      {/* Breadcrumbs */}
        <Box sx={{ py: 2, px: { xs: 2, md: 4 } }}>
          <Breadcrumbs sx={{ fontSize: '0.75rem' }}>
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
          <Grid xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
              {/* Thumbnail Images - Left Side (Hidden on Mobile) */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                flexDirection: 'column', 
                gap: 1 
              }}>
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

              {/* Main Product Image - Right Side */}
              <Box 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                sx={{ 
                  position: 'relative', 
                  flex: 1,
                  width: { xs: '100%', md: '700px' },
                  height: { xs: '400px', md: '600px' },
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  touchAction: 'pan-y' // Allow vertical scrolling but handle horizontal swipes
                }}
              >
                <Box
                  component="img"
                  src={product.images[selectedImage]}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'opacity 0.3s ease',
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

                {/* Mobile Image Navigation Dots */}
                <Box sx={{ 
                  display: { xs: 'flex', md: 'none' },
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  gap: 1
                }}>
                  {product.images.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: selectedImage === index ? '#000' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: selectedImage === index ? '#000' : 'rgba(255,255,255,0.8)',
                        },
                      }}
                    />
                  ))}
                </Box>

                {/* Swipe Instructions (Mobile Only) */}
                {product.images.length > 1 && (
                  <Box sx={{ 
                    display: { xs: 'block', md: 'none' },
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '12px',
                    opacity: 0.8
                  }}>
                    Swipe to view more
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Product Info - Right Side */}
          <Grid xs={12} md={6} sx={{ p: { xs: 1, md: 4 } }}>
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
                  {product.artist.isVerified && (
                                          <img
                        src="/assets/verified_24dp_1976D2_FILL1_wght400_GRAD0_opsz24.svg"
                        alt="Verified Artist"
                        style={{
                          width: '12px',
                          height: '12px',
                          marginLeft: '4px',
                          verticalAlign: 'middle'
                        }}
                      />
                  )}
                </Typography>
              </Box>
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



            {/* Size Selection */}
              <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                  Size
                </Typography>
                <Link 
                  href="#" 
                    sx={{ 
                    fontSize: '0.875rem', 
                    color: '#1976d2', 
                    textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                    gap: 0.5
                    }}
                  >
                  <Box component="span" sx={{ fontSize: '1rem' }}>📏</Box>
                  View Size Chart
                </Link>
              </Box>
              
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                }}
              >
                <MenuItem value="A4">A4 (210 × 297 mm)</MenuItem>
                <MenuItem value="A3">A3 (297 × 420 mm)</MenuItem>
                <MenuItem value="A2">A2 (420 × 594 mm)</MenuItem>
                <MenuItem value="A1">A1 (594 × 841 mm)</MenuItem>
                <MenuItem value="A0">A0 (841 × 1189 mm)</MenuItem>
              </Select>
            </Box>

            {/* Add to Cart */}
              <Box sx={{ mb: 4 }}>
                  {cartItem ? (
                    <Button
                      variant="contained"
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
                    width: 'fit-content',
                    minWidth: '200px',
                      }}
                    >
                      <span>IN CART</span>
                      <Select
                        value={cartItem.quantity}
                    onChange={e => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      updateQuantity(product.id, Number(e.target.value)); 
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
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
                      <MenuItem 
                        key={i + 1} 
                        value={i + 1} 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        sx={{ fontSize: '0.8rem' }}
                      >
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </Button>
                  ) : product.isSoldOut ? (
                    <Button
                      variant="contained"
                      size="large"
                      disabled
                        sx={{
                        bgcolor: '#9e9e9e',
                        color: 'white',
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        py: 1.5,
                          borderRadius: '50px',
                        letterSpacing: '0.5px',
                        boxShadow: 'none',
                        width: 'fit-content',
                        minWidth: '200px',
                        cursor: 'not-allowed',
                        '&:hover': {
                          bgcolor: '#9e9e9e',
                          },
                        }}
                      >
                      SOLD OUT
                    </Button>
                  ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!user) {
                      setLoginDialogOpen(true);
                    } else {
                      addToCart(product);
                    }
                  }}
                  variant="contained"
                  size="large"
                        sx={{
                          bgcolor: '#F3F3F7',
                          color: 'black',
                          textTransform: 'uppercase',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: '50px',
                          letterSpacing: '0.5px',
                    position: 'relative',
                    overflow: 'hidden',
                          boxShadow: 'none',
                    width: 'fit-content',
                    minWidth: '200px',
                          '&:hover': {
                      transform: 'translateY(-1px)',
                      color: 'white',
                      '& .gif-overlay': {
                        opacity: 1,
                      },
                    },
                    transition: 'all 0.3s ease',
                    display: 'block',
                    flexShrink: 0,
                  }}
                >
                  {/* GIF Overlay for Hover Effect */}
                  <Box
                    className="gif-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/Add to cart animation.gif"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50px',
                        }}
                      onMouseEnter={(e) => {
                        // Restart GIF animation by reloading the image
                        const img = e.target;
                        const src = img.src;
                        img.src = '';
                        img.src = src;
                      }}
                    />
                  </Box>
                  {/* Button Text */}
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                  Add to Cart
                  </Box>
                </Button>
              )}
            </Box>

            {/* Waitlist Section for Sold Out Limited Edition Products */}
            {product.isLimited && product.isSoldOut && (
              <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#d32f2f' }}>
                  🔥 Limited Edition - SOLD OUT
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  This limited edition product is currently sold out. Join our waitlist to be notified when it becomes available again!
                </Typography>
                
                {waitlistSubmitted ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Thank you! You've been added to the waitlist. We'll notify you when this product is back in stock.
                  </Alert>
                ) : (
                  <Box component="form" onSubmit={handleWaitlistSubmit}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        type="email"
                        placeholder="Enter your email address"
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        size="small"
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          },
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#d32f2f',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: '#b71c1c',
                          },
                        }}
                      >
                        Notify Me
                      </Button>
                    </Box>
                    {waitlistError && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {waitlistError}
                      </Alert>
                  )}
                </Box>
                )}
              </Box>
            )}

            {/* Limited Edition Info for Available Products */}
            {product.isLimited && !product.isSoldOut && (
              <Box sx={{ mb: 4, p: 3, border: '1px solid #ff9800', borderRadius: '8px', bgcolor: '#fff3e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f57c00' }}>
                  ⚡ Limited Edition - Only {product.remainingCopies} Left!
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  This is a limited edition product with only {product.remainingCopies} copies remaining. Don't miss out!
              </Typography>
              </Box>
            )}

              {/* Product Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#333' }}>
                  {product.description}
                </Typography>
            </Box>

            {/* Shipping Info */}
              <Card sx={{ p: 3, bgcolor: '#F3F3F7', borderRadius: '8px', boxShadow: 'none' }}>
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
      
      {/* Login/Signup Dialog */}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          Please login or sign up to add items to your cart.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={() => { setLoginDialogOpen(false); window.location.href = '/login'; }} color="primary" variant="contained">Login / Signup</Button>
        </DialogActions>
      </Dialog>
      </Container>
      </Box>
  );
};

export default ProductDetail; 