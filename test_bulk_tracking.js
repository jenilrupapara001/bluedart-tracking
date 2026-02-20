require('dotenv').config();
const mongoose = require('mongoose');
const { uploadTrackingNumbers } = require('./src/controllers/trackingController');

// Mock request and response
const mockReq = {
    body: {
        trackingNumbers: [
            "30001275108",
            "52073128951",
            "52073475381"
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
