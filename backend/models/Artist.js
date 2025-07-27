const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  socialLinks: {
    instagram: String,
    twitter: String,
    website: String
  },
  specialties: [{
    type: String,
    enum: ['Marvel', 'DC Comics', 'Anime', 'Tollywood', 'Star Wars', 'Harry Potter', 'Other']
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  totalSales: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
artistSchema.index({ name: 'text', username: 'text', bio: 'text' });

module.exports = mongoose.model('Artist', artistSchema); 