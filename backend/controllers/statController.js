const Stat = require('../models/Stat');

// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const stats = await Stat.find();
    
    res.json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single stat
// @route   GET /api/stats/:id
// @access  Public
const getStatById = async (req, res) => {
  try {
    const stat = await Stat.findById(req.params.id);
    
    if (!stat) {
      return res.status(404).json({
        success: false,
        error: 'Stat not found'
      });
    }
    
    res.json({
      success: true,
      data: stat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new stat
// @route   POST /api/stats
// @access  Private
const createStat = async (req, res) => {
  try {
    const stat = await Stat.create(req.body);
    
    res.status(201).json({
      success: true,
      data: stat
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update stat
// @route   PUT /api/stats/:id
// @access  Private
const updateStat = async (req, res) => {
  try {
    let stat = await Stat.findById(req.params.id);
    
    if (!stat) {
      return res.status(404).json({
        success: false,
        error: 'Stat not found'
      });
    }
    
    stat = await Stat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: stat
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete stat
// @route   DELETE /api/stats/:id
// @access  Private
const deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findById(req.params.id);
    
    if (!stat) {
      return res.status(404).json({
        success: false,
        error: 'Stat not found'
      });
    }
    
    await stat.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getStats,
  getStatById,
  createStat,
  updateStat,
  deleteStat
}; 