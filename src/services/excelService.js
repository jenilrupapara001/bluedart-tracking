const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

/**
 * Generate Excel report from tracking records
 * @param {Array} records - Array of TrackingRecord documents
 * @returns {string} Path to the generated file
 */
async function generateExcelReport(records) {
    const data = records.map(record => ({
        'Tracking Number': record.trackingNumber,
        'Status': record.currentStatus,
        'Last Location': record.lastLocation || 'N/A',
        'Delivered Date': record.deliveredDate ? new Date(record.deliveredDate).toLocaleDateString() : 'N/A',
        'Expected Delivery': record.expectedDelivery ? new Date(record.expectedDelivery).toLocaleDateString() : 'N/A',
        'Last Updated': new Date(record.lastUpdated).toLocaleString()
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Tracking Report');

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, '../../reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }

    const fileName = `tracking_report_${Date.now()}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    xlsx.writeFile(workbook, filePath);
    return filePath;
}

module.exports = { generateExcelReport };
