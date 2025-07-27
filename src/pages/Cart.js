import React, { useState } from 'react';
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
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Payment,
} from '@mui/icons-material';

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return cart.length > 0 ? 99 : 0; // Fixed shipping cost
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setCheckoutDialogOpen(true);
  };

  const handleCheckoutConfirm = () => {
    setLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setLoading(false);
      setCheckoutDialogOpen(false);
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <Box sx={{ bgcolor: 'white', minHeight: '60vh', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
          <Box sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>
            <ShoppingCart sx={{ fontSize: { xs: 60, md: 80 }, color: '#ccc', mb: 3 }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Looks like you haven't added any items to your cart yet.
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
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '60vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 1, md: 0 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, md: 0 } }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            mb: 1, 
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' } 
          }}>
            Shopping Cart
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ 
            fontSize: { xs: '0.875rem', md: '1rem' } 
          }}>
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </Typography>
        </Box>

        {/* Mobile Layout */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {cart.map((item) => (
            <Card key={item.id} sx={{ 
              mb: 2, 
              borderRadius: '5px', 
              overflow: 'hidden',
              boxShadow: 'none',
              border: '1px solid #e0e0e0'
            }}>
              <Box sx={{ display: 'flex', p: 0, gap: 0 }}>
                {/* Product Image - Mobile */}
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  flexShrink: 0,
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    width="100%"
                    image={item.image}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                </Box>

                {/* Product Details - Mobile */}
                <Box sx={{ flex: 1, minWidth: 0, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        textTransform: 'uppercase', 
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}>
                        {item.fandom || item.category}
                      </Typography>
                      <Typography variant="body2" component="h3" sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        fontSize: '0.75rem',
                        display: 'block',
                        mb: 0.5
                      }}>
                        by {item.artist}
                      </Typography>
                      <Typography variant="body1" color="primary" sx={{ 
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        ₹{item.price}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      size="small"
                      sx={{ 
                        color: '#999',
                        p: 0.5,
                        ml: 1,
                        '&:hover': {
                          color: '#666',
                        },
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
                  </Box>

                  {/* Quantity Controls - Mobile */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                      Qty:
                    </Typography>
                    <Select
                      value={item.quantity}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuantityChange(item.id, Number(e.target.value));
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
                        minWidth: 70,
                        height: 32,
                        '& .MuiSelect-select': { 
                          textAlign: 'center', 
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ddd',
                          borderRadius: '50px',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '0.75rem',
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
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}

          {/* Mobile Order Summary */}
          <Card sx={{ 
            p: 2, 
            borderRadius: '5px', 
            mt: 3,
            boxShadow: 'none',
            border: '1px solid #e0e0e0',
            bgcolor: '#F3F3F7'
          }}>
            <Typography variant="h6" component="h2" sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: '1rem'
            }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  Subtotal ({cart.length} items)
                </Typography>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  ₹{calculateSubtotal().toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  Shipping
                </Typography>
                <Typography sx={{ fontSize: '0.875rem' }}>
                  ₹{calculateShipping().toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  ₹{calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              startIcon={<Payment />}
              sx={{
                bgcolor: '#000',
                color: 'white',
                py: 1.2,
                borderRadius: '50px',
                fontWeight: 700,
                textTransform: 'uppercase',
                mb: 1.5,
                fontSize: '0.875rem',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              component={Link}
              to="/shop"
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<ArrowBack />}
              sx={{
                borderColor: '#000',
                color: '#000',
                py: 1.2,
                borderRadius: '50px',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '0.875rem',
                '&:hover': {
                  borderColor: '#333',
                  color: '#333',
                },
              }}
            >
              Continue Shopping
            </Button>
          </Card>
        </Box>

        {/* Desktop Layout */}
        <Grid container spacing={4} sx={{ 
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'space-between',
          width: '100%'
        }}>
          {/* Cart Items */}
          <Grid xs={12} md={9}>
            <Box sx={{ mb: 3 }}>
              {/* Column Headers */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 140px 160px 120px',
                gap: 6,
                mb: 2,
                px: 5,
                py: 2,
                borderBottom: '1px solid #e0e0e0'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  ITEM
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>
                  QTY
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>
                  TOTAL
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>
                  
                </Typography>
              </Box>

                              {cart.map((item) => (
                <Card key={item.id} sx={{ 
                  mb: 2, 
                  borderRadius: '5px', 
                  overflow: 'hidden',
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 140px 160px 120px',
                    gap: 6,
                    p: 5,
                    alignItems: 'center'
                  }}>
                    {/* Product Details */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      {/* Product Image */}
                      <Box sx={{ 
                        width: 120, 
                        height: 120, 
                        borderRadius: '5px',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          width="100%"
                          image={item.image}
                          alt={item.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Box>

                                          {/* Product Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        textTransform: 'uppercase', 
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        color: '#666'
                      }}>
                        {item.fandom || item.category}
                      </Typography>
                      <Typography variant="body2" component="h3" sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        fontSize: '0.875rem',
                        lineHeight: 1.2
                      }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        fontSize: '0.75rem',
                        display: 'block'
                      }}>
                        by {item.artist}
                      </Typography>
                      <Typography variant="body1" color="primary" sx={{ 
                        fontWeight: 700,
                        fontSize: '1rem',
                        mt: 0.5
                      }}>
                        ₹{item.price}
                      </Typography>
                    </Box>
                    </Box>

                    {/* Quantity Dropdown */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Select
                        value={item.quantity}
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuantityChange(item.id, Number(e.target.value));
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
                          minWidth: 80,
                          height: 36,
                          '& .MuiSelect-select': { 
                            textAlign: 'center', 
                            py: 0.5,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#ddd',
                            borderRadius: '50px',
                          },
                          '& .MuiSvgIcon-root': {
                            fontSize: '0.875rem',
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
                            sx={{ fontSize: '0.875rem' }}
                          >
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>

                    {/* Total Price */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Delete Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton
                        onClick={() => removeFromCart(item.id)}
                        size="small"
                        sx={{ 
                          color: '#999',
                          '&:hover': {
                            color: '#666',
                          },
                        }}
                      >
                        <span 
                          className="material-symbols-outlined"
                          style={{
                            fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '20px'
                          }}
                        >
                          delete
                        </span>
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid xs={12} md={3}>
            <Card sx={{ p: 3, borderRadius: '5px', position: 'sticky', top: 0, boxShadow: 'none', border: '1px solid #e0e0e0', bgcolor: '#F3F3F7' }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal ({cart.length} items)</Typography>
                  <Typography>₹{calculateSubtotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>₹{calculateShipping().toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ₹{calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                startIcon={<Payment />}
                sx={{
                  bgcolor: '#000',
                  color: 'white',
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  mb: 2,
                  '&:hover': {
                    bgcolor: '#333',
                  },
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                component={Link}
                to="/shop"
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<ArrowBack />}
                sx={{
                  borderColor: '#000',
                  color: '#000',
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  '&:hover': {
                    borderColor: '#333',
                    color: '#333',
                  },
                }}
              >
                Continue Shopping
              </Button>
            </Card>
          </Grid>
        </Grid>

        {/* Checkout Dialog */}
        <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Checkout
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Total Amount: ₹{calculateTotal().toFixed(2)}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This is a demo checkout. In a real application, you would be redirected to a payment gateway.
            </Alert>
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CircularProgress size={20} />
                <Typography>Processing your order...</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckoutDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleCheckoutConfirm}
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
            >
              Confirm Order
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Cart; 