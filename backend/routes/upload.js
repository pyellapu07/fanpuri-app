const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const Artist = require('../models/Artist');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Upload product with images
router.post('/product', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      artistName,
      description,
      price,
      originalPrice,
      category,
      tags,
      printType,
      isLimitedEdition,
      totalCopies,
      endDate,
      dimensions
    } = req.body;

    // Validate required fields
    if (!name || !artistName || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, artistName, price, category' 
      });
    }

    // Find or create artist
    let artist = await Artist.findOne({ 
      $or: [
        { name: { $regex: new RegExp(artistName, 'i') } },
        { username: { $regex: new RegExp(artistName, 'i') } }
      ]
    });

    if (!artist) {
      // Create new artist if not found
      artist = new Artist({
        name: artistName,
        username: artistName.toLowerCase().replace(/\s+/g, ''),
        email: `${artistName.toLowerCase().replace(/\s+/g, '')}@fanpuri.com`,
        bio: `Artist specializing in ${category} fan art`
      });
      await artist.save();
    }

    // Process uploaded images
    const images = req.files ? req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      alt: `${name} - Image ${index + 1}`,
      isPrimary: index === 0
    })) : [];

    // Create product
    const product = new Product({
      name,
      artist: artist._id,
      description: description || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      images,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      printType: printType || 'Digital Print',
      isLimitedEdition: isLimitedEdition === 'true',
      limitedEditionInfo: isLimitedEdition === 'true' ? {
        totalCopies: parseInt(totalCopies) || 0,
        availableCopies: parseInt(totalCopies) || 0,
        endDate: endDate ? new Date(endDate) : null
      } : null,
      dimensions: dimensions ? JSON.parse(dimensions) : null
    });

    await product.save();

    // Populate artist info for response
    await product.populate('artist', 'name username');

    res.status(201).json({
      message: 'Product uploaded successfully',
      product
    });

  } catch (error) {
    console.error('Product upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading product', 
      error: error.message 
    });
  }
});

// Get upload status
router.get('/status', (req, res) => {
  res.json({ message: 'Upload service is running' });
});

module.exports = router; 