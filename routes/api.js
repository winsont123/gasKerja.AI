const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Controllers
const cvController = require('../controllers/cvController');
const interviewController = require('../controllers/interviewController');

// Rute-rute API
router.post('/analyze-cv', upload.single('cvFile'), cvController.analyzeCV);
router.post('/chat-interview', interviewController.handleInterview);
router.post('/evaluate-interview', interviewController.evaluateInterview); 

module.exports = router; 