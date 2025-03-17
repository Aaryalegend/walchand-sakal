const mongoose = require('mongoose');

const FeaturedTalkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  speaker: {
    type: String,
    required: [true, 'Please add a speaker name'],
    trim: true,
    maxlength: [100, 'Speaker name cannot be more than 100 characters']
  },
  speakerRole: {
    type: String,
    required: [true, 'Please add a speaker role'],
    trim: true,
    maxlength: [100, 'Speaker role cannot be more than 100 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Please add a thumbnail URL']
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration'],
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FeaturedTalk', FeaturedTalkSchema); 