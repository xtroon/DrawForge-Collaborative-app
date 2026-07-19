const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board.controller');

router.post('/', boardController.createBoard);
router.get('/:id', boardController.getBoard);
router.put('/:id', boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);
router.get('/user/:id', boardController.getUserBoards);
router.put('/:id/star', boardController.toggleStar);

module.exports = router;
