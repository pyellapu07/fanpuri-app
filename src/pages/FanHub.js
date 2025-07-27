import React, { useState } from 'react';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Search,
  Favorite,
  Share,
  Comment,
  Bookmark,
  TrendingUp,
  NewReleases,
  Star,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const FanHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Evolution of Fan Art: From Traditional to Digital",
      excerpt: "Exploring how fan art has transformed over the decades, from hand-drawn sketches to stunning digital masterpieces...",
      content: "Fan art has come a long way since its humble beginnings. What started as simple pencil sketches in notebooks has evolved into a sophisticated art form that spans multiple mediums and techniques...",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop",
        title: "Art Historian"
      },
      category: "Art & Culture",
      tags: ["Fan Art", "Digital Art", "History"],
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=250&fit=crop",
      publishDate: "2024-01-15",
      readTime: "5 min read",
      likes: 234,
      comments: 45,
      featured: true,
      trending: true,
    },
    {
      id: 2,
      title: "Interview: Meet the Artist Behind Marvel's Most Popular Posters",
      excerpt: "We sat down with ArtVault Studios to discuss their creative process and what inspires their stunning Marvel artwork...",
      content: "ArtVault Studios has become one of the most recognizable names in Marvel fan art. Their posters grace the walls of fans worldwide...",
      author: {
        name: "Mike Rodriguez",
        avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop",
        title: "Editor"
      },
      category: "Interviews",
      tags: ["Marvel", "Interview", "ArtVault"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      publishDate: "2024-01-12",
      readTime: "8 min read",
      likes: 189,
      comments: 32,
      featured: true,
      trending: false,
    },
    {
      id: 3,
      title: "Top 10 Anime Fan Art Trends of 2024",
      excerpt: "From minimalist designs to hyper-realistic portraits, discover the hottest anime fan art trends taking over social media...",
      content: "Anime fan art continues to push creative boundaries, with artists experimenting with new styles and techniques...",
      author: {
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=50&h=50&fit=crop",
        title: "Anime Enthusiast"
      },
      category: "Trends",
      tags: ["Anime", "Trends", "2024"],
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=250&fit=crop",
      publishDate: "2024-01-10",
      readTime: "6 min read",
      likes: 156,
      comments: 28,
      featured: false,
      trending: true,
    },
    {
      id: 4,
      title: "Tollywood Fan Art: Celebrating Telugu Cinema's Rich Heritage",
      excerpt: "How fan artists are preserving and celebrating the vibrant culture of Telugu cinema through their creative works...",
      content: "Telugu cinema has a rich history of storytelling and visual spectacle that has inspired generations of artists...",
      author: {
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=50&h=50&fit=crop",
        title: "Cultural Writer"
      },
      category: "Culture",
      tags: ["Tollywood", "Telugu", "Culture"],
      image: "https://images.unsplash.com/photo-1531259683001-31fb75551564?w=400&h=250&fit=crop",
      publishDate: "2024-01-08",
      readTime: "7 min read",
      likes: 98,
      comments: 15,
      featured: false,
      trending: false,
    },
    {
      id: 5,
      title: "The Business of Fan Art: How Artists Turn Passion into Profit",
      excerpt: "A comprehensive guide for fan artists looking to monetize their work while respecting intellectual property...",
      content: "Many fan artists dream of turning their passion into a sustainable income. But navigating the business side can be challenging...",
      author: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=50&h=50&fit=crop",
        title: "Business Consultant"
      },
      category: "Business",
      tags: ["Business", "Monetization", "Fan Art"],
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=250&fit=crop",
      publishDate: "2024-01-05",
      readTime: "10 min read",
      likes: 267,
      comments: 52,
      featured: true,
      trending: true,
    },
    {
      id: 6,
      title: "DC Comics Fan Art: The Dark Knight's Enduring Appeal",
      excerpt: "Why Batman continues to inspire some of the most compelling fan art in the comic book world...",
      content: "Batman's complex character and Gotham City's atmospheric setting provide endless inspiration for artists...",
      author: {
        name: "Alex Johnson",
        avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=50&h=50&fit=crop",
        title: "Comic Book Expert"
      },
      category: "Comics",
      tags: ["DC Comics", "Batman", "Gotham"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      publishDate: "2024-01-03",
      readTime: "4 min read",
      likes: 134,
      comments: 23,
      featured: false,
      trending: false,
    },
  ];

  const categories = ["All", "Art & Culture", "Interviews", "Trends", "Culture", "Business", "Comics"];
  const tags = ["Fan Art", "Marvel", "Anime", "Tollywood", "DC Comics", "Digital Art", "Business", "Trends"];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "All" || 
                           post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const sortPosts = (posts, sortBy) => {
    switch (sortBy) {
      case 0: // Featured
        return [...posts].filter(post => post.featured);
      case 1: // Trending
        return [...posts].filter(post => post.trending);
      case 2: // Latest
        return [...posts].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
      default:
        return posts;
    }
  };

  const sortedPosts = sortPosts(filteredPosts, selectedTab);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          FanHub
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Your source for fan art news, artist interviews, and community stories
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search articles..."
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
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="Featured" />
              <Tab label="Trending" />
              <Tab label="Latest" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>

      {/* Featured Post */}
      {sortedPosts.length > 0 && sortedPosts[0].featured && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Star sx={{ mr: 1, color: 'primary.main' }} />
            Featured Article
          </Typography>
          <Card sx={{ display: 'flex', height: 400 }}>
            <CardMedia
              component="img"
              sx={{ width: '50%' }}
              image={sortedPosts[0].image}
              alt={sortedPosts[0].title}
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Chip
                  label={sortedPosts[0].category}
                  size="small"
                  sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }}
                />
                <Typography variant="h4" component="h2" gutterBottom>
                  {sortedPosts[0].title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {sortedPosts[0].excerpt}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={sortedPosts[0].author.avatar} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">
                      {sortedPosts[0].author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sortedPosts[0].author.title}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {formatDate(sortedPosts[0].publishDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {sortedPosts[0].readTime}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Favorite sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{sortedPosts[0].likes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Comment sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{sortedPosts[0].comments}</Typography>
                  </Box>
                </Box>
                <Button variant="contained">
                  Read Full Article
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Articles Grid */}
      <Grid container spacing={4}>
        {sortedPosts.slice(1).map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
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
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                  />
                  <IconButton size="small">
                    <Bookmark />
                  </IconButton>
                </Box>
                
                <Typography variant="h6" component="h3" gutterBottom>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {post.excerpt}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={post.author.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                  <Box>
                    <Typography variant="subtitle2">
                      {post.author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(post.publishDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {post.readTime}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Favorite sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{post.likes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Comment sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">{post.comments}</Typography>
                  </Box>
                </Box>

                <Button variant="outlined" fullWidth>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popular Tags */}
      <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Popular Tags
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="outlined"
              clickable
              sx={{ '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
            />
          ))}
        </Box>
      </Box>

      {/* Newsletter Signup */}
      <Box sx={{ mt: 6, p: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Stay Updated
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Get the latest fan art news and artist interviews delivered to your inbox
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, maxWidth: 400, mx: 'auto' }}>
          <TextField
            placeholder="Enter your email"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                '& fieldset': { borderColor: 'transparent' },
              },
            }}
          />
          <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }}>
            Subscribe
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FanHub; 