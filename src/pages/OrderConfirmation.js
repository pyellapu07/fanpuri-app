import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, LocalShipping, Payment } from '@mui/icons-material';
import API_BASE_URL from '../config';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
        if (response.ok) {
          const orderData = await response.json();
          setOrder(orderData);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/shop')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Order #{orderId}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingBag sx={{ mr: 1 }} />
              <Typography variant="body1">
                {order.items.length} item(s) ordered
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalShipping sx={{ mr: 1 }} />
              <Typography variant="body1">
                Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Payment sx={{ mr: 1 }} />
              <Typography variant="body1">
                Payment: {order.paymentMethod === 'razorpay' ? 'Paid via Razorpay' : 'Cash on Delivery'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Items Ordered
            </Typography>
            {order.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body1">₹{item.price * item.quantity}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant="body2">
              {order.shippingDetails.firstName} {order.shippingDetails.lastName}<br />
              {order.shippingDetails.address}<br />
              {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}<br />
              {order.shippingDetails.country}<br />
              Phone: {order.shippingDetails.phone}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{order.orderSummary.subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>{order.orderSummary.shipping === 0 ? 'Free' : `₹${order.orderSummary.shipping}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (18% GST):</Typography>
                <Typography>₹{order.orderSummary.tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">₹{order.orderSummary.total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What's Next?
              </Typography>
              <Typography variant="body2" paragraph>
                You'll receive an email confirmation shortly. We'll notify you when your order ships.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/shop')}
                sx={{ mb: 1 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/orders')}
              >
                View My Orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderConfirmation;