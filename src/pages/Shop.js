import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Rating,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Pagination,
  Breadcrumbs,
  Link,
  CircularProgress,
  Select as MuiSelect,
} from '@mui/material';
import {
  FilterList,
  Search,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  ExpandMore,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(12);
  const { cart, addToCart, updateQuantity } = useCart();
  const { favorites, toggleFavorite, isInFavorites } = useFavorites();
  const [user, setUser] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [favoritesLoginDialogOpen, setFavoritesLoginDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [fandom, setFandom] = useState('');
  const [format, setFormat] = useState('');
  const [genre, setGenre] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(`${API_BASE_URL}/api/products/featured`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend data to match frontend format
        const transformedProducts = (data.products || data).map(product => {
          const artistName = product.artist?.name || 'Unknown Artist';
          const isArtistVerified = product.artist?.isVerified || false;
          
          return {
            id: product.id,
            name: product.name || 'Untitled Product',
            artist: artistName,
            isArtistVerified: isArtistVerified,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop',
            fandom: product.category,
            format: product.printType || 'Digital Print',
            genre: 'Action', // Default since backend doesn't have this
            rating: product.rating || 4.5,
            reviews: product.reviewCount || 0,
            description: product.description || '',
            // Limited edition data
            isLimitedEdition: product.isLimitedEdition || false,
            isSoldOut: product.isSoldOut || false,
            totalCopies: product.totalCopies || 0,
            soldCopies: product.soldCopies || 0,
            remainingCopies: Math.max(0, (product.totalCopies || 0) - (product.soldCopies || 0)),
          };
        });
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getCartItem = (productId) => cart.find((item) => item.id === productId);

  // Mock products data (fallback)
  const mockProducts = [
    {
      id: 1,
      name: "Spider-Man: No Way Home Poster",
      artist: "ArtVault Studios",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
      fandom: "Marvel",
      format: "Poster",
      genre: "Action",
      rating: 4.8,
      reviews: 127,
      description: "High-quality poster featuring Spider-Man in his iconic pose.",
    },
    {
      id: 2,
      name: "Naruto Uzumaki Sticker Pack",
      artist: "AnimeArt Pro",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
      fandom: "Anime",
      format: "Stickers",
      genre: "Action",
      rating: 4.9,
      reviews: 89,
      description: "Set of 10 high-quality vinyl stickers featuring Naruto characters.",
    },
    {
      id: 3,
      name: "RRR Movie T-Shirt",
      artist: "Tollywood Creations",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      fandom: "Tollywood",
      format: "Apparel",
      genre: "Action",
      rating: 4.7,
      reviews: 203,
      description: "Comfortable cotton t-shirt with RRR movie artwork.",
    },
    {
      id: 4,
      name: "Batman: The Dark Knight Print",
      artist: "ComicVerse Art",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=400&h=500&fit=crop",
      fandom: "DC Comics",
      format: "Print",
      genre: "Action",
      rating: 4.6,
      reviews: 156,
      description: "Limited edition art print of Batman in Gotham City.",
    },
    {
      id: 5,
      name: "Harry Potter Hogwarts Mug",
      artist: "Wizarding World Crafts",
      price: 18.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
      fandom: "Harry Potter",
      format: "Accessories",
      genre: "Fantasy",
      rating: 4.5,
      reviews: 234,
      description: "Ceramic mug featuring Hogwarts castle design.",
    },
    {
      id: 6,
      name: "Star Wars Darth Vader Hoodie",
      artist: "Galaxy Gear",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
      fandom: "Star Wars",
      format: "Apparel",
      genre: "Sci-Fi",
      rating: 4.4,
      reviews: 178,
      description: "Warm hoodie with Darth Vader artwork.",
    },
    {
      id: 7,
      name: "Dragon Ball Z Phone Case",
      artist: "AnimeTech",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      fandom: "Anime",
      format: "Accessories",
      genre: "Action",
      rating: 4.3,
      reviews: 95,
      description: "Durable phone case with Dragon Ball Z characters.",
    },
    {
      id: 8,
      name: "Marvel Avengers Keychain",
      artist: "Heroic Collectibles",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=400&h=500&fit=crop",
      fandom: "Marvel",
      format: "Accessories",
      genre: "Action",
      rating: 4.2,
      reviews: 67,
      description: "Metal keychain featuring Avengers logo.",
    },
  ];

  const fandoms = ["Marvel", "Tollywood", "Anime", "DC Comics", "Star Wars", "Harry Potter"];
  const formats = ["Poster", "Stickers", "Apparel", "Print", "Accessories"];
  const genres = ["Action", "Romance", "Mythology", "Fantasy", "Sci-Fi", "Comedy"];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = products;

    if (fandom) {
      filtered = filtered.filter(product => product.fandom === fandom);
    }

    if (format) {
      filtered = filtered.filter(product => product.format === format);
    }

    if (genre) {
      filtered = filtered.filter(product => product.genre === genre);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.fandom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(filtered);
    setPage(1);
  }, [products, fandom, format, genre, searchQuery, priceRange]);

  // Get current products for pagination
  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearFilters = () => {
    setFandom('');
    setFormat('');
    setGenre('');
    setPriceRange([0, 200]);
    setSearchQuery('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">Shop</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterList sx={{ mr: 1 }} />
              Filters
            </Typography>

            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            {/* Fandom Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Fandom</InputLabel>
              <Select
                value={fandom}
                label="Fandom"
                onChange={(e) => setFandom(e.target.value)}
              >
                <MenuItem value="">All Fandoms</MenuItem>
                {fandoms.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Format Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Format</InputLabel>
              <Select
                value={format}
                label="Format"
                onChange={(e) => setFormat(e.target.value)}
              >
                <MenuItem value="">All Formats</MenuItem>
                {formats.map((f) => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Genre Filter */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={(e) => setGenre(e.target.value)}
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={200}
                sx={{ mt: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">${priceRange[0]}</Typography>
                <Typography variant="body2">${priceRange[1]}</Typography>
              </Box>
            </Box>

            {/* Clear Filters */}
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
            >
              Clear All Filters
            </Button>
          </Box>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Results Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {filteredProducts.length} Products Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length}
            </Typography>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid item xs={12} sm={6} lg={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.image}
                      alt={product.name}
                    />
                    
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
                              width: '35px',
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
                              top: '3px',
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
                              top: '24px',
                              left: '50%',
                              transform: 'translateX(-50%) rotate(-90deg)',
                              fontFamily: '"Open Sans", sans-serif',
                              fontWeight: 800,
                              fontSize: '10px',
                              color: '#000',
                              textTransform: 'uppercase',
                              letterSpacing: '-0.06em',
                              lineHeight: 1,
                              zIndex: 3,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            LIMITED EDITION
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

                        {/* Remaining Copies Indicator - Removed from image overlay */}
                      </>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!user) {
                            setFavoritesLoginDialogOpen(true);
                          } else {
                            toggleFavorite(product);
                          }
                        }}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.9)',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,1)',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {isInFavorites(product.id) ? (
                          <Favorite 
                            sx={{ 
                              color: '#e74c3c',
                              fontSize: '18px',
                            }} 
                          />
                        ) : (
                          <FavoriteBorder 
                            sx={{ 
                              color: '#000',
                              fontSize: '18px',
                            }} 
                          />
                        )}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    {/* Limited Stock Indicator - Below Product Title */}
                    {product.isLimitedEdition && !product.isSoldOut && product.remainingCopies > 0 && product.remainingCopies <= 10 && (
                      <Typography
                        sx={{
                          fontFamily: '"Open Sans", sans-serif',
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          color: '#1976d2',
                          textAlign: 'left',
                          letterSpacing: '-0.06em',
                          lineHeight: 1,
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Only {product.remainingCopies} Left!
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        by {product.artist}
                      </Typography>
                      {product.isArtistVerified && (
                                                  <img
                            src="/assets/verified_24dp_1976D2_FILL1_wght400_GRAD0_opsz24.svg"
                            alt="Verified Artist"
                            style={{
                              width: '12px',
                              height: '12px'
                            }}
                          />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {product.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary.main" fontWeight={600}>
                        ₹{product.price}
                      </Typography>
                      {getCartItem(product.id) ? (
                        <Button
                          variant="contained"
                          size="small"
                          disabled
                          sx={{
                            bgcolor: '#000',
                            color: '#fff',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          IN CART
                        </Button>
                      ) : product.isSoldOut ? (
                        <Button
                          variant="contained"
                          size="small"
                          disabled
                          sx={{
                            bgcolor: '#9e9e9e',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            cursor: 'not-allowed',
                          }}
                        >
                          SOLD OUT
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCart />}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!user) {
                              setLoginDialogOpen(true);
                            } else {
                              addToCart(product);
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredProducts.length / productsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
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

      {/* Favorites Login Dialog */}
      <Dialog open={favoritesLoginDialogOpen} onClose={() => setFavoritesLoginDialogOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          Please login or sign up to add items to your favorites.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFavoritesLoginDialogOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={() => { setFavoritesLoginDialogOpen(false); window.location.href = '/login'; }} color="primary" variant="contained">Login / Signup</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Shop; 