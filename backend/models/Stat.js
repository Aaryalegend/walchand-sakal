const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Please add a label'],
    trim: true,
    maxlength: [50, 'Label cannot be more than 50 characters']
  },
  value: {
    type: String,
    required: [true, 'Please add a value'],
    trim: true,
    maxlength: [20, 'Value cannot be more than 20 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Stat', StatSchema); 