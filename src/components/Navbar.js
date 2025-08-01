import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [user, setUser] = useState(null);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const { cart } = useCart();
  const { favorites } = useFavorites();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };
  const { clearCart } = useCart();
  
  const handleLogout = async () => {
    await signOut(auth);
    clearCart(); // Clear cart when user logs out
    handleAccountMenuClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      {/* GIF Background */}
      <Box
        component="img"
        src="/assets/5726_Dust_Particles_1920x1080-ezgif.com-video-to-gif-converter.gif"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4))',
          zIndex: -1,
        }}
      />
      <Container maxWidth="xl">
        {/* Desktop Toolbar */}
        <Toolbar disableGutters sx={{ py: 0, minHeight: { sm: '55px', md: '60px' }, display: { xs: 'none', sm: 'flex' } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              position: 'absolute',
              left: 0,
              top: '80%',
              transform: 'translateY(-50%)',
              display: 'block',
              textDecoration: 'none',
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src="/assets/FANPURI%20logo.png"
              alt="FANPURI"
              sx={{
                height: { sm: '70px', md: '85px', lg: '100px', xl: '110px' },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Search Bar */}
          <Search sx={{ display: 'block', flexGrow: 1, maxWidth: '400px', ml: { sm: 16, md: 20, lg: 24, xl: 28 } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Search fandoms, artists, products..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </Search>

          {/* Desktop Navigation Links */}
          <Box sx={{ 
            flexGrow: 1, 
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
            mr: { md: 8, lg: 10, xl: 12 } // Add right margin to avoid logo collision
          }}>
            <Button
              component={Link}
              to="/shop"
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'block',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out',
                }
              }}
            >
              Shop
            </Button>
            <Button
              component={Link}
              to="/artists"
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'block',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out',
                }
              }}
            >
              Artists
            </Button>
            <Button
              component={Link}
              to="/limited-drops"
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'block',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out',
                }
              }}
            >
              Limited Drops
            </Button>
            <Button
              component={Link}
              to="/fanhub"
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'block',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out',
                }
              }}
            >
              FanHub
            </Button>
          </Box>

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
           {user ? (
             <>
                           <Button
                 onClick={handleAccountMenuOpen}
                 sx={{ 
                   bgcolor: '#000',
                   color: '#fff',
                   borderRadius: '50px',
                   px: 2.5,
                   py: 0.8,
                   fontWeight: 600,
                   fontSize: '0.85rem',
                   textTransform: 'uppercase',
                   boxShadow: 'none',
                   mr: 2,
                   minHeight: '32px',
                   '&:hover': {
                     bgcolor: '#222',
                     color: '#fff',
                     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                   },
                   display: { xs: 'none', sm: 'flex' },
                 }}
              endIcon={<ExpandMoreIcon sx={{ fontSize: '1rem' }} />}
               >
                 {user.displayName ? user.displayName.split(' ')[0] : 'Account'}
               </Button>
               <Menu
                 anchorEl={accountMenuAnchor}
                 open={Boolean(accountMenuAnchor)}
                 onClose={handleAccountMenuClose}
                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                 transformOrigin={{ vertical: 'top', horizontal: 'right' }}
               >
                 <MenuItem onClick={() => { handleAccountMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
                 <MenuItem onClick={() => { handleAccountMenuClose(); navigate('/favorites'); }}>
                   Favorites ({favorites.length})
                 </MenuItem>
                 <MenuItem onClick={() => { handleAccountMenuClose(); navigate('/orders'); }}>Orders</MenuItem>
                 <MenuItem onClick={() => { handleAccountMenuClose(); navigate('/settings'); }}>Settings</MenuItem>
                 <MenuItem onClick={handleLogout}>Logout</MenuItem>
               </Menu>
             </>
           ) : (
             <Button
               component={Link}
               to="/login"
              sx={{ 
                 bgcolor: '#000',
                 color: '#fff',
                 borderRadius: '50px',
                 px: 2.5,
                 py: 0.8,
                 fontWeight: 600,
                 fontSize: '0.85rem',
                textTransform: 'uppercase',
                 boxShadow: 'none',
                mr: 2,
                minHeight: '32px',
                '&:hover': {
                   bgcolor: '#222',
                   color: '#fff',
                   boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                 },
                 display: { xs: 'none', sm: 'flex' },
              }}
            >
               Login
            </Button>
           )}
            
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
            >
              <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
                <CartIcon />
              </Badge>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                My Profile
              </MenuItem>
              <MenuItem onClick={handleMenuClose} component={Link} to="/orders">
                My Orders
              </MenuItem>
              <MenuItem onClick={handleMenuClose} component={Link} to="/submit">
                Submit Work
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>

        {/* Mobile Toolbar - Funko Style */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          {/* Top Row - Menu, Logo, and Cart */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            px: 1,
            py: 1,
            minHeight: '60px'
          }}>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleMobileMenuToggle}
              sx={{ color: 'white', p: 1 }}
            >
              <MenuIcon sx={{ fontSize: '28px' }} />
            </IconButton>

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'block',
                textDecoration: 'none',
                zIndex: 1,
              }}
            >
              <Box
                component="img"
                src="/assets/FANPURI%20logo.png"
                alt="FANPURI"
                sx={{
                  height: '50px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Cart Icon */}
            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              sx={{ color: 'white', position: 'relative', p: 1 }}
            >
              <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="primary">
                <CartIcon sx={{ fontSize: '28px' }} />
              </Badge>
            </IconButton>
          </Box>

          {/* Bottom Row - Search Bar */}
          <Box sx={{ 
            px: 1,
            pb: 2,
            minHeight: '40px'
          }}>
            <Search sx={{ 
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.15)',
              }
            }}>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: 'white', fontSize: '20px' }} />
              </SearchIconWrapper>
              <form onSubmit={handleSearch}>
                <StyledInputBase
                  placeholder="SEARCH"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    color: 'white',
                    fontSize: '14px',
                    '&::placeholder': {
                      color: 'rgba(255,255,255,0.7)',
                      opacity: 1,
                    }
                  }}
                />
              </form>
            </Search>
          </Box>
        </Box>
      </Container>

      {/* Promotional Banner */}
      {showPromoBanner && (
        <Box
          sx={{
            backgroundColor: 'black',
            color: 'white',
            py: 1,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
              }}
            >
              Free Shipping on Orders ₹2500+
            </Typography>
            <IconButton
              onClick={() => setShowPromoBanner(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Container>
        </Box>
      )}

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: 'white',
            color: 'black',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Logo and Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box
              component="img"
              src="/assets/FANPURI%20logo.png"
              alt="FANPURI"
              sx={{
                height: '80px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <IconButton
              onClick={handleMobileMenuClose}
              sx={{ 
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Mobile Search */}
          <Search sx={{ mb: 2, display: 'block', bgcolor: 'rgba(0,0,0,0.1)' }}>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: 'black' }} />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ color: 'black' }}
              />
            </form>
          </Search>

          <Divider sx={{ backgroundColor: 'rgba(0,0,0,0.2)', mb: 2 }} />
          
          <List>
            <ListItem 
              button 
              component={Link} 
              to="/shop" 
              onClick={handleMobileMenuClose}
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <ListItemText primary="Shop" sx={{ color: 'black' }} />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/artists" 
              onClick={handleMobileMenuClose}
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <ListItemText primary="Artists" sx={{ color: 'black' }} />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/limited-drops" 
              onClick={handleMobileMenuClose}
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <ListItemText primary="Limited Drops" sx={{ color: 'black' }} />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/fanhub" 
              onClick={handleMobileMenuClose}
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <ListItemText primary="FanHub" sx={{ color: 'black' }} />
            </ListItem>
            {!user ? (
              <ListItem 
                button 
                component={Link} 
                to="/login" 
                onClick={handleMobileMenuClose}
                sx={{ 
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }
                }}
              >
                <ListItemText primary="Login" sx={{ color: 'black' }} />
              </ListItem>
            ) : (
              <>
                <ListItem 
                  button 
                  onClick={handleMobileMenuClose}
                  sx={{ 
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemText 
                    primary={user.displayName || user.email?.split('@')[0] || 'User'} 
                    sx={{ color: 'black' }} 
                  />
                </ListItem>
              </>
            )}
          </List>

          {user && (
            <>
              <Divider sx={{ backgroundColor: 'rgba(0,0,0,0.2)', my: 2 }} />
              
              <List>
                <ListItem 
                  button 
                  component={Link} 
                  to="/profile" 
                  onClick={handleMobileMenuClose}
                  sx={{ 
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemText primary="My Profile" sx={{ color: 'black' }} />
                </ListItem>
                <ListItem 
                  button 
                  component={Link} 
                  to="/orders" 
                  onClick={handleMobileMenuClose}
                  sx={{ 
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemText primary="My Orders" sx={{ color: 'black' }} />
                </ListItem>
                <ListItem 
                  button 
                  component={Link} 
                  to="/submit" 
                  onClick={handleMobileMenuClose}
                  sx={{ 
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemText primary="Submit Work" sx={{ color: 'black' }} />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => {
                    handleLogout();
                    handleMobileMenuClose();
                  }}
                  sx={{ 
                    color: 'black',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemText primary="Logout" sx={{ color: 'black' }} />
                </ListItem>
              </List>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 