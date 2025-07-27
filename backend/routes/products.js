const express = require('express');
const Product = require('../models/Product');
const Artist = require('../models/Artist');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      artist,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    let query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Artist filter
    if (artist) {
      const artistDoc = await Artist.findOne({
        $or: [
          { name: { $regex: new RegExp(artist, 'i') } },
          { username: { $regex: new RegExp(artist, 'i') } }
        ]
      });
      if (artistDoc) {
        query.artist = artistDoc._id;
      }
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Featured products filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('artist', 'name username avatar')
      .sort(sortOptions)
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

// Get featured products for home page
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .populate('artist', 'name username')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .exec();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('artist', 'name username bio avatar socialLinks');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    await product.populate('artist', 'name username');
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('artist', 'name username');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Toggle featured status
router.patch('/:id/feature', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json({ 
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating featured status', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const products = await Product.find({ 
      category: req.params.category, 
      isActive: true 
    })
    .populate('artist', 'name username')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await Product.countDocuments({ 
      category: req.params.category, 
      isActive: true 
    });

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
      category: req.params.category
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category products', error: error.message });
  }
});

// Get limited edition products
router.get('/limited-edition/all', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const products = await Product.find({ 
      isLimitedEdition: true, 
      isActive: true,
      'limitedEditionInfo.availableCopies': { $gt: 0 }
    })
    .populate('artist', 'name username')
    .sort({ 'limitedEditionInfo.endDate': 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await Product.countDocuments({ 
      isLimitedEdition: true, 
      isActive: true,
      'limitedEditionInfo.availableCopies': { $gt: 0 }
    });

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching limited edition products', error: error.message });
  }
});

module.exports = router; 