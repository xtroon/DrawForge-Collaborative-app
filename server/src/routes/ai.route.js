const express = require('express');
const router = express.Router();
const { generateDiagram } = require('../controllers/ai.controller');

router.post('/generate', generateDiagram);

module.exports = router;