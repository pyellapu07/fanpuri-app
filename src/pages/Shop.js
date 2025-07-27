import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  FilterList,
  Search,
  Favorite,
  ShoppingCart,
  ExpandMore,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Filter states
  const [fandom, setFandom] = useState('');
  const [format, setFormat] = useState('');
  const [genre, setGenre] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock products data
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
                  <CardMedia
                    component="img"
                    height="300"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        label={product.fandom}
                        size="small"
                        sx={{ bgcolor: 'primary.main', color: 'white' }}
                      />
                      <IconButton size="small" color="primary">
                        <Favorite />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      by {product.artist}
                    </Typography>
                    
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
                        ${product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart />}
                      >
                        Add to Cart
                      </Button>
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
    </Container>
  );
};

export default Shop; 