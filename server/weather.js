require('./config/config');

const axios = require('axios');
const geo = require('./geolocation');

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

const getWeatherData = async (input) => {
    try {
        let geoCoords = await geo.getGeoLocationCoord(input);
        let weatherData = await getWeather(geoCoords.lat, geoCoords.lng);
        let weatherCurr = weatherData.currently;
        let weatherHourly = weatherData.hourly.data;
        let weatherDaily = weatherData.daily.data;
        let newWeather = {
            currently: {
                name: 'weather-currently',
                time: new Date(weatherCurr.time*1000),
                timeDay: new Date(weatherDaily[1].time*1000),
                temp: `${Math.floor(weather.celsius(weatherCurr.temperature))}°C`,
                tempMax: `${Math.floor(weather.celsius(weatherDaily[0].temperatureHigh))}°C`,
                tempMin: `${Math.floor(weather.celsius(weatherDaily[0].temperatureLow))}°C`,
                icon: weatherCurr.icon,
                precipProbability: `${weatherDaily[0].precipProbability * 100}%`
            },
            dailyHours: [
                {
                    name: 'weather-hour',
                    time: new Date(weatherHourly[0].time)

                }
            ],

        };
    } catch (err) {
        throw new Error(`Couldn\'t get weather information for ${input}: ${err}`);
    };

    // if (!time) {
    //     return getWeather(lat, lng);
    // } else {
    //     if (time === 'current') {
    //
    //     } else if (time === 'day') {
    //
    //     } else if (time === 'day+1') {
    //
    //     }
    // }
}

// try {
//     let geoCoords = await geo.getGeoLocationCoord(input);
//     let weatherData = await weather.getWeather(geoCoords.lat, geoCoords.lng);
//     let weatherCurr = weatherData.currently;
//     let weatherDaily = weatherData.daily.data;
//     let newWeather = {
//         today: {
//             name: 'weather-today',
//             time: new Date(weatherCurr.time*1000),
//             timeDay: new Date(weatherDaily[1].time*1000),
//             temp: `${Math.floor(weather.celsius(weatherCurr.temperature))}°C`,
//             tempMax: `${Math.floor(weather.celsius(weatherDaily[0].temperatureHigh))}°C`,
//             tempMin: `${Math.floor(weather.celsius(weatherDaily[0].temperatureLow))}°C`,
//             icon: weatherCurr.icon,
//             precipProbability: `${weatherDaily[0].precipProbability * 100}%`
//         }
//     };
//     res.status(200).send(newWeather);
// } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
// }

// °F = °C × 1,8 + 32
const fahrenheit = (celsius) => celsius * 1.8 + 32;

// C = (°F − 32) / 1,8
const celsius = (fahrenheit) => (fahrenheit - 32) / 1.8;

module.exports = {
    getWeather,
    fahrenheit,
    celsius
}
