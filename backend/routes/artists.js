const express = require('express');
const Artist = require('../models/Artist');
const Product = require('../models/Product');

const router = express.Router();

// Get all artists
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category) {
      query.specialties = category;
    }
    
    const artists = await Artist.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ totalSales: -1, rating: -1 })
      .exec();
    
    const count = await Artist.countDocuments(query);
    
    res.json({
      artists,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalArtists: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    // Get artist's products
    const products = await Product.find({ 
      artist: req.params.id, 
      isActive: true 
    }).populate('artist', 'name username');
    
    res.json({ artist, products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist', error: error.message });
  }
});

// Create new artist
router.post('/', async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      bio,
      specialties,
      socialLinks
    } = req.body;
    
    // Check if artist already exists
    const existingArtist = await Artist.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingArtist) {
      return res.status(400).json({ 
        message: 'Artist with this email or username already exists' 
      });
    }
    
    const artist = new Artist({
      name,
      username,
      email,
      bio,
      specialties,
      socialLinks
    });
    
    await artist.save();
    res.status(201).json({ message: 'Artist created successfully', artist });
  } catch (error) {
    res.status(500).json({ message: 'Error creating artist', error: error.message });
  }
});

// Update artist
router.put('/:id', async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    res.json({ message: 'Artist updated successfully', artist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist', error: error.message });
  }
});

// Delete artist
router.delete('/:id', async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    // Also delete all products by this artist
    await Product.deleteMany({ artist: req.params.id });
    
    res.json({ message: 'Artist and associated products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting artist', error: error.message });
  }
});

// Get artist statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const products = await Product.find({ artist: req.params.id });
    const activeProducts = products.filter(p => p.isActive);
    const featuredProducts = products.filter(p => p.isFeatured);
    
    const stats = {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      featuredProducts: featuredProducts.length,
      totalSales: products.reduce((sum, p) => sum + p.salesCount, 0),
      averageRating: products.length > 0 
        ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
        : 0,
      totalViews: products.reduce((sum, p) => sum + p.views, 0),
      totalLikes: products.reduce((sum, p) => sum + p.likes, 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artist stats', error: error.message });
  }
});

module.exports = router; 