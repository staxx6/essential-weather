require('./config/config');

const axios = require('axios');
const geo = require('./geolocation');

// Test weather if not online
const OFFLINE = true;

const testWeatherData = require('./testWeather.json');
// Some stupid manual test data
const testWeatherDataOld = {
    status: 'ok',
    currently: {
        time: 5000,
        timeDay: new Date(500000),
        temp: `500°C`,
        tempMax: `500°C`,
        tempMin: `500°C`,
        icon: 'testIco',
        precipProbability: `120%`
    },
    hourly: [{
        name: `weather-hour-1`,
        time: new Date(),
        temp: '100°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-2`,
        time: new Date(),
        temp: '100°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-3`,
        time: new Date(),
        temp: '103°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-4`,
        time: new Date(),
        temp: '104°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-5`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-6`,
        time: new Date(),
        temp: '106°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-7`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-8`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-9`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-10`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-11`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    },{
        name: `weather-hour-12`,
        time: new Date(),
        temp: '105°C',
        icon: 'explosion',
        precipProbability: '120%'
    }],
    daily: [{
        name: `weather-daily-1`,
        time: new Date(),
        tempMax: `201°C`,
        tempMin: `200°C`,
        icon: 'fuckingcold',
        precipProbability: `130%`
    },{
        name: `weather-daily-2`,
        time: new Date(),
        tempMax: `202°C`,
        tempMin: `200°C`,
        icon: 'fuckingcold',
        precipProbability: `130%`
    },{
        name: `weather-daily-3`,
        time: new Date(),
        tempMax: `203°C`,
        tempMin: `200°C`,
        icon: 'fuckingcold',
        precipProbability: `130%`
    },{
        name: `weather-daily-4`,
        time: new Date(),
        tempMax: `204°C`,
        tempMin: `200°C`,
        icon: 'fuckingcold',
        precipProbability: `130%`
    },{
        name: `weather-daily-5`,
        time: new Date(),
        tempMax: `205°C`,
        tempMin: `200°C`,
        icon: 'fuckingcold',
        precipProbability: `130%`
    },{
        name: `weather-daily-6`,
        time: new Date(),
        tempMax: `206°C`,
        tempMin: `200°C`,
        icon: 'fuckingcold',
        precipProbability: `130%`
    },]
};

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

// TODO: functions for solo data ex. tempCurrent() = { ... }
// TODO: functions implement F° anc C° change --> client can do that

// Get daily weather for next 7 days (0 is current day!)
const createDailyDataArray = (weatherDaily) => {
    dataDaily = [];
    for (let i = 1; i < 8;  i++) {
        dataDaily[i] = {
            name: `weather-daily-${i}`,
            time: new Date(weatherDaily[i].time*1000),
            tempMax: `${Math.floor(celsius(weatherDaily[i].temperatureHigh))}°C`,
            tempMin: `${Math.floor(celsius(weatherDaily[i].temperatureLow))}°C`,
            icon: weatherDaily[i].icon,
            precipProbability: `${Math.floor(weatherDaily[i].precipProbability * 100)}%`
        };
    }
    return dataDaily;
}

// Get hourly weather for 12hrs in the future (0 is current hour!)
const createHourlyDataArray = (weatherHourly) => {
    dataHourly = [];
    for (let i = 1; i < 15;  i++) {
        if(i % 2 !== 0) {
            continue;
        }
        dataHourly[i] = {
            name: `weather-hour-${i}`,
            time: new Date(weatherHourly[i].time*1000),
            temp: `${Math.floor(celsius(weatherHourly[i].temperature))}°C`,
            icon: weatherHourly[i].icon,
            precipProbability: `${Math.floor(weatherHourly[i].precipProbability * 100)}%`
        };
    }
    return dataHourly;
}

// Get current weather
const createCurrentData = (weatherData) => {
    return {
        time: new Date(),
        temp: `${Math.floor(celsius(weatherData.currently.temperature))}°C`,
        tempMax: `${Math.floor(celsius(weatherData.daily.data[0].temperatureHigh))}°C`,
        tempMin: `${Math.floor(celsius(weatherData.daily.data[0].temperatureLow))}°C`,
        icon: weatherData.currently.icon,
        precipProbability: `${Math.floor(weatherData.hourly.data[0].precipProbability * 100)}%`
    }
}

const getWeatherData = async (input) => {
    try {
        if (!OFFLINE) {
            let geoCoords = await geo.getGeoLocationCoord(input);
            let weatherData = await getWeather(geoCoords.lat, geoCoords.lng);
        } else {
            weatherData = testWeatherData;
        }
        return newWeather = {
            status: 'ok',
            currently: createCurrentData(weatherData),
            hourly: createHourlyDataArray(weatherData.hourly.data),
            daily: createDailyDataArray(weatherData.daily.data)
        };
    } catch (err) {
        throw new Error(`Couldn\'t get weather information for ${input}: ${err}`);
    };
};

// °F = °C × 1,8 + 32
const fahrenheit = (celsius) => celsius * 1.8 + 32;

// C = (°F − 32) / 1,8
const celsius = (fahrenheit) => (fahrenheit - 32) / 1.8;

module.exports = {
    getWeatherData,
    fahrenheit,
    celsius
}
