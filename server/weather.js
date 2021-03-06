require('./config/config');

const axios = require('axios');
const geo = require('./geolocation');
const moment = require('moment');

// Test weather if not online
const OFFLINE = false;

const testWeatherData = require('./testWeather.json');

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

// TODO: functions implement F° anc C° change --> client can do that

// // TODO: Need the escape?
// const createWeatherIcon = (iconName, idname) => {
//     return `<img id="${idname}" alt="${iconName} icon" src="..\\img\\${iconName}.svg" class="icon-img"></img>`;
// }

// Get daily weather for next 7 days (0 is current day!)
const createDailyDataArray = (weatherDaily) => {
    dataDaily = [];
    for (let i = 1; i < 8;  i++) {
        dataDaily[i] = {
            name: `weather-daily-${i}`,
            time: moment(weatherDaily[i].time*1000).format('ddd'),
            tempMax: `${Math.floor(celsius(weatherDaily[i].temperatureHigh))}°`,
            tempMin: `${Math.floor(celsius(weatherDaily[i].temperatureLow))}°`,
            iconName: weatherDaily[i].icon,
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
            time: moment(weatherHourly[i].time*1000).format('HH:00'),
            temp: `${Math.floor(celsius(weatherHourly[i].temperature))}°C`,
            iconName: weatherHourly[i].icon,
            precipProbability: `${Math.floor(weatherHourly[i].precipProbability * 100)}%`
        };
    }
    return dataHourly;
}

// Get current weather
const createCurrentData = (weatherData) => {
    return {
        temp: `${Math.floor(celsius(weatherData.currently.temperature))}°C`,
        tempMax: `${Math.floor(celsius(weatherData.daily.data[0].temperatureHigh))}°`,
        tempMin: `${Math.floor(celsius(weatherData.daily.data[0].temperatureLow))}°`,
        iconName: weatherData.currently.icon,
        iconIdName: 'weather-currently-icon-data',
        precipProbability: `${Math.floor(weatherData.hourly.data[0].precipProbability * 100)}%`
    }
}

const getWeatherData = async (input) => {
    try {
        let geoCoords;
        let weatherData;
        if (!OFFLINE) {
            geoCoords = await geo.getGeoLocationCoord(input);
            weatherData = await getWeather(geoCoords.lat, geoCoords.lng);
        } else {
            geoCoords = {
                locationsName: 'Test Location in nowhere'
            };
            weatherData = testWeatherData;
        }
        return newWeather = {
            status: 'ok',
            locationsName: geoCoords.location,
            timeCurrentDate: moment().format('dddd MMM YYYY'),
            timeCurrentTime: moment().format('HH:mm'),
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
