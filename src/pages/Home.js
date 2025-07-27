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
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import {
  ArrowForward,
  ChevronLeft,
  ChevronRight,
  Favorite,
  LocalOffer,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // State for featured products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured products from backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Transform backend data to match frontend format
        const transformedProducts = (data.products || data).map(product => {
          console.log('Raw product from backend:', product); // Debug log
          return {
            id: product.id,
            name: product.name || 'Untitled Product',
            artist: product.artist?.name || product.artistName || 'Unknown Artist',
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images && product.images.length > 0 ? `http://localhost:5000${product.images[0].url}` : 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop',
            fandom: product.category,
            rating: product.rating || 4.5,
            reviews: product.reviewCount || 0,
          };
        });
        
        console.log('Transformed products:', transformedProducts); // Debug log
        
        setFeaturedProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        setFeaturedProducts([
    {
      id: 1,
      name: "Spider-Man: No Way Home Poster",
      artist: "ArtVault Studios",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=500&fit=crop",
      fandom: "Marvel",
      rating: 4.8,
      reviews: 127,
    },
    {
      id: 2,
      name: "Naruto Uzumaki Sticker Pack",
      artist: "AnimeArt Pro",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
      fandom: "Anime",
      rating: 4.9,
      reviews: 89,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const fandomCategories = [
    { name: 'Marvel', color: '#e74c3c', icon: '🦸‍♂️' },
    { name: 'DC Comics', color: '#3498db', icon: '🦇' },
    { name: 'Anime', color: '#e91e63', icon: '🌸' },
    { name: 'Tollywood', color: '#f39c12', icon: '🎬' },
    { name: 'Star Wars', color: '#9b59b6', icon: '⚔️' },
    { name: 'Harry Potter', color: '#2ecc71', icon: '🧙‍♂️' },
  ];

  const visibleProducts = Math.min(5, featuredProducts.length);
  const canGoNext = currentIndex < featuredProducts.length - visibleProducts + 2; // Account for extra space
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          width: '100%',
          height: {
            xs: '400px',    // Mobile - much larger like Funko
            sm: '350px',    // Small tablets
            md: '300px',    // Tablets
            lg: '350px',    // Desktop
            xl: '400px',    // Large screens
          },
          backgroundImage: 'url(/assets/Baahubali%20banner2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
          maxHeight: '500px',
          position: 'relative',
          display: 'flex',
        }}
      >
        {/* Dark Overlay for Readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
            zIndex: 1,
          }}
        />

        {/* Disclaimer Text */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            zIndex: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            Unofficial fan art inspired by Baahubali, created with respect for Arka Media Works. Not affiliated with or endorsed by Arka Media Works.
          </Typography>
        </Box>

        {/* Text Overlay */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            display: { xs: 'none', sm: 'block' }, // Hide on mobile
            color: 'white',
            maxWidth: '500px',
            pl: { sm: 4, md: 6, lg: 8, xl: 10 },
            pt: { sm: 3, md: 4, lg: 5, xl: 6 }, // Reduced top padding to move content up more
          }}>
            {/* Exclusive Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                bgcolor: '#1976d2',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                mb: 2,
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              EXCLUSIVE!
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: {
                  sm: '2.5rem',
                  md: '3rem',
                  lg: '3.5rem',
                  xl: '4rem',
                },
                color: 'white',
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              THE EPIC
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                fontSize: {
                  sm: '1.2rem',
                  md: '1.4rem',
                  lg: '1.6rem',
                  xl: '1.8rem',
                },
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                lineHeight: 1.4,
              }}
            >
              Fan Merch Drop
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'black',
                fontWeight: 700,
                fontSize: {
                  sm: '0.9rem',
                  md: '1rem',
                  lg: '1.1rem',
                },
                px: 3,
                py: 1, // Reduced height to match Funko
                borderRadius: '50px', // Pill shape
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              SHOP NOW
            </Button>
          </Box>
        
          {/* Mobile Text */}
        <Box sx={{ 
          display: { xs: 'block', sm: 'none' },
          position: 'absolute',
            left: '24px',
            top: '60px', // Move to top instead of bottom
          zIndex: 2,
            maxWidth: '280px',
          }}>
            {/* Exclusive Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                bgcolor: '#1976d2',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                mb: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              EXCLUSIVE!
            </Box>

          <Typography
              variant="h3"
            sx={{
                fontWeight: 800,
                color: 'white',
                mb: 2,
                fontSize: '2.5rem',
                lineHeight: 1.1,
            }}
          >
            THE EPIC
          </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: 'rgba(255,255,255,0.9)',
                mb: 3,
                fontSize: '1.1rem',
                lineHeight: 1.3,
              }}
            >
              Fan Merch Drop
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            sx={{
              bgcolor: 'white',
                color: 'black',
                fontWeight: 700,
                fontSize: '0.85rem',
                px: 3,
                py: 0.8, // Reduced height to match Funko
                borderRadius: '50px', // Pill shape
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
              },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            SHOP NOW
          </Button>
        </Box>
        </Container>
      </Box>

      {/* Featured Products - Funko Style */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="xl" sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, px: 3 }}>
            <Typography variant="h3" component="h2" sx={{ fontSize: '2rem', fontWeight: 700, color: '#000' }}>
            Featured Products
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="outlined"
              size="large"
            endIcon={<ArrowForward />}
              sx={{
                borderColor: '#000',
                color: '#000',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: '#f5f5f5',
                }
              }}
          >
            View All
          </Button>
        </Box>
          
          {loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading featured products...</Typography>
            </Box>
          )}
          
          {error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error">Error loading products: {error}</Typography>
            </Box>
          )}
          
          {!loading && !error && featuredProducts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>No featured products available. Upload some products through the admin panel!</Typography>
            </Box>
          )}
          
                    {!loading && !error && featuredProducts.length > 0 && (
            <Box sx={{ 
              position: 'relative', 
              overflow: 'hidden', 
              pb: 4,
              // Ensure proper scrolling on mobile
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
            }}>
            <Box sx={{ 
              display: 'flex', 
                gap: 3, 
              transition: 'transform 0.5s ease-in-out',
                transform: `translateX(-${currentIndex * (100/4)}%)`,
                width: `${((featuredProducts.length + 7) / 4) * 100}%`, // Add 7 extra products worth of space
                px: 3,
              }}>
                {featuredProducts.map((product) => {
                  console.log('Rendering product:', product); // Debug log
                  return (
                    <Box key={product.id} sx={{ width: 'calc(100% / 4 - 24px)', minWidth: 280, maxWidth: 320, flexShrink: 0 }}>
                <Card
                  component={Link}
                  to={`/product/${product.id}`}
                  sx={{
                    textDecoration: 'none',
                          height: 450,
                    width: '100%',
                    minWidth: 0,
                    maxWidth: '100%',
                    transition: 'all 0.3s ease-in-out',
                          borderRadius: 3,
                    overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          border: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                            borderColor: '#ddd',
                    },
                  }}
                >
                      {/* Product Image with Overlay - Funko Style */}
                      <Box sx={{ position: 'relative', height: 280, width: '100%', flexShrink: 0 }}>
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
                    {/* Wishlist Icon */}
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to wishlist functionality here
                        console.log('Added to wishlist:', product.name);
                      }}
                      sx={{
                        position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: 'rgba(255,255,255,0.95)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,1)',
                        },
                      }}
                    >
                          <Favorite fontSize="medium" />
                    </IconButton>
                    {/* Category Badge */}
                    <Chip
                      label={product.fandom}
                      size="small"
                      sx={{
                        position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: '#000',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 24,
                            borderRadius: '12px',
                      }}
                    />
                  </Box>
                  
                      {/* Product Details - Funko Style */}
                      <CardContent sx={{ 
                        p: 2, 
                        pb: 1, 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: 150, 
                        textAlign: 'left',
                        justifyContent: 'space-between'
                      }}>

                        {/* Text Content Container */}
                        <Box sx={{ flexGrow: 1 }}>
                          {/* Artist Name - Above Title in CAPS */}
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                              fontSize: '0.75rem',
                              mb: 0.25,
                              textAlign: 'left',
                              textTransform: 'uppercase',
                              fontWeight: 400,
                              letterSpacing: '0.5px',
                              color: '#666',
                            }}
                          >
                            {product.artist}
                    </Typography>

                          {/* Product Name - Larger */}
                    <Typography 
                            variant="h6" 
                      component="h3" 
                      sx={{ 
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              lineHeight: 1.3,
                              mb: 0.25,
                              minHeight: 35,
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
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart functionality here
                        console.log('Added to cart:', product.name);
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
                  </CardContent>
                                    </Card>
                  </Box>
                );
              })}
              
              {/* Add empty space for scrolling */}
              {Array.from({ length: 7 }, (_, index) => (
                <Box 
                  key={`empty-${index}`} 
                  sx={{ 
                    width: 'calc(100% / 4 - 24px)', 
                    minWidth: 280, 
                    maxWidth: 320, 
                    flexShrink: 0,
                    height: 450,
                    // Invisible placeholder for spacing
                  }}
                />
              ))}
            </Box>
            
            {/* Navigation Arrows */}
            <IconButton
              onClick={handlePrev}
              disabled={!canGoPrev}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: canGoPrev ? 'white' : 'rgba(255,255,255,0.5)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: canGoPrev ? 'grey.100' : 'rgba(255,255,255,0.5)',
                },
                zIndex: 2,
                display: { xs: 'flex', sm: 'flex' },
                opacity: canGoPrev ? 1 : 0.5,
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <IconButton
              onClick={handleNext}
              disabled={!canGoNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                zIndex: 2,
                display: 'flex',
                opacity: canGoNext ? 1 : 0.3,
              }}
            >
              <ChevronRight />
            </IconButton>
            </Box>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#000000', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom>
              Are You a Fan Artist?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join our community of creators and share your passion with fans worldwide.
            </Typography>
            <Button
              component={Link}
              to="/submit"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#000000',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Submit Your Work
              <ArrowForward sx={{ ml: 1 }} />
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 