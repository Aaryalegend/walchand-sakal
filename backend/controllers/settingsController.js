const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find();

    res.json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create or update settings
// @route   POST /api/settings
// @access  Private
const createSettings = async (req, res) => {
  try {
    // Check if settings already exists - we only want one entry
    const existingSettings = await Settings.findOne();

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await Settings.findByIdAndUpdate(existingSettings._id, req.body, {
        new: true,
        runValidators: true
      });
    } else {
      // Create new settings
      settings = await Settings.create(req.body);
    }

    res.status(201).json({
      success: true,
      data: settings
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

// @desc    Update settings
// @route   PUT /api/settings/:id
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findById(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'Settings not found'
      });
    }

    settings = await Settings.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: settings
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

module.exports = {
  getSettings,
  createSettings,
  updateSettings
}; 