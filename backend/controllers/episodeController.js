const Episode = require('../models/Episode');

// @desc    Get all episodes
// @route   GET /api/episodes
// @access  Public
const getEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find();
    
    res.json({
      success: true,
      count: episodes.length,
      data: episodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single episode
// @route   GET /api/episodes/:id
// @access  Public
const getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    res.json({
      success: true,
      data: episode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create an episode
// @route   POST /api/episodes
// @access  Private
const createEpisode = async (req, res) => {
  try {
    const episode = await Episode.create(req.body);
    
    res.status(201).json({
      success: true,
      data: episode
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

// @desc    Update episode
// @route   PUT /api/episodes/:id
// @access  Private
const updateEpisode = async (req, res) => {
  try {
    let episode = await Episode.findById(req.params.id);
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    episode = await Episode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: episode
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

// @desc    Delete episode
// @route   DELETE /api/episodes/:id
// @access  Private
const deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    
    if (!episode) {
      return res.status(404).json({
        success: false,
        error: 'Episode not found'
      });
    }
    
    await episode.deleteOne();
    
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
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode
}; 