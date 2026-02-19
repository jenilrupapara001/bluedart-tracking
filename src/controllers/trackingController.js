const TrackingRecord = require('../models/TrackingRecord');
const { trackShipment } = require('../services/trackCourierService');
const { generateExcelReport } = require('../services/excelService');
const fs = require('fs');
const path = require('path');

// Helper to delay execution (for rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processTrackingNumber(trackingNumber) {
    let record = await TrackingRecord.findOne({ trackingNumber });

    if (!record) {
        record = new TrackingRecord({ trackingNumber });
    }

    try {
        const data = await trackShipment(trackingNumber);
        console.log(`[DEBUG] API Response for ${trackingNumber}:`, JSON.stringify(data, null, 2));

        // Parse response - Adjust based on actual TrackCourier response structure
        const shipmentData = data.data || {};

        record.rawResponse = data;

        // Use MostRecentStatus for display, falling back to ShipmentState
        record.currentStatus = shipmentData.MostRecentStatus || shipmentData.ShipmentState || 'UNKNOWN';

        // Get last location from the most recent checkpoint
        if (shipmentData.Checkpoints && shipmentData.Checkpoints.length > 0) {
            record.lastLocation = shipmentData.Checkpoints[0].Location || 'Unknown';
            record.lastActivity = shipmentData.Checkpoints[0].Activity || '';
        } else {
            record.lastLocation = 'Awaiting Update';
            record.lastActivity = '';
        }

        // Parse dates from AdditionalInfo if present (e.g., "Scheduled Delivery: 16-Feb-2026")
        if (shipmentData.AdditionalInfo && shipmentData.AdditionalInfo.includes('Scheduled Delivery:')) {
            const dateStr = shipmentData.AdditionalInfo.split('Scheduled Delivery:')[1].trim();
            if (dateStr) {
                record.expectedDelivery = new Date(dateStr);
            }
        }

        // If delivered, try to find delivery date from Checkpoints
        if (record.currentStatus.toLowerCase() === 'delivered' && shipmentData.Checkpoints) {
            const deliveryCheckpoint = shipmentData.Checkpoints.find(c => c.Activity.toLowerCase().includes('delivered'));
            if (deliveryCheckpoint && deliveryCheckpoint.Date) {
                // Handle "16-Feb-2026" + "20:36"
                const dateTimeStr = `${deliveryCheckpoint.Date} ${deliveryCheckpoint.Time || ''}`.trim();
                record.deliveredDate = new Date(dateTimeStr);
            }
        }

        record.lastUpdated = new Date();
        record.retryCount = 0;

        await record.save();
        return { success: true, trackingNumber, status: record.currentStatus };

    } catch (error) {
        record.retryCount += 1;
        record.lastUpdated = new Date();
        await record.save();
        return { success: false, trackingNumber, error: error.message };
    }
}

exports.uploadTrackingNumbers = async (req, res) => {
    try {
        const { trackingNumbers } = req.body; // Expecting direct array for simplicity or parsed from file middleware

        if (!trackingNumbers || !Array.isArray(trackingNumbers)) {
            return res.status(400).json({ error: 'Invalid input. Expected "trackingNumbers" array.' });
        }

        const results = [];
        // Process in chunks to avoid rate limits
        for (const num of trackingNumbers) {
            const result = await processTrackingNumber(num);
            results.push(result);
            // Simple rate limiting: 1 request every 500ms
            await delay(500);
        }

        res.json({ message: 'Processing complete', results });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error processing tracking numbers' });
    }
};

exports.getReport = async (req, res) => {
    try {
        const records = await TrackingRecord.find().sort({ lastUpdated: -1 });
        const filePath = await generateExcelReport(records);

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
            // Optional: delete file after download
            // fs.unlinkSync(filePath); 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

exports.getAllStatus = async (req, res) => {
    try {
        const records = await TrackingRecord.find().sort({ lastUpdated: -1 }).limit(100);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch status' });
    }
};
