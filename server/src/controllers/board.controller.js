const Board = require('../models/board.model');

// create board
exports.createBoard = async (req, res) => {
  try {
    const { title, owner } = req.body;
    
    if (!owner) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }

    const newBoard = new Board({
      title: title || 'Untitled Board',
      owner
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board', details: error.message });
  }
};

// get a board
exports.getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch board', details: error.message });
  }
};

// update board
exports.updateBoardShapes = async (req, res) => {
  try {
    const { id } = req.params;
    const { shapes } = req.body;

    if (!Array.isArray(shapes)) {
      return res.status(400).json({ error: 'Shapes must be an array' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { shapes },
      { new: true, runValidators: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shapes', details: error.message });
  }
};
