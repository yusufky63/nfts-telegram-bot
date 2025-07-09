const fetch = require('node-fetch');
const config = require('./config');

// Timeout mechanism for API requests
async function fetchWithTimeout(url, timeout = config.FETCH_TIMEOUT) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Fetch error (${url}):`, error);
        throw error;
    }
}

// Format number
function formatNumber(number) {
    if (typeof number !== 'number') return '0';
    
    // Show 4 decimal places for ETH values
    if (number < 1) {
        return number.toFixed(4);
    }
    
    // Show 2 decimal places for other values
    return number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format USD
function formatUSD(number) {
    if (typeof number !== 'number') return '$0';
    return `$${number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Format error message
function getErrorMessage(error) {
    return error.response?.data?.message || error.message || 'An unknown error occurred';
}

module.exports = {
    fetchWithTimeout,
    formatNumber,
    formatUSD,
    getErrorMessage
}; 