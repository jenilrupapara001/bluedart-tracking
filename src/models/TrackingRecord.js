const mongoose = require('mongoose');

const trackingRecordSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  courier: {
    type: String,
    default: 'bluedart'
  },
  currentStatus: {
    type: String,
    default: 'PENDING'
  },
  lastLocation: String,
  lastActivity: String,
  deliveredDate: Date,
  expectedDelivery: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  rawResponse: mongoose.Schema.Types.Mixed,
  retryCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('TrackingRecord', trackingRecordSchema);
