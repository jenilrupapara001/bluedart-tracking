require('dotenv').config();
const mongoose = require('mongoose');
const TrackingRecord = require('./src/models/TrackingRecord');

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const result = await TrackingRecord.deleteMany({});
        console.log(`🗑️ Successfully deleted ${result.deletedCount} records.`);

        await mongoose.connection.close();
        console.log('🔌 Connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();
