const Speaker = require('../models/Speaker');

// @desc    Get all speakers
// @route   GET /api/speakers
// @access  Public
const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find();
    
    res.json({
      success: true,
      count: speakers.length,
      data: speakers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single speaker
// @route   GET /api/speakers/:id
// @access  Public
const getSpeakerById = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({
        success: false,
        error: 'Speaker not found'
      });
    }
    
    res.json({
      success: true,
      data: speaker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create a speaker
// @route   POST /api/speakers
// @access  Private
const createSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.create(req.body);
    
    res.status(201).json({
      success: true,
      data: speaker
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

// @desc    Update speaker
// @route   PUT /api/speakers/:id
// @access  Private
const updateSpeaker = async (req, res) => {
  try {
    let speaker = await Speaker.findById(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({
        success: false,
        error: 'Speaker not found'
      });
    }
    
    speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: speaker
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

// @desc    Delete speaker
// @route   DELETE /api/speakers/:id
// @access  Private
const deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({
        success: false,
        error: 'Speaker not found'
      });
    }
    
    await speaker.deleteOne();
    
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
  getSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker
}; 