const FeaturedTalk = require('../models/FeaturedTalk');

// @desc    Get all featured talks
// @route   GET /api/featured-talks
// @access  Public
const getFeaturedTalks = async (req, res) => {
  try {
    const featuredTalks = await FeaturedTalk.find();
    
    res.json({
      success: true,
      count: featuredTalks.length,
      data: featuredTalks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single featured talk
// @route   GET /api/featured-talks/:id
// @access  Public
const getFeaturedTalkById = async (req, res) => {
  try {
    const featuredTalk = await FeaturedTalk.findById(req.params.id);
    
    if (!featuredTalk) {
      return res.status(404).json({
        success: false,
        error: 'Featured talk not found'
      });
    }
    
    res.json({
      success: true,
      data: featuredTalk
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create a featured talk
// @route   POST /api/featured-talks
// @access  Private
const createFeaturedTalk = async (req, res) => {
  try {
    const featuredTalk = await FeaturedTalk.create(req.body);
    
    res.status(201).json({
      success: true,
      data: featuredTalk
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

// @desc    Update featured talk
// @route   PUT /api/featured-talks/:id
// @access  Private
const updateFeaturedTalk = async (req, res) => {
  try {
    const featuredTalk = await FeaturedTalk.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!featuredTalk) {
      return res.status(404).json({
        success: false,
        error: 'Featured talk not found'
      });
    }
    
    res.json({
      success: true,
      data: featuredTalk
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

// @desc    Delete featured talk
// @route   DELETE /api/featured-talks/:id
// @access  Private
const deleteFeaturedTalk = async (req, res) => {
  try {
    const featuredTalk = await FeaturedTalk.findById(req.params.id);
    
    if (!featuredTalk) {
      return res.status(404).json({
        success: false,
        error: 'Featured talk not found'
      });
    }
    
    await featuredTalk.deleteOne();
    
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
  getFeaturedTalks,
  getFeaturedTalkById,
  createFeaturedTalk,
  updateFeaturedTalk,
  deleteFeaturedTalk
}; 