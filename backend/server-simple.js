const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Serve static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.join(__dirname, 'public')));

// Simple data storage (JSON files)
const artistsFile = path.join(dataDir, 'artists.json');
const productsFile = path.join(dataDir, 'products.json');

// Initialize data files if they don't exist
if (!fs.existsSync(artistsFile)) {
  fs.writeFileSync(artistsFile, JSON.stringify([], null, 2));
}
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify([], null, 2));
}

// Helper functions for data management
function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = readData(productsFile);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
  try {
    const products = readData(productsFile);
    const featured = products.filter(p => p.isFeatured && p.isActive);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});

// Get all artists
app.get('/api/artists', (req, res) => {
  try {
    const artists = readData(artistsFile);
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Get all artists for admin
app.get('/api/admin/artists', (req, res) => {
  try {
    const artists = readData(artistsFile);
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Upload product with images
app.post('/api/upload/product', upload.array('images', 5), (req, res) => {
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
      endDate
    } = req.body;

    if (!name || !artistName || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, artistName, price, category' 
      });
    }

    // Load existing data
    const artists = readData(artistsFile);
    const products = readData(productsFile);

               // Handle artist selection
           let artist;
           
           if (req.body.isNewArtist === 'true') {
             // Create new artist
             artist = {
               id: uuidv4(),
               name: artistName,
               username: artistName.toLowerCase().replace(/\s+/g, ''),
               email: `${artistName.toLowerCase().replace(/\s+/g, '')}@fanpuri.com`,
               bio: `Artist specializing in ${category} fan art`,
               specialties: [category],
               isVerified: false,
               totalSales: 0,
               rating: 0,
               reviewCount: 0,
               joinDate: new Date().toISOString()
             };
             artists.push(artist);
             writeData(artistsFile, artists);
           } else {
             // Use existing artist
             const artistId = req.body.artistId;
             artist = artists.find(a => a.id === artistId);
             
             if (!artist) {
               return res.status(400).json({
                 message: 'Selected artist not found'
               });
             }
           }

    // Process uploaded images
    const images = req.files ? req.files.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      alt: `${name} - Image ${index + 1}`,
      isPrimary: index === 0
    })) : [];

    // Create product
    const product = {
      id: uuidv4(),
      name,
      artist: artist.id,
      artistName: artist.name,
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
        endDate: endDate ? new Date(endDate).toISOString() : null
      } : null,
      isFeatured: false,
      isActive: true,
      salesCount: 0,
      rating: 0,
      reviewCount: 0,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    products.push(product);
    writeData(productsFile, products);

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

// Admin dashboard stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const artists = readData(artistsFile);
    const products = readData(productsFile);
    
    const stats = {
      products: {
        total: products.length,
        active: products.filter(p => p.isActive).length,
        featured: products.filter(p => p.isFeatured).length,
        limitedEdition: products.filter(p => p.isLimitedEdition).length
      },
      artists: {
        total: artists.length,
        verified: artists.filter(a => a.isVerified).length
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get all products for admin
app.get('/api/admin/products', (req, res) => {
  try {
    const products = readData(productsFile);
    const artists = readData(artistsFile);
    
    // Add artist info to products
    const productsWithArtists = products.map(product => {
      const artist = artists.find(a => a.id === product.artist);
      return {
        ...product,
        artist: artist ? { name: artist.name, username: artist.username } : null
      };
    });
    
    res.json({ products: productsWithArtists });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Toggle product featured status
app.patch('/api/products/:id/feature', (req, res) => {
  try {
    const products = readData(productsFile);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.isFeatured = !product.isFeatured;
    writeData(productsFile, products);
    
    res.json({ 
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating featured status', error: error.message });
  }
});

// Toggle product active status
app.patch('/api/admin/products/:id/toggle-active', (req, res) => {
  try {
    const products = readData(productsFile);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.isActive = !product.isActive;
    writeData(productsFile, products);
    
    res.json({ 
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product status', error: error.message });
  }
});

// Delete product
app.delete('/api/admin/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readData(productsFile);
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Remove the product
    products.splice(productIndex, 1);
    writeData(productsFile, products);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Get single product
app.get('/api/admin/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readData(productsFile);
    const artists = readData(artistsFile);
    
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add artist info
    const artist = artists.find(a => a.id === product.artist);
    const productWithArtist = {
      ...product,
      artist: artist ? { id: artist.id, name: artist.name, username: artist.username } : null
    };
    
    res.json({ product: productWithArtist });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Update product
app.put('/api/admin/products/:id', upload.array('images', 5), (req, res) => {
  try {
    const { id } = req.params;
    const products = readData(productsFile);
    const artists = readData(artistsFile);
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[productIndex];
    
    // Handle artist selection
    let artist;
    if (req.body.isNewArtist === 'true') {
      // Create new artist
      artist = {
        id: uuidv4(),
        name: req.body.artistName,
        username: req.body.artistName.toLowerCase().replace(/\s+/g, ''),
        email: `${req.body.artistName.toLowerCase().replace(/\s+/g, '')}@fanpuri.com`,
        bio: `Artist specializing in ${req.body.category} fan art`,
        specialties: [req.body.category],
        isVerified: false,
        totalSales: 0,
        rating: 0,
        reviewCount: 0,
        joinDate: new Date().toISOString()
      };
      artists.push(artist);
      writeData(artistsFile, artists);
    } else {
      // Use existing artist
      const artistId = req.body.artistId;
      artist = artists.find(a => a.id === artistId);
      
      if (!artist) {
        return res.status(400).json({ message: 'Selected artist not found' });
      }
    }
    
    // Handle new images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => ({
        id: uuidv4(),
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString()
      }));
    }
    
    // Update product
    const updatedProduct = {
      ...product,
      name: req.body.name || product.name,
      description: req.body.description || product.description,
      price: parseFloat(req.body.price) || product.price,
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : product.originalPrice,
      category: req.body.category || product.category,
      printType: req.body.printType || product.printType,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : product.tags,
      isLimitedEdition: req.body.isLimitedEdition === 'true' || product.isLimitedEdition,
      totalCopies: req.body.totalCopies ? parseInt(req.body.totalCopies) : product.totalCopies,
      endDate: req.body.endDate || product.endDate,
      artist: artist.id,
      updatedAt: new Date().toISOString()
    };
    
    // Add new images to existing ones if any
    if (newImages.length > 0) {
      updatedProduct.images = [...(product.images || []), ...newImages];
    }
    
    products[productIndex] = updatedProduct;
    writeData(productsFile, products);
    
    res.json({ 
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Toggle artist verification
app.patch('/api/admin/artists/:id/toggle-verification', (req, res) => {
  try {
    const artists = readData(artistsFile);
    const artist = artists.find(a => a.id === req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    artist.isVerified = !artist.isVerified;
    writeData(artistsFile, artists);
    
    res.json({ 
      message: `Artist ${artist.isVerified ? 'verified' : 'unverified'} successfully`,
      artist 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist verification', error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Fanpuri Backend API is running! (Simple Mode)' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (Simple Mode - No MongoDB required)`);
  console.log(`Admin interface: http://localhost:${PORT}/admin.html`);
}); 