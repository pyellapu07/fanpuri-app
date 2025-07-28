const express = require('express');
const Product = require('../models/Product');
const Artist = require('../models/Artist');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const totalArtists = await Artist.countDocuments();
    const verifiedArtists = await Artist.countDocuments({ isVerified: true });

    // Get recent products
    const recentProducts = await Product.find()
      .populate('artist', 'name username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get top artists by sales
    const topArtists = await Artist.find()
      .sort({ totalSales: -1 })
      .limit(5);

    const stats = {
      totalProducts,
      activeProducts,
      featuredProducts,
      totalArtists,
      verifiedArtists,
      recentProducts,
      topArtists
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Get all products for admin management
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      if (status === 'active') query.isActive = true;
      else if (status === 'inactive') query.isActive = false;
      else if (status === 'featured') query.isFeatured = true;
    }
    
    const products = await Product.find(query)
      .populate('artist', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get all artists for admin management
router.get('/artists', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, verified } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }
    
    const artists = await Artist.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Artist.countDocuments(query);
    
    res.json({
      artists,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalArtists: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Toggle product active status
router.patch('/products/:id/toggle-active', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.isActive = !product.isActive;
    await product.save();
    
    res.json({ 
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling product status', error: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Toggle artist verification status
router.patch('/artists/:id/toggle-verification', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    artist.isVerified = !artist.isVerified;
    await artist.save();
    
    res.json({ 
      message: `Artist ${artist.isVerified ? 'verified' : 'unverified'} successfully`,
      artist 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling artist verification', error: error.message });
  }
});

// Delete artist
router.delete('/artists/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    // Delete all products associated with this artist
    await Product.deleteMany({ artist: artist._id });
    
    // Delete the artist
    await Artist.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Artist and all associated products deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting artist', error: error.message });
  }
});

// Bulk operations
router.post('/products/bulk-action', async (req, res) => {
  try {
    const { productIds, action } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    let updateData = {};
    
    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        break;
      case 'deactivate':
        updateData = { isActive: false };
        break;
      case 'feature':
        updateData = { isFeatured: true };
        break;
      case 'unfeature':
        updateData = { isFeatured: false };
        break;
      case 'delete':
        await Product.deleteMany({ _id: { $in: productIds } });
        return res.json({ message: 'Products deleted successfully' });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData
    );
    
    res.json({ 
      message: `Bulk action '${action}' completed successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error performing bulk action', error: error.message });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const limitedEditionProducts = await Product.countDocuments({ isLimitedEdition: true });
    const totalArtists = await Artist.countDocuments();
    const verifiedArtists = await Artist.countDocuments({ isVerified: true });
    
    // Category distribution
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent activity
    const recentProducts = await Product.find()
      .populate('artist', 'name username')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentArtists = await Artist.find()
      .sort({ createdAt: -1 })
      .limit(10);
    
    const stats = {
      products: {
        total: totalProducts,
        active: activeProducts,
        featured: featuredProducts,
        limitedEdition: limitedEditionProducts
      },
      artists: {
        total: totalArtists,
        verified: verifiedArtists
      },
      categories: categoryStats,
      recentActivity: {
        products: recentProducts,
        artists: recentArtists
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system stats', error: error.message });
  }
});

module.exports = router; 