const fetch = require('node-fetch');
const config = require('./config');

// API istekleri için timeout mekanizması
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
        console.error(`Fetch hatası (${url}):`, error);
        throw error;
    }
}

// Sayıyı formatla
function formatNumber(number) {
    if (typeof number !== 'number') return '0';
    
    // ETH değerleri için 4 ondalık basamak göster
    if (number < 1) {
        return number.toFixed(4);
    }
    
    // Diğer değerler için 2 ondalık basamak göster
    return number.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// USD formatla
function formatUSD(number) {
    if (typeof number !== 'number') return '$0';
    return `$${number.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Hata mesajını formatla
function getErrorMessage(error) {
    return error.response?.data?.message || error.message || 'Bilinmeyen bir hata oluştu';
}

module.exports = {
    fetchWithTimeout,
    formatNumber,
    formatUSD,
    getErrorMessage
}; 