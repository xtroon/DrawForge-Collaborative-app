const mongoose = require('mongoose');
const { shapeSchema } = require('./shape.model');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Board"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shapes: {
    type: [shapeSchema],
    default: []
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isTrashed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
