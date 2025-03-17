const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  speaker: {
    type: String,
    required: [true, 'Please add a speaker name'],
    trim: true
  },
  speakerRole: {
    type: String,
    required: [true, 'Please add a speaker role'],
    trim: true
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
  summary: {
    type: String,
    required: [true, 'Please add a summary']
  },
  videoId: {
    type: String,
    required: [true, 'Please add a video ID'],
    trim: true
  },
  topics: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Episode', EpisodeSchema); 