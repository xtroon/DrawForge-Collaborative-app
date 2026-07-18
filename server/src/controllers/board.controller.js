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
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shapes', details: error.message });
  }
};

// delete board
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBoard = await Board.findByIdAndDelete(id);
    if (!deletedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete board', details: error.message });
  }
};

// update board title
exports.updateBoardTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { title },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update title', details: error.message });
  }
};

const User = require('../models/user.model');

// get boards by user id
exports.getUserBoards = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const boards = await Board.find({ owner: user._id }).sort({ updatedAt: -1 });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user boards', details: error.message });
  }
};

// toggle board star
exports.toggleStar = async (req, res) => {
  try {
    const { id } = req.params;
    const { isStarred } = req.body;
    
    if (isStarred === undefined) {
      return res.status(400).json({ error: 'isStarred boolean is required' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { isStarred },
      { returnDocument: 'after' }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle star', details: error.message });
  }
};

// toggle board trash (soft delete / restore)
exports.toggleTrash = async (req, res) => {
  try {
    const { id } = req.params;
    const { isTrashed } = req.body;
    
    if (isTrashed === undefined) {
      return res.status(400).json({ error: 'isTrashed boolean is required' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { isTrashed },
      { returnDocument: 'after' }
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle trash', details: error.message });
  }
};
