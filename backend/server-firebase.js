const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { db, bucket } = require('./firebase-config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded images
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Configure multer for local storage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      // Create uploads directory if it doesn't exist
      if (!require('fs').existsSync(uploadDir)) {
        require('fs').mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Helper function to handle local image upload
async function handleLocalImageUpload(file) {
  try {
    console.log('Processing local image:', file.originalname);
    
    // File is already saved by multer, just return the info
    const imageData = {
      id: uuidv4(),
      filename: file.filename,
      url: `/uploads/${file.filename}`, // Local URL
      uploadedAt: new Date().toISOString(),
    };
    
    return imageData;
  } catch (error) {
    throw new Error('Error processing local image');
  }
}

// Helper function to get data from Firestore
async function getCollectionData(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    return [];
  }
}

// Helper function to add data to Firestore
async function addToCollection(collectionName, data) {
  try {
    const docRef = await db.collection(collectionName).add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(`Error adding to ${collectionName}: ${error.message}`);
  }
}

// Helper function to update data in Firestore
async function updateInCollection(collectionName, id, data) {
  try {
    await db.collection(collectionName).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { id, ...data };
  } catch (error) {
    throw new Error(`Error updating ${collectionName}: ${error.message}`);
  }
}

// Helper function to delete from Firestore
async function deleteFromCollection(collectionName, id) {
  try {
    await db.collection(collectionName).doc(id).delete();
    return true;
  } catch (error) {
    throw new Error(`Error deleting from ${collectionName}: ${error.message}`);
  }
}

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await getCollectionData('products');
    const artists = await getCollectionData('artists');
    
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

// Get featured products
app.get('/api/products/featured', async (req, res) => {
  try {
    console.log('Fetching featured products...');
    const snapshot = await db.collection('products')
      .where('isFeatured', '==', true)
      .where('isActive', '==', true)
      .get();
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`Found ${products.length} featured products:`, products.map(p => ({ id: p.id, name: p.name, isFeatured: p.isFeatured })));
    
    res.json({ products });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});

// Get all artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await getCollectionData('artists');
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Upload product with images
app.post('/api/upload/product', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      artistName,
      description,
      price,
      originalPrice,
      category,
      printType,
      tags,
      isLimitedEdition,
      totalCopies,
      endDate,
      isNewArtist,
      artistId
    } = req.body;

    console.log('Upload request received:', { name, artistName, category, isNewArtist });
    console.log('Files received:', req.files ? req.files.length : 0);

    // Handle artist selection
    let artist;
    if (isNewArtist === 'true') {
      // Create new artist
      artist = {
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
      const newArtist = await addToCollection('artists', artist);
      artist = newArtist;
    } else {
      // Use existing artist
      const artistDoc = await db.collection('artists').doc(artistId).get();
      if (!artistDoc.exists) {
        return res.status(400).json({ message: 'Selected artist not found' });
      }
      artist = { id: artistDoc.id, ...artistDoc.data() };
    }

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageData = await handleLocalImageUpload(file);
        images.push(imageData);
      }
    }

    // Create product
    const product = {
      name,
      description: description || '',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      category,
      printType: printType || 'Digital Print',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isLimitedEdition: isLimitedEdition === 'true',
      totalCopies: totalCopies ? parseInt(totalCopies) : null,
      endDate: endDate || null,
      artist: artist.id,
      images,
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating product with data:', product);

    const newProduct = await addToCollection('products', product);
    
    res.status(201).json({
      message: 'Product uploaded successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ message: 'Error uploading product', error: error.message });
  }
});

// Admin routes
app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await getCollectionData('products');
    const artists = await getCollectionData('artists');
    
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

app.get('/api/admin/artists', async (req, res) => {
  try {
    const artists = await getCollectionData('artists');
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artists', error: error.message });
  }
});

// Admin stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const artistsSnapshot = await db.collection('artists').get();
    
    const products = productsSnapshot.docs.map(doc => doc.data());
    const artists = artistsSnapshot.docs.map(doc => doc.data());
    
    const stats = {
      products: {
        total: products.length,
        featured: products.filter(p => p.isFeatured).length,
        active: products.filter(p => p.isActive).length
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

// Toggle product featured status
app.patch('/api/products/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = productDoc.data();
    const updatedProduct = await updateInCollection('products', id, {
      isFeatured: !product.isFeatured
    });
    
    res.json({ 
      message: `Product ${updatedProduct.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      product: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating featured status', error: error.message });
  }
});

// Delete product
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete images from Firebase Storage
    const product = productDoc.data();
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          await bucket.file(image.filename).delete();
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }
    
    // Delete product from Firestore
    await deleteFromCollection('products', id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Toggle artist verification
app.patch('/api/admin/artists/:id/toggle-verification', async (req, res) => {
  try {
    const { id } = req.params;
    const artistDoc = await db.collection('artists').doc(id).get();
    
    if (!artistDoc.exists) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    const artist = artistDoc.data();
    const updatedArtist = await updateInCollection('artists', id, {
      isVerified: !artist.isVerified
    });
    
    res.json({ 
      message: `Artist ${updatedArtist.isVerified ? 'verified' : 'unverified'} successfully`,
      artist: updatedArtist 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating artist verification', error: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Fanpuri Backend API is running! (Firebase Mode)' });
});

// Test endpoint to check uploads directory
app.get('/test-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'uploads');
  
  try {
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath);
      res.json({ 
        message: 'Uploads directory exists',
        path: uploadsPath,
        files: files,
        count: files.length
      });
    } else {
      res.json({ 
        message: 'Uploads directory does not exist',
        path: uploadsPath
      });
    }
  } catch (error) {
    res.json({ 
      message: 'Error checking uploads directory',
      error: error.message,
      path: uploadsPath
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (Firebase Mode)`);
  console.log(`Admin interface: http://localhost:${PORT}/admin.html`);
}); 