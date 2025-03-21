const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  artist: {
    type: String,
    required: [true, 'Please provide an artist name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: ['Rock', 'Jazz', 'Classical', 'Pop', 'Hip Hop', 'Electronic', 'Other']
  },
  condition: {
    type: String,
    required: [true, 'Please specify the condition'],
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor']
  },
  format: {
    type: String,
    required: [true, 'Please specify the format'],
    enum: ['Vinyl', 'CD', 'Cassette']
  },
  releaseYear: {
    type: Number,
    required: [true, 'Please provide the release year']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image URL']
  }],
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
productSchema.index({ title: 'text', artist: 'text', genre: 'text' });

module.exports = mongoose.model('Product', productSchema); 