const { db } = require('./firebase-config');

// Sample artists data
const sampleArtists = [
  {
    name: 'ArtVault Studios',
    username: 'artvaultstudios',
    email: 'artvault@fanpuri.com',
    bio: 'Professional fan art studio specializing in Marvel and DC Comics artwork.',
    specialties: ['Marvel', 'DC Comics'],
    isVerified: true,
    socialLinks: {
      instagram: '@artvaultstudios',
      twitter: '@artvaultstudios',
      website: 'https://artvaultstudios.com'
    },
    totalSales: 0,
    rating: 0,
    reviewCount: 0,
    joinDate: new Date().toISOString()
  },
  {
    name: 'AnimeArt Pro',
    username: 'animeartpro',
    email: 'animeart@fanpuri.com',
    bio: 'Dedicated anime artist creating stunning fan art from popular series.',
    specialties: ['Anime'],
    isVerified: true,
    socialLinks: {
      instagram: '@animeartpro',
      twitter: '@animeartpro'
    },
    totalSales: 0,
    rating: 0,
    reviewCount: 0,
    joinDate: new Date().toISOString()
  },
  {
    name: 'Tollywood Creations',
    username: 'tollywoodcreations',
    email: 'tollywood@fanpuri.com',
    bio: 'Celebrating South Indian cinema through beautiful fan art and merchandise.',
    specialties: ['Tollywood'],
    isVerified: true,
    socialLinks: {
      instagram: '@tollywoodcreations',
      website: 'https://tollywoodcreations.com'
    },
    totalSales: 0,
    rating: 0,
    reviewCount: 0,
    joinDate: new Date().toISOString()
  }
];

// Sample products data
const sampleProducts = [
  {
    name: 'Spider-Man: No Way Home Poster',
    description: 'High-quality poster featuring Spider-Man in his iconic suit from No Way Home.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Marvel',
    tags: ['poster', 'spiderman', 'marvel', 'no way home'],
    printType: 'Digital Print',
    isFeatured: true,
    isActive: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop',
      alt: 'Spider-Man: No Way Home Poster',
      isPrimary: true
    }],
    dimensions: {
      width: 50,
      height: 70,
      unit: 'cm'
    },
    rating: 4.8,
    reviewCount: 127,
    salesCount: 45,
    views: 1200,
    likes: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Naruto Uzumaki Sticker Pack',
    description: 'Collection of high-quality stickers featuring Naruto and his friends.',
    price: 12.99,
    category: 'Anime',
    tags: ['sticker', 'naruto', 'anime', 'collection'],
    printType: 'Sticker',
    isFeatured: true,
    isActive: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop',
      alt: 'Naruto Uzumaki Sticker Pack',
      isPrimary: true
    }],
    rating: 4.9,
    reviewCount: 89,
    salesCount: 67,
    views: 890,
    likes: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'RRR Movie T-Shirt',
    description: 'Comfortable cotton t-shirt featuring artwork from the epic RRR movie.',
    price: 24.99,
    category: 'Tollywood',
    tags: ['t-shirt', 'rrr', 'tollywood', 'movie'],
    printType: 'T-Shirt',
    isFeatured: true,
    isActive: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      alt: 'RRR Movie T-Shirt',
      isPrimary: true
    }],
    rating: 4.7,
    reviewCount: 203,
    salesCount: 123,
    views: 2100,
    likes: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Batman: The Dark Knight Print',
    description: 'Stunning artwork of Batman from The Dark Knight trilogy.',
    price: 34.99,
    category: 'DC Comics',
    tags: ['print', 'batman', 'dark knight', 'dc'],
    printType: 'Canvas',
    isFeatured: false,
    isActive: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1531259683001-31fb75551564?w=600&h=800&fit=crop',
      alt: 'Batman: The Dark Knight Print',
      isPrimary: true
    }],
    dimensions: {
      width: 60,
      height: 80,
      unit: 'cm'
    },
    rating: 4.6,
    reviewCount: 78,
    salesCount: 34,
    views: 567,
    likes: 67,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function populateFirebase() {
  try {
    console.log('Starting Firebase population...');
    
    // Add artists first
    console.log('Adding artists...');
    const artistRefs = [];
    for (const artist of sampleArtists) {
      const docRef = await db.collection('artists').add(artist);
      artistRefs.push(docRef);
      console.log(`Added artist: ${artist.name} with ID: ${docRef.id}`);
    }
    
    // Add products with artist references
    console.log('Adding products...');
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = {
        ...sampleProducts[i],
        artist: artistRefs[i % artistRefs.length].id
      };
      
      const docRef = await db.collection('products').add(product);
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    }
    
    console.log('Firebase population completed successfully!');
    console.log(`Added ${sampleArtists.length} artists and ${sampleProducts.length} products`);
    
  } catch (error) {
    console.error('Error populating Firebase:', error);
  } finally {
    process.exit(0);
  }
}

// Run the population
populateFirebase(); 