const AboutContent = require('../models/AboutContent');

// @desc    Get about page content
// @route   GET /api/about-content
// @access  Public
const getAboutContent = async (req, res) => {
  try {
    const content = await AboutContent.find();

    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create or update about content
// @route   POST /api/about-content
// @access  Private
const createAboutContent = async (req, res) => {
  try {
    // Check if content already exists - we only want one entry
    const existingContent = await AboutContent.findOne();

    let content;
    if (existingContent) {
      // Update existing content
      content = await AboutContent.findByIdAndUpdate(existingContent._id, req.body, {
        new: true,
        runValidators: true
      });
    } else {
      // Create new content
      content = await AboutContent.create(req.body);
    }

    res.status(201).json({
      success: true,
      data: content
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

// @desc    Update about content
// @route   PUT /api/about-content/:id
// @access  Private
const updateAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    content = await AboutContent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: content
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
  getAboutContent,
  createAboutContent,
  updateAboutContent
}; 