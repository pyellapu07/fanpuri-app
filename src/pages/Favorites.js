import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const Favorites = () => {
  const { favorites, removeFromFavorites, isInFavorites } = useFavorites();
  const { cart, addToCart, updateQuantity } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getCartItem = (productId) => cart.find((item) => item.id === productId);

  const handleAddToCart = (product) => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    addToCart(product);
    setTimeout(() => setAddedProduct(product), 0);
  };

  const handleRemoveFromFavorites = (productId) => {
    removeFromFavorites(productId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Login Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please login to view your favorites.
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#000',
              color: '#fff',
              '&:hover': {
                bgcolor: '#222',
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '60vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 1, md: 0 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, md: 0 } }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ mb: 2, color: '#666' }}
          >
            ← BACK TO HOME
          </Button>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            mb: 1, 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' } 
          }}>
            My Favorites
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', md: '1rem' } 
          }}>
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites
          </Typography>
        </Box>

        {favorites.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
            <Favorite sx={{ fontSize: { xs: 60, md: 80 }, color: '#ccc', mb: 3 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              No favorites yet
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Start adding products to your favorites to see them here.
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              sx={{
                bgcolor: '#000',
                color: 'white',
                px: { xs: 3, md: 4 },
                py: { xs: 1, md: 1.5 },
                borderRadius: '50px',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: { xs: '0.875rem', md: '1rem' },
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Box sx={{ 
            position: 'relative', 
            pb: 4,
          }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)', // 2 cards per row on mobile
                sm: 'repeat(3, 1fr)', // 3 cards per row on small tablets
                md: 'repeat(4, 1fr)', // 4 cards per row on desktop
                lg: 'repeat(5, 1fr)', // 5 cards per row on large screens
              },
              gap: { xs: 1.5, sm: 2, md: 3 }, // Tighter spacing like Funko
              px: { xs: 1, sm: 2, md: 3 }, // Less padding on mobile
            }}>
              {favorites.map((product) => {
                const cartItem = getCartItem(product.id);
                return (
                  <Box key={product.id}>
                    <Card
                      component={Link}
                      to={`/product/${product.id}`}
                      sx={{
                        textDecoration: 'none',
                        height: { xs: 420, sm: 460 }, // Increased height to fit 2 lines
                        width: '100%',
                        minWidth: 0,
                        maxWidth: '100%',
                        transition: 'all 0.3s ease-in-out',
                        borderRadius: 2, // Smaller radius like Funko
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Lighter shadow
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'white',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                          borderColor: '#ccc',
                        },
                      }}
                    >
                      {/* Product Image - Funko Style */}
                      <Box sx={{ position: 'relative', height: { xs: 220, sm: 260 }, width: '100%' }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          width="100%"
                          image={product.image}
                          alt={product.name}
                          sx={{ 
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                            minWidth: '100%',
                            maxWidth: '100%',
                          }}
                        />
                        
                        {/* Remove from favorites button - Same as Cart page */}
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFromFavorites(product.id);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: 'rgba(255,255,255,0.95)',
                            zIndex: 10,
                            width: 40,
                            height: 40,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,1)',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <img 
                            src="/assets/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"
                            alt="Delete"
                            style={{
                              width: '20px',
                              height: '20px'
                            }}
                          />
                        </IconButton>

                        {/* Limited Edition Banner */}
                        {product.isLimitedEdition && (
                          <>
                            {/* Custom Limited Edition Banner */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: '8px',
                                zIndex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              {/* Banner Background */}
                              <Box
                                component="img"
                                src="/assets/limited banner rectangle.svg"
                                alt="Limited Edition"
                                sx={{
                                  width: '25px',
                                  height: 'auto',
                                }}
                              />
                              
                              {/* Icon */}
                              <Box
                                component="img"
                                src="/assets/limited icon.svg"
                                alt="Limited Icon"
                                sx={{
                                  position: 'absolute',
                                  top: '10%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: '18px',
                                  height: '18px',
                                  zIndex: 3,
                                }}
                              />
                              
                              {/* Text */}
                              <Typography
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translateX(-50%) rotate(90deg)',
                                  fontFamily: '"Open Sans", sans-serif',
                                  fontWeight: 800,
                                  fontSize: '16px',
                                  color: '#000',
                                  textTransform: 'uppercase',
                                  letterSpacing: '-0.06em',
                                  lineHeight: 1,
                                  zIndex: 3,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                LIMITED
                              </Typography>
                            </Box>

                            {/* Sold Out Overlay */}
                            {product.isSoldOut && (
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
                                  zIndex: 3,
                                }}
                              >
                                <Box
                                  sx={{
                                    bgcolor: '#d32f2f',
                                    color: 'white',
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                  }}
                                >
                                  SOLD OUT
                                </Box>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                      
                      {/* Product Details - Funko Style */}
                      <CardContent sx={{ 
                        p: { xs: 1.5, sm: 2 }, // Tighter padding on mobile
                        pb: 1, 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: { xs: 180, sm: 200 }, // Increased height to accommodate larger text container
                        textAlign: 'left',
                        justifyContent: 'space-between'
                      }}>

                        {/* Text Content Container */}
                        <Box sx={{ 
                          flexGrow: 1,
                          height: { xs: 120, sm: 140 }, // Increased height to fit 2 lines properly
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                          {/* Artist Name - Above Title in CAPS */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography 
                              variant="caption" 
                              color="text.secondary" 
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                mb: 0.25,
                                textAlign: 'left',
                                textTransform: 'uppercase',
                                fontWeight: 400,
                                letterSpacing: '0.5px',
                                color: '#666',
                              }}
                            >
                              {typeof product.artist === 'object' ? product.artist?.name || 'Unknown Artist' : product.artist || 'Unknown Artist'}
                            </Typography>
                            {product.isArtistVerified && (
                                                              <img
                                  src="/assets/verified_24dp_1976D2_FILL1_wght400_GRAD0_opsz24.svg"
                                  alt="Verified Artist"
                                  style={{
                                    width: '12px',
                                    height: '12px',
                                    marginBottom: '2px'
                                  }}
                                />
                            )}
                          </Box>

                          {/* Product Name - Larger */}
                          <Typography 
                            variant="h6" 
                            component="h3" 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              lineHeight: 1.3,
                              mb: 0.25,
                              flexGrow: 1, // Take available space in fixed container
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              color: '#000',
                              textAlign: 'left',
                            }}
                          >
                            {product.name || 'Untitled Product'}
                          </Typography>

                          {/* Limited Stock Indicator - Below Product Title */}
                          {product.isLimitedEdition && !product.isSoldOut && product.remainingCopies > 0 && product.remainingCopies <= 10 && (
                            <Typography
                              sx={{
                                fontFamily: '"Open Sans", sans-serif',
                                fontWeight: 800,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                color: '#1976d2',
                                textAlign: 'left',
                                letterSpacing: '-0.06em',
                                lineHeight: 1,
                                mb: 0.5,
                              }}
                            >
                              Only {product.remainingCopies} Left!
                            </Typography>
                          )}

                          {/* Price with Original Price */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              color="primary.main" 
                              fontWeight={700}
                              sx={{ 
                                fontSize: '1.2rem',
                                textAlign: 'left',
                                color: '#000',
                              }}
                            >
                              ₹{product.price}
                            </Typography>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontSize: '0.9rem',
                                  textDecoration: 'line-through',
                                  color: '#e74c3c',
                                  fontWeight: 500,
                                }}
                              >
                                ₹{product.originalPrice}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Add to Cart Button - Same as Home.js */}
                        {cartItem ? (
                          <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            sx={{
                              bgcolor: '#000',
                              color: '#fff',
                              borderRadius: '50px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              py: 1.2,
                              textTransform: 'uppercase',
                              boxShadow: 'none',
                              letterSpacing: '0.5px',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              px: 2,
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
                                minWidth: 40,
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
                            fullWidth
                            size="large"
                            disabled
                            sx={{
                              bgcolor: '#9e9e9e',
                              color: 'white',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              py: 1.2,
                              borderRadius: '50px',
                              letterSpacing: '0.5px',
                              boxShadow: 'none',
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
                                handleAddToCart(product);
                              }
                            }}
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                              bgcolor: '#F3F3F7',
                              color: 'black',
                              textTransform: 'uppercase',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              py: 1.2,
                              borderRadius: '50px',
                              letterSpacing: '0.5px',
                              position: 'relative',
                              overflow: 'hidden',
                              boxShadow: 'none',
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
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Login Dialog */}
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

export default Favorites; 