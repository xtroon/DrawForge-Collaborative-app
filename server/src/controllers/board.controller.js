const Board = require('../models/board.model');
const User = require('../models/user.model');

// create board
async function createBoard(req, res) {
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
    return res.status(201).json(savedBoard);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create board', details: error.message });
  }
}

// get a board
async function getBoard(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    
    return res.status(200).json(board);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch board', details: error.message });
  }
}

// update board
async function updateBoard(req, res) {
  try {
    const { id } = req.params;
    const { shapes, title, userId } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    if (title !== undefined && board.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Only the owner can rename the board' });
    }

    if (shapes !== undefined) {
      if (!Array.isArray(shapes)) {
        return res.status(400).json({ error: 'Shapes must be an array' });
      }
      board.shapes = shapes;
    }
    
    if (title !== undefined) {
      board.title = title;
    }

    await board.save();
    return res.status(200).json(board);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update board', details: error.message });
  }
}

// delete board
async function deleteBoard(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const deletedBoard = await Board.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete board', details: error.message });
  }
}

// get boards by user id
async function getUserBoards(req, res) {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const boards = await Board.find({
      $or: [
        { owner: user._id },
        { visitors: user._id }
      ]
    }).sort({ updatedAt: -1 });
    return res.status(200).json(boards);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user boards', details: error.message });
  }
}

// toggle board star
async function toggleStar(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    if (!board.starredBy) board.starredBy = [];

    const index = board.starredBy.indexOf(userId);
    if (index > -1) {
      board.starredBy.splice(index, 1);
    } else {
      board.starredBy.push(userId);
    }

    await board.save();
    return res.status(200).json(board);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle star', details: error.message });
  }
}

module.exports = {
  createBoard,
  getBoard,
  getUserBoards,
  updateBoard,
  deleteBoard,
  toggleStar
};
