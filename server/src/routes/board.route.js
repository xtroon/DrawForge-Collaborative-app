const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board.controller');

router.post('/', boardController.createBoard);
router.get('/:id', boardController.getBoard);


router.put('/:id/shapes', boardController.updateBoardShapes);
router.put('/:id/title', boardController.updateBoardTitle);
router.put('/:id/star', boardController.toggleStar);
router.put('/:id/trash', boardController.toggleTrash);
router.delete('/:id', boardController.deleteBoard);
router.get('/user/:id', boardController.getUserBoards);

module.exports = router;
