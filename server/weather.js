require('./config/config');

const axios = require('axios');

const getWeather = async (lat, lng) => {
    if (!lat || !lng) return null;

    try {
        const weatherToken = process.env.WEATHERTOKEN;
        const weatherUrl = `https://api.darksky.net/forecast/${weatherToken}/${lat},${lng}`
        console.log(weatherUrl);
        const response = await axios.get(weatherUrl);
        return response.data;
    } catch (err) {
        throw new Error(`Couldn\'t fetch weather information for ${lat}, ${lng}: ${err}`);
    }
}

// °F = °C × 1,8 + 32
const fahrenheit = (celsius) => celsius * 1.8 + 32;

// C = (°F − 32) / 1,8
const celsius = (fahrenheit) => (fahrenheit - 32) / 1.8;

module.exports = {
    getWeather,
    fahrenheit,
    celsius
}
