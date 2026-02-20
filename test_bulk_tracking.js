require('dotenv').config();
const mongoose = require('mongoose');
const { uploadTrackingNumbers } = require('./src/controllers/trackingController');

// Mock request and response
const mockReq = {
    body: {
        trackingNumbers: [
            "52046224134",
            "52046876770",
            "52046922351",
            "52046936130",
            "52046940761",
            "52046948251",
            "52046950196",
            "52046954374",
            "52046954750",
            "52046963360"
        ]
    }
};

const mockRes = {
    status: (code) => ({
        json: (data) => console.log(`[Status ${code}]`, JSON.stringify(data, null, 2))
    }),
    json: (data) => console.log('[Success]', JSON.stringify(data, null, 2))
};

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Testing');

        console.log('🚀 Starting Bulk Processing for 10 Tracking Numbers...');
        await uploadTrackingNumbers(mockReq, mockRes);

        console.log('✨ Test Run Complete. Check logs above for details.');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

runTest();
