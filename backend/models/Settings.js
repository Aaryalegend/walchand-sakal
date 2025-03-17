const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, 'Please add a site name'],
    trim: true,
    maxlength: [100, 'Site name cannot be more than 100 characters']
  },
  siteTagline: {
    type: String,
    required: [true, 'Please add a site tagline'],
    trim: true,
    maxlength: [200, 'Site tagline cannot be more than 200 characters']
  },
  contactEmail: {
    type: String,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  contactPhone: {
    type: String,
    trim: true
  },
  contactAddress: {
    type: String,
    trim: true
  },
  socialLinks: {
    twitter: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    }
  },
  footer: {
    copyrightText: {
      type: String,
      trim: true
    },
    showSocialLinks: {
      type: Boolean,
      default: true
    }
  },
  meta: {
    description: {
      type: String,
      trim: true
    },
    keywords: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema); 