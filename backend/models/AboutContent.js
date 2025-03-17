const mongoose = require('mongoose');

const AboutContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subtitle: {
    type: String,
    required: [true, 'Please add a subtitle'],
    trim: true,
    maxlength: [200, 'Subtitle cannot be more than 200 characters']
  },
  mainContent: {
    type: String,
    required: [true, 'Please add main content'],
    trim: true
  },
  mission: {
    type: String,
    required: [true, 'Please add mission statement'],
    trim: true
  },
  vision: {
    type: String,
    required: [true, 'Please add vision statement'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutContent', AboutContentSchema); 