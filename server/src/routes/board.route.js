const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board.controller');

router.post('/', boardController.createBoard);
router.get('/:id', boardController.getBoard);


router.put('/:id/shapes', boardController.updateBoardShapes);

module.exports = router;
