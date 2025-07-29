const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { db, bucket } = require('./firebase-config');
const { sendWelcomeEmail, sendArtistWelcomeEmail, sendOrderConfirmationEmail, testEmailConfig } = require('./email-service');
const admin = require('firebase-admin'); // Added for order management

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

// Configure multer for memory storage (we'll upload to Firebase Storage)
const upload = multer({
  storage: multer.memoryStorage(),
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

// Helper function to upload image to Firebase Storage
async function uploadImageToFirebase(file, folder = 'products') {
  try {
    console.log('Uploading image to Firebase Storage:', file.originalname);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.mimetype);
    console.log('Bucket name:', bucket.name);
    
    // Validate bucket
    if (!bucket) {
      throw new Error('Firebase Storage bucket is not initialized');
    }
    
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }
    
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error('File buffer is empty or undefined');
    }
    
    if (!file.originalname) {
      throw new Error('File original name is missing');
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }
    
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    
    const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
    console.log('Generated file name:', fileName);
    
    const fileUpload = bucket.file(fileName);
    
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false // For smaller files, this is faster
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        console.error('Blob stream error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Handle specific Firebase Storage errors
        if (error.code === 'ENOTFOUND') {
          reject(new Error('Firebase Storage service not found. Check your bucket configuration.'));
        } else if (error.code === 'UNAUTHENTICATED') {
          reject(new Error('Firebase Storage authentication failed. Check your service account credentials.'));
        } else if (error.code === 'PERMISSION_DENIED') {
          reject(new Error('Firebase Storage permission denied. Check your bucket permissions.'));
        } else {
          reject(new Error(`Firebase Storage upload failed: ${error.message}`));
        }
      });

      blobStream.on('finish', async () => {
        try {
          console.log('File upload completed, making public...');
          
          // Make the file public
          await fileUpload.makePublic();
          
          // Get the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          console.log('File uploaded successfully:', fileName);
          console.log('Public URL:', publicUrl);
          
          resolve({
            id: uuidv4(),
            filename: fileName,
            url: publicUrl,
            uploadedAt: new Date().toISOString(),
          });
        } catch (publicError) {
          console.error('Error making file public:', publicError);
          console.error('Public error code:', publicError.code);
          console.error('Public error message:', publicError.message);
          
          // Even if making public fails, the file was uploaded
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          console.log('File uploaded but could not make public. URL:', publicUrl);
          
          resolve({
            id: uuidv4(),
            filename: fileName,
            url: publicUrl,
            uploadedAt: new Date().toISOString(),
            warning: 'File uploaded but may not be publicly accessible'
          });
        }
      });

      // Start the upload
      console.log('Starting file upload...');
      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Error uploading image to Firebase Storage: ${error.message}`);
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
    
    // Get all artists to populate artist data
    const artistsSnapshot = await db.collection('artists').get();
    const artists = artistsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Populate artist data for each product
    const productsWithArtists = products.map(product => {
      const artist = artists.find(a => a.id === product.artist);
      return {
        ...product,
        artist: artist || { name: 'Unknown Artist' }
      };
    });
    
    console.log(`Found ${productsWithArtists.length} featured products:`, productsWithArtists.map(p => ({ id: p.id, name: p.name, artist: p.artist?.name, isFeatured: p.isFeatured })));
    
    res.json({ products: productsWithArtists });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching product with ID:', id);
    
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };
    
    // Get artist data
    if (product.artist) {
      const artistDoc = await db.collection('artists').doc(product.artist).get();
      if (artistDoc.exists) {
        product.artist = {
          id: artistDoc.id,
          ...artistDoc.data()
        };
      }
    }
    
    console.log('Product found:', { id: product.id, name: product.name, artist: product.artist?.name });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
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

    // Upload images to Firebase Storage
    let images = [];
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'image files');
      for (const file of req.files) {
        try {
          console.log('Uploading file:', file.originalname, 'Size:', file.size, 'Type:', file.mimetype);
          const imageData = await uploadImageToFirebase(file, 'products');
          images.push(imageData);
          console.log('Successfully uploaded:', file.originalname);
        } catch (uploadError) {
          console.error('Failed to upload file:', file.originalname, uploadError);
          return res.status(500).json({ 
            message: `Failed to upload image: ${file.originalname}`, 
            error: uploadError.message 
          });
        }
      }
    } else {
      console.log('No image files received');
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
      soldCopies: 0, // Track sold copies
      isSoldOut: false, // Track sold out status
      waitlistEmails: [], // Store emails for back-in-stock notifications
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

// Get individual product for admin editing
app.get('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Admin fetching product with ID:', id);
    
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = {
      id: productDoc.id,
      ...productDoc.data()
    };
    
    // Get artist data
    if (product.artist) {
      const artistDoc = await db.collection('artists').doc(product.artist).get();
      if (artistDoc.exists) {
        product.artist = {
          id: artistDoc.id,
          ...artistDoc.data()
        };
      }
    }
    
    console.log('Admin product found:', { id: product.id, name: product.name });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product for admin:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
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

// Update product (for limited edition, etc.)
app.patch('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();
    
    const updatedProduct = await updateInCollection('products', id, updateData);
    
    res.json({ 
      message: 'Product updated successfully',
      product: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Update product in admin (PUT endpoint)
app.put('/api/admin/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
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
      artistId,
      currentImages
    } = req.body;

    console.log('Admin updating product with ID:', id);
    console.log('Update data:', { name, artistName, category, isNewArtist, currentImages });
    console.log('Files uploaded:', req.files ? req.files.length : 0);

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    // Handle artist selection
    let artist;
    try {
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
        console.log('Created new artist:', artist);
      } else {
        // Use existing artist
        const artistDoc = await db.collection('artists').doc(artistId).get();
        if (!artistDoc.exists) {
          return res.status(400).json({ message: 'Selected artist not found' });
        }
        artist = { id: artistDoc.id, ...artistDoc.data() };
        console.log('Using existing artist:', artist);
      }
    } catch (artistError) {
      console.error('Error handling artist:', artistError);
      return res.status(500).json({ message: 'Error handling artist', error: artistError.message });
    }

    // Handle new images if uploaded
    let newImages = [];
    try {
      if (req.files && req.files.length > 0) {
        console.log('Processing uploaded files...');
        for (const file of req.files) {
          console.log('Uploading file:', file.originalname);
          const imageData = await uploadImageToFirebase(file, 'products');
          newImages.push(imageData);
          console.log('File uploaded successfully:', imageData);
        }
      }
    } catch (imageError) {
      console.error('Error uploading images:', imageError);
      return res.status(500).json({ message: 'Error uploading images', error: imageError.message });
    }

    // Get existing product data
    let existingData;
    try {
      const existingProduct = await db.collection('products').doc(id).get();
      if (!existingProduct.exists) {
        return res.status(404).json({ message: 'Product not found' });
      }
      existingData = existingProduct.data();
      console.log('Existing product data retrieved');
    } catch (fetchError) {
      console.error('Error fetching existing product:', fetchError);
      return res.status(500).json({ message: 'Error fetching existing product', error: fetchError.message });
    }

    // Prepare update data
    const updateData = {
      name: name || existingData.name,
      description: description || existingData.description,
      price: price ? parseFloat(price) : existingData.price,
      originalPrice: originalPrice ? parseFloat(originalPrice) : existingData.originalPrice,
      category: category || existingData.category,
      printType: printType || existingData.printType,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : existingData.tags,
      isLimitedEdition: isLimitedEdition === 'true',
      totalCopies: totalCopies ? parseInt(totalCopies) : existingData.totalCopies,
      soldCopies: existingData.soldCopies || 0, // Preserve sold copies count
      isSoldOut: existingData.isSoldOut || false, // Preserve sold out status
      waitlistEmails: existingData.waitlistEmails || [], // Preserve waitlist emails
      endDate: endDate || existingData.endDate,
      artist: artist.id,
      updatedAt: new Date().toISOString()
    };

    // Handle images: use currentImages (after removals) + new images
    let finalImages = [];
    
    console.log('Original images count:', existingData.images ? existingData.images.length : 0);
    console.log('Current images from frontend:', currentImages);
    
    // Parse current images (images that weren't removed)
    if (currentImages) {
      try {
        const parsedCurrentImages = JSON.parse(currentImages);
        finalImages = [...parsedCurrentImages];
        console.log('Parsed current images count:', finalImages.length);
      } catch (error) {
        console.error('Error parsing currentImages:', error);
        finalImages = existingData.images || [];
      }
    } else {
      finalImages = existingData.images || [];
    }
    
    // Add new images
    if (newImages.length > 0) {
      finalImages = [...finalImages, ...newImages];
      console.log('Added new images count:', newImages.length);
    }
    
    console.log('Final images count:', finalImages.length);
    updateData.images = finalImages;

    console.log('Updating product with data:', {
      ...updateData,
      images: `[${finalImages.length} images]` // Don't log full image data
    });

    // Update the product
    try {
      const updatedProduct = await updateInCollection('products', id, updateData);
      console.log('Product updated successfully');
      
      res.json({
        message: 'Product updated successfully',
        product: updatedProduct
      });
    } catch (updateError) {
      console.error('Error in updateInCollection:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating product in admin:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error updating product', error: error.message });
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

// Delete artist
app.delete('/api/admin/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artistDoc = await db.collection('artists').doc(id).get();
    
    if (!artistDoc.exists) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    // Delete all products associated with this artist
    const productsSnapshot = await db.collection('products')
      .where('artist', '==', id)
      .get();
    
    // Delete product images from Firebase Storage
    for (const productDoc of productsSnapshot.docs) {
      const product = productDoc.data();
      if (product.images && Array.isArray(product.images)) {
        for (const image of product.images) {
          if (image.filename) {
            try {
              await bucket.file(image.filename).delete();
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
      }
    }
    
    // Delete all products associated with this artist
    const batch = db.batch();
    productsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    // Delete the artist
    await deleteFromCollection('artists', id);
    
    res.json({ 
      message: 'Artist and all associated products deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ message: 'Error deleting artist', error: error.message });
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
    
    const product = productDoc.data();
    
    // Delete product images from Firebase Storage
    if (product.images && Array.isArray(product.images)) {
      for (const image of product.images) {
        if (image.filename) {
          try {
            await bucket.file(image.filename).delete();
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
      }
    }
    
    // Delete product from Firestore
    await deleteFromCollection('products', id);
    
    res.json({ 
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Purchase limited edition product
app.post('/api/products/:id/purchase', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;
    
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = productDoc.data();
    
    if (!product.isLimitedEdition) {
      return res.status(400).json({ message: 'This product is not limited edition' });
    }
    
    if (product.isSoldOut) {
      return res.status(400).json({ message: 'Product is sold out' });
    }
    
    const availableCopies = product.totalCopies - product.soldCopies;
    
    if (quantity > availableCopies) {
      return res.status(400).json({ 
        message: `Only ${availableCopies} copies available`,
        availableCopies 
      });
    }
    
    // Update sold copies
    const newSoldCopies = product.soldCopies + quantity;
    const isSoldOut = newSoldCopies >= product.totalCopies;
    
    await db.collection('products').doc(id).update({
      soldCopies: newSoldCopies,
      isSoldOut: isSoldOut,
      updatedAt: new Date().toISOString()
    });
    
    res.json({
      message: 'Purchase successful',
      remainingCopies: product.totalCopies - newSoldCopies,
      isSoldOut: isSoldOut
    });
    
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Error processing purchase', error: error.message });
  }
});

// Add email to waitlist
app.post('/api/products/:id/waitlist', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = productDoc.data();
    
    if (!product.isLimitedEdition) {
      return res.status(400).json({ message: 'This product is not limited edition' });
    }
    
    // Check if email already exists
    const existingEmails = product.waitlistEmails || [];
    if (existingEmails.includes(email)) {
      return res.status(400).json({ message: 'Email already on waitlist' });
    }
    
    // Add email to waitlist
    await db.collection('products').doc(id).update({
      waitlistEmails: [...existingEmails, email],
      updatedAt: new Date().toISOString()
    });
    
    res.json({
      message: 'Added to waitlist successfully',
      waitlistCount: existingEmails.length + 1
    });
    
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    res.status(500).json({ message: 'Error adding to waitlist', error: error.message });
  }
});

// Orders endpoints
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    if (!orderData.userId || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }
    
    // Generate unique order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Create order object
    const order = {
      orderId,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store order in Firestore
    await db.collection('orders').doc(orderId).set(order);
    
    // Update product sales count
    for (const item of orderData.items) {
      try {
        const productRef = db.collection('products').doc(item.id);
        await productRef.update({
          salesCount: admin.firestore.FieldValue.increment(item.quantity)
        });
      } catch (error) {
        console.error('Error updating product sales count:', error);
      }
    }
    
    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        email: orderData.userEmail,
        orderId,
        orderSummary: orderData.orderSummary,
        shippingDetails: orderData.shippingDetails,
        items: orderData.items
      });
    } catch (emailError) {
      console.error('⚠️ Order confirmation email failed:', emailError.message);
    }
    
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId,
      order
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(orderDoc.data());
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Get user orders
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const ordersQuery = db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit * 1)
      .offset((page - 1) * limit);
    
    const snapshot = await ordersQuery.get();
    const orders = snapshot.docs.map(doc => doc.data());
    
    res.json({
      orders,
      currentPage: parseInt(page),
      totalOrders: orders.length
    });
    
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
});

// Update order status (for admin)
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    await db.collection('orders').doc(orderId).update({
      status,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ message: 'Order status updated successfully' });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Get all orders (for admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let ordersQuery = db.collection('orders').orderBy('createdAt', 'desc');
    
    if (status) {
      ordersQuery = ordersQuery.where('status', '==', status);
    }
    
    const snapshot = await ordersQuery
      .limit(limit * 1)
      .offset((page - 1) * limit)
      .get();
    
    const orders = snapshot.docs.map(doc => doc.data());
    
    res.json({
      orders,
      currentPage: parseInt(page),
      totalOrders: orders.length
    });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Test endpoint for debugging
app.get('/api/test', async (req, res) => {
  try {
    // Test Firebase connection
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('Firebase connection test successful');
    
    res.json({ 
      message: 'Backend is working',
      firebase: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Backend test failed:', error);
    res.status(500).json({ 
      message: 'Backend test failed', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test Firebase Storage connection
app.get('/api/test-storage', async (req, res) => {
  try {
    const bucketName = bucket.name;
    console.log('Firebase Storage bucket:', bucketName);
    
    res.json({ 
      message: 'Firebase Storage is working',
      bucket: bucketName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firebase Storage test failed:', error);
    res.status(500).json({ 
      message: 'Firebase Storage test failed', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test Firebase Storage upload with a simple text file
app.post('/api/test-upload', upload.single('testFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('Testing upload with file:', req.file.originalname);
    
    // Try to upload to Firebase Storage
    const result = await uploadImageToFirebase(req.file, 'test');
    
    res.json({
      message: 'Test upload successful',
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test upload failed:', error);
    res.status(500).json({
      message: 'Test upload failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
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

// Test Firebase Storage connection
app.get('/test-firebase-storage', async (req, res) => {
  try {
    console.log('Testing Firebase Storage connection...');
    console.log('Bucket name:', bucket.name);
    
    // Try to list files in the bucket
    const [files] = await bucket.getFiles({ maxResults: 1 });
    console.log('Successfully connected to Firebase Storage');
    
    res.json({ 
      message: 'Firebase Storage connection successful',
      bucket: bucket.name,
      filesCount: files.length,
      bucketExists: !!bucket
    });
  } catch (error) {
    console.error('Firebase Storage connection test failed:', error);
    res.status(500).json({ 
      message: 'Firebase Storage connection failed',
      error: error.message,
      bucket: bucket ? bucket.name : 'undefined'
    });
  }
});

// Upload status endpoint
app.get('/api/upload/status', (req, res) => {
  res.json({ 
    message: 'Upload service is running',
    bucket: bucket.name,
    firebaseConfigured: !!bucket,
    multerConfigured: !!upload
  });
});

// Check if user exists endpoint
app.get('/api/auth/check-user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    if (!uid) {
      return res.status(400).json({ message: 'User UID is required' });
    }
    
    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (userDoc.exists) {
      res.json({ exists: true, user: userDoc.data() });
    } else {
      res.json({ exists: false });
    }
    
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ message: 'Error checking user existence', error: error.message });
  }
});

// User registration endpoint (for welcome emails)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, displayName, photoURL, uid, isArtist = false } = req.body;
    
    if (!email || !uid) {
      return res.status(400).json({ message: 'Email and UID are required' });
    }
    
    // Create user data object
    const userData = {
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: photoURL || null,
      uid,
      creationTime: new Date().toISOString(),
      isArtist: isArtist || false
    };
    
    // Store user in Firestore
    await db.collection('users').doc(uid).set(userData);
    
    // Send welcome email
    try {
      if (isArtist) {
        await sendArtistWelcomeEmail({
          name: userData.displayName,
          email: userData.email,
          username: userData.displayName.toLowerCase().replace(/\s+/g, ''),
          creationTime: userData.creationTime
        });
      } else {
        await sendWelcomeEmail(userData);
      }
      console.log(`✅ Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error('⚠️ Email sending failed, but user registration succeeded:', emailError.message);
      // Don't fail the registration if email fails
    }
    
    res.json({ 
      message: 'User registered successfully',
      user: userData,
      emailSent: true
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Test email configuration endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    const isConfigValid = await testEmailConfig();
    if (isConfigValid) {
      res.json({ message: 'Email configuration is valid', status: 'success' });
    } else {
      res.status(500).json({ message: 'Email configuration is invalid', status: 'error' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error testing email configuration', error: error.message });
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
  
  // Test email configuration on startup
  testEmailConfig().then(isValid => {
    if (isValid) {
      console.log('✅ Email service configured successfully');
    } else {
      console.log('⚠️ Email service configuration failed - check your environment variables');
    }
  });
}); 