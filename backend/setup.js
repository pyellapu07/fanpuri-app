const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fanpuri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

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
    }
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
    }
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
    }
  },
  {
    name: 'ComicVerse Art',
    username: 'comicverseart',
    email: 'comicverse@fanpuri.com',
    bio: 'Comic book enthusiast creating detailed artwork from the comic universe.',
    specialties: ['Marvel', 'DC Comics'],
    isVerified: false,
    socialLinks: {
      instagram: '@comicverseart'
    }
  },
  {
    name: 'Galaxy Gear',
    username: 'galaxygear',
    email: 'galaxygear@fanpuri.com',
    bio: 'Star Wars fan art and merchandise creator.',
    specialties: ['Star Wars'],
    isVerified: true,
    socialLinks: {
      instagram: '@galaxygear',
      twitter: '@galaxygear'
    }
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
    dimensions: {
      width: 50,
      height: 70,
      unit: 'cm'
    }
  },
  {
    name: 'Naruto Uzumaki Sticker Pack',
    description: 'Collection of high-quality stickers featuring Naruto and his friends.',
    price: 12.99,
    category: 'Anime',
    tags: ['sticker', 'naruto', 'anime', 'collection'],
    printType: 'Sticker',
    isFeatured: true,
    isActive: true
  },
  {
    name: 'RRR Movie T-Shirt',
    description: 'Comfortable cotton t-shirt featuring artwork from the epic RRR movie.',
    price: 24.99,
    category: 'Tollywood',
    tags: ['t-shirt', 'rrr', 'tollywood', 'movie'],
    printType: 'T-Shirt',
    isFeatured: true,
    isActive: true
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
    dimensions: {
      width: 60,
      height: 80,
      unit: 'cm'
    }
  },
  {
    name: 'Star Wars Darth Vader Hoodie',
    description: 'Warm hoodie featuring the iconic Darth Vader design.',
    price: 39.99,
    category: 'Star Wars',
    tags: ['hoodie', 'darth vader', 'star wars', 'warm'],
    printType: 'T-Shirt',
    isFeatured: true,
    isActive: true
  }
];

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Clear existing data
    await Artist.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert sample artists
    const artists = await Artist.insertMany(sampleArtists);
    console.log(`Created ${artists.length} artists`);
    
    // Insert sample products with artist references
    const productsWithArtists = sampleProducts.map((product, index) => ({
      ...product,
      artist: artists[index % artists.length]._id,
      images: [{
        url: `/assets/sample-product-${index + 1}.jpg`,
        alt: product.name,
        isPrimary: true
      }]
    }));
    
    const products = await Product.insertMany(productsWithArtists);
    console.log(`Created ${products.length} products`);
    
    console.log('Database setup completed successfully!');
    console.log('\nSample data created:');
    console.log(`- ${artists.length} artists`);
    console.log(`- ${products.length} products`);
    console.log('\nYou can now:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Access admin interface: http://localhost:5000/admin.html');
    console.log('3. Test API endpoints');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 