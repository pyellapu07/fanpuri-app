import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { auth } from '../firebase-config';
import API_BASE_URL from '../config';

const steps = ['Shipping Details', 'Payment', 'Review & Confirm'];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      
      // Pre-fill email if available
      if (user.email) {
        setShippingDetails(prev => ({
          ...prev,
          email: user.email
        }));
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const calculateOrderSummary = () => {
    const subtotal = getTotalPrice();
    const shipping = subtotal > 2500 ? 0 : 200; // Free shipping over ₹2500
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: cart.length
    };
  };

  const handleShippingChange = (field) => (event) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate shipping details
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
      const missingFields = requiredFields.filter(field => !shippingDetails[field]);
      
      if (missingFields.length > 0) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Calculate order summary
      setOrderSummary(calculateOrderSummary());
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      setLoading(true);
      
      // Create order in database
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cart,
        shippingDetails,
        paymentMethod,
        paymentId,
        orderSummary,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        clearCart();
        navigate(`/order-confirmation/${result.orderId}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpay = () => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
      amount: orderSummary.total * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Fanpuri',
      description: `Order for ${orderSummary.itemCount} item(s)`,
      image: '/assets/FANPURI%20logo.png',
      handler: function (response) {
        handlePaymentSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
        email: shippingDetails.email,
        contact: shippingDetails.phone
      },
      theme: {
        color: '#000000'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'razorpay') {
      initializeRazorpay();
    } else {
      // Handle other payment methods
      handlePaymentSuccess('demo_payment_id');
    }
  };

  const renderShippingStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={shippingDetails.firstName}
            onChange={handleShippingChange('firstName')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Last Name"
            value={shippingDetails.lastName}
            onChange={handleShippingChange('lastName')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            value={shippingDetails.email}
            onChange={handleShippingChange('email')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            value={shippingDetails.phone}
            onChange={handleShippingChange('phone')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            multiline
            rows={3}
            value={shippingDetails.address}
            onChange={handleShippingChange('address')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingDetails.city}
            onChange={handleShippingChange('city')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="State"
            value={shippingDetails.state}
            onChange={handleShippingChange('state')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="ZIP Code"
            value={shippingDetails.zipCode}
            onChange={handleShippingChange('zipCode')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            value={shippingDetails.country}
            onChange={handleShippingChange('country')}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderPaymentStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Choose Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="razorpay"
            control={<Radio />}
            label="Credit/Debit Card, UPI, Net Banking (Razorpay)"
          />
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label="Cash on Delivery (Demo)"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const renderReviewStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Review
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items ({orderSummary.itemCount})
              </Typography>
              {cart.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1">₹{item.price * item.quantity}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shipping Details
              </Typography>
              <Typography variant="body2">
                {shippingDetails.firstName} {shippingDetails.lastName}<br />
                {shippingDetails.address}<br />
                {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}<br />
                {shippingDetails.country}<br />
                Phone: {shippingDetails.phone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>₹{orderSummary.subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>{orderSummary.shipping === 0 ? 'Free' : `₹${orderSummary.shipping}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (18% GST):</Typography>
                <Typography>₹{orderSummary.tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">₹{orderSummary.total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingStep();
      case 1:
        return renderPaymentStep();
      case 2:
        return renderReviewStep();
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Checkout;