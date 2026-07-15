const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
}, { _id: false });

const shapeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      "rectangle", "circle", "line", "pencil", 
      "brush", "eraser", "rounded-rectangle", 
      "rhombus", "arrow", "text"
    ]
  },
  points: [pointSchema],
  
  start: pointSchema,
  end: pointSchema,
  
  position: pointSchema,
  text: String,
  fontSize: Number,

  color: String,
  strokeWidth: Number,
}, { _id: false });

module.exports = { shapeSchema, pointSchema };
