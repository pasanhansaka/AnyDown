const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyze-controller');
const downloadController = require('../controllers/download-controller');

// Analyze URL
router.post('/analyze', analyzeController.analyze);

// Download video/audio
router.get('/download', downloadController.download);

module.exports = router;
