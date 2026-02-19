const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Route to ingest tracking numbers (JSON array for now)
router.post('/track/upload', trackingController.uploadTrackingNumbers);

// Route to get all current statuses
router.get('/track/status', trackingController.getAllStatus);

// Route to download Excel report
router.get('/track/report', trackingController.getReport);

module.exports = router;
