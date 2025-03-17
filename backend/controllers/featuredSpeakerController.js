const FeaturedSpeaker = require('../models/FeaturedSpeaker');

// @desc    Get all featured speakers
// @route   GET /api/featured-speakers
// @access  Public
const getFeaturedSpeakers = async (req, res) => {
  try {
    const featuredSpeakers = await FeaturedSpeaker.find();
    
    res.json({
      success: true,
      count: featuredSpeakers.length,
      data: featuredSpeakers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single featured speaker
// @route   GET /api/featured-speakers/:id
// @access  Public
const getFeaturedSpeakerById = async (req, res) => {
  try {
    const featuredSpeaker = await FeaturedSpeaker.findById(req.params.id);
    
    if (!featuredSpeaker) {
      return res.status(404).json({
        success: false,
        error: 'Featured speaker not found'
      });
    }
    
    res.json({
      success: true,
      data: featuredSpeaker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create a featured speaker
// @route   POST /api/featured-speakers
// @access  Private
const createFeaturedSpeaker = async (req, res) => {
  try {
    const featuredSpeaker = await FeaturedSpeaker.create(req.body);
    
    res.status(201).json({
      success: true,
      data: featuredSpeaker
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update featured speaker
// @route   PUT /api/featured-speakers/:id
// @access  Private
const updateFeaturedSpeaker = async (req, res) => {
  try {
    const featuredSpeaker = await FeaturedSpeaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!featuredSpeaker) {
      return res.status(404).json({
        success: false,
        error: 'Featured speaker not found'
      });
    }
    
    res.json({
      success: true,
      data: featuredSpeaker
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete featured speaker
// @route   DELETE /api/featured-speakers/:id
// @access  Private
const deleteFeaturedSpeaker = async (req, res) => {
  try {
    const featuredSpeaker = await FeaturedSpeaker.findById(req.params.id);
    
    if (!featuredSpeaker) {
      return res.status(404).json({
        success: false,
        error: 'Featured speaker not found'
      });
    }
    
    await featuredSpeaker.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getFeaturedSpeakers,
  getFeaturedSpeakerById,
  createFeaturedSpeaker,
  updateFeaturedSpeaker,
  deleteFeaturedSpeaker
}; 