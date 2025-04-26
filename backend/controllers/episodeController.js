const Episode = require('../models/Episode');
const axios = require('axios');

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

// @desc    Generate summary from YouTube transcript using Gemini API
// @route   POST /api/episodes/generate-summary
// @access  Private
const generateSummary = async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a YouTube video ID'
      });
    }

    // Step 1: Fetch the transcript from YouTube
    const transcript = await fetchYouTubeTranscript(videoId);
    
    if (!transcript) {
      return res.status(404).json({
        success: false,
        error: 'Could not retrieve transcript for this video. The video may not have captions available.'
      });
    }

    // Step 2: Generate summary using Gemini API
    const summary = await generateSummaryWithGemini(transcript);

    if (!summary) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate summary. Please try again later.'
      });
    }

    // Return the generated summary
    res.status(200).json({
      success: true,
      data: {
        summary
      }
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({
      success: false,
      error: 'Error generating summary: ' + (error.message || 'Unknown error')
    });
  }
};

// Helper function to fetch YouTube transcript
const fetchYouTubeTranscript = async (videoId) => {
  try {
    // Using youtube-transcript package to fetch transcripts
    const { YoutubeTranscript } = require('youtube-transcript');
    
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (transcriptItems && transcriptItems.length > 0) {
      // Format the transcript to a single string
      return transcriptItems
        .map(item => item.text)
        .join(' ');
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    return null;
  }
};

// Helper function to generate summary using Gemini API
const generateSummaryWithGemini = async (transcript) => {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return null;
    }

    // Maximum transcript length for API call (Gemini might have token limits)
    const MAX_TRANSCRIPT_LENGTH = 10000;
    const trimmedTranscript = transcript.length > MAX_TRANSCRIPT_LENGTH 
      ? transcript.substring(0, MAX_TRANSCRIPT_LENGTH) + '...'
      : transcript;

    // Call to Gemini API with gemini-2.0-flash model
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Please provide a concise summary of the following transcript from a video lecture or talk. Focus on the main points, key insights, and most significant details. Make the summary engaging and informative. Here's the transcript:\n\n${trimmedTranscript}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }

    return null;
  } catch (error) {
    console.error('Error using Gemini API:', error?.response?.data || error?.message || error);
    return null;
  }
};

module.exports = {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  generateSummary
};