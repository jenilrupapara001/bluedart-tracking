const axios = require('axios');

const TRACKCOURIER_API_URL = 'https://api.trackcourier.io/v1/track';

/**
 * Track a shipment using TrackCourier API
 * @param {string} trackingNumber 
 * @returns {Promise<Object>} API Response
 */
async function trackShipment(trackingNumber) {
    const apiKey = process.env.TRACKCOURIER_API_KEY;
    if (!apiKey) {
        throw new Error('TRACKCOURIER_API_KEY is not set in environment variables');
    }

    try {
        const response = await axios.get(`${TRACKCOURIER_API_URL}`, {
            headers: {
                'X-API-Key': apiKey
            },
            params: {
                courier: 'bluedart',
                tracking_number: trackingNumber
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error tracking ${trackingNumber}:`, error.message);
        if (error.response) {
            console.error('API Error Response:', error.response.data);
            throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
}

module.exports = { trackShipment };
