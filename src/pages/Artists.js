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
  Button,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  Search,
  Favorite,
  Instagram,
  Twitter,
  YouTube,
  Palette,
  Star,
  People,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Artists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFandom, setSelectedFandom] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch artists from backend
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fanpuri-app-1.onrender.com/api/artists');
        if (!response.ok) {
          throw new Error('Failed to fetch artists');
        }
        const data = await response.json();
        setArtists(data.artists || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Get unique fandoms from artists data
  const fandoms = ["All", ...new Set(artists.flatMap(artist => artist.specialties || []))];

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (artist.bio && artist.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFandom = !selectedFandom || selectedFandom === "All" || 
                         (artist.specialties && artist.specialties.includes(selectedFandom));
    return matchesSearch && matchesFandom;
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const sortArtists = (artists, sortBy) => {
    switch (sortBy) {
      case 0: // Popular
        return [...artists].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0));
      case 1: // Rating
        return [...artists].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 2: // Newest
        return [...artists].sort((a, b) => new Date(b.joinDate || 0) - new Date(a.joinDate || 0));
      default:
        return artists;
    }
  };

  const sortedArtists = sortArtists(filteredArtists, selectedTab);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>Loading artists...</Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="error" gutterBottom>Error loading artists</Typography>
          <Typography variant="body1" color="text.secondary">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          Meet Our Artists
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Discover talented creators behind your favorite fan art and merchandise
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Fandom</InputLabel>
              <Select
                value={selectedFandom}
                label="Fandom"
                onChange={(e) => setSelectedFandom(e.target.value)}
              >
                {fandoms.map((fandom) => (
                  <MenuItem key={fandom} value={fandom}>{fandom}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="Popular" />
              <Tab label="Top Rated" />
              <Tab label="Newest" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      {/* Artists Grid */}
      {sortedArtists.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>No artists found</Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filter criteria.
          </Typography>
        </Box>
      ) : (
      <Grid container spacing={4}>
        {sortedArtists.map((artist) => (
          <Grid item xs={12} md={6} key={artist.id}>
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
              {/* Cover Image */}
              <CardMedia
                component="img"
                height="200"
                image={artist.coverImage || "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=200&fit=crop"}
                alt={artist.name}
              />
              
              <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                {/* Avatar */}
                <Avatar
                  src={artist.avatar || "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=150&h=150&fit=crop"}
                  sx={{
                    width: 80,
                    height: 80,
                    position: 'absolute',
                    top: -40,
                    left: 20,
                    border: 3,
                    borderColor: 'white',
                  }}
                />
                
                {/* Follow Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 6 }}>
                  <IconButton color="primary">
                    <Favorite />
                  </IconButton>
                </Box>

                {/* Artist Info */}
                <Typography variant="h5" component="h2" gutterBottom>
                  {artist.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {artist.bio || "Artist specializing in fan art and merchandise."}
                </Typography>

                {/* Fandom Tags */}
                <Box sx={{ mb: 2 }}>
                  {(artist.specialties || []).map((specialty) => (
                    <Chip
                      key={specialty}
                      label={specialty}
                      size="small"
                      sx={{ mr: 1, mb: 1, bgcolor: 'primary.main', color: 'white' }}
                    />
                  ))}
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={artist.rating || 0} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({artist.reviewCount || 0} reviews)
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary.main">
                        {(artist.totalSales || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sales
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary.main">
                        {artist.isVerified ? "✓" : "○"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary.main">
                        {artist.rating || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>





                {/* View Profile Button */}
                <Button
                  component={Link}
                  to={`/artist/${artist.id}`}
                  variant="contained"
                  fullWidth
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', mt: 8, p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Are You an Artist?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Join our community of creators and start selling your fan art today!
        </Typography>
        <Button
          component={Link}
          to="/submit"
          variant="contained"
          size="large"
        >
          Submit Your Work
        </Button>
      </Box>
    </Container>
  );
};

export default Artists; 