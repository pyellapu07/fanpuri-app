import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Avatar, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import { useCart } from '../contexts/CartContext';

const Login = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log('Login successful:', result.user);
      
      // Check if this is a new user (first time signing in)
      const isNewUser = result.additionalUserInfo?.isNewUser;
      
      console.log('🔍 User registration check:', {
        isNewUser: isNewUser,
        email: result.user.email,
        displayName: result.user.displayName,
        uid: result.user.uid
      });
      
      if (isNewUser) {
        // Send registration data to backend for welcome email
        try {
          const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              uid: result.user.uid,
              isArtist: false // Default to regular user
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ User registered successfully:', data.message);
            if (data.emailSent) {
              console.log('📧 Welcome email sent!');
            }
          } else {
            console.warn('⚠️ Registration API call failed, but login succeeded');
          }
        } catch (regError) {
          console.warn('⚠️ Registration API call failed, but login succeeded:', regError);
          // Don't fail the login if registration API fails
        }
      }
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups and try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please contact support.');
      } else {
        setError(`Login failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError('Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f3f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 340, maxWidth: 380, mx: 2, boxShadow: 6, borderRadius: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
          <Box component="img" src="/assets/FANPURI%20logo.png" alt="Fanpuri Logo" sx={{ height: 60, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#222' }}>
            Sign in to Fanpuri
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {loading ? (
            <CircularProgress sx={{ my: 2 }} />
          ) : user ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
              <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 56, height: 56 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{user.displayName}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              <Button variant="outlined" color="primary" onClick={handleLogout} sx={{ mt: 2, borderRadius: 8, fontWeight: 600 }}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                bgcolor: '#fff',
                color: '#222',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                mt: 2,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  color: '#111',
                },
              }}
              fullWidth
            >
              Sign in with Google
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 