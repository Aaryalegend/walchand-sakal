const mongoose = require('mongoose');

const SpeakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  organization: {
    type: String,
    required: [true, 'Please add an organization'],
    trim: true,
    maxlength: [100, 'Organization cannot be more than 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    trim: true
  },
  topics: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Speaker', SpeakerSchema); 