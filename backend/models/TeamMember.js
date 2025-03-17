const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true,
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema); 