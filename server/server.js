console.log('');
require('./config/config');

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

const geo = require('./geolocation');
const weather = require('./weather');

const publicPath = path.join(__dirname, '../public');

const app = express();

hbs.registerPartials(__dirname + './../views');

app.use(express.static(publicPath));

app.use((req, res, next) => {
    let now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').toString();
    let log = `${now} : ${req.method} ${req.url}`;
    console.log(log);
    next();
});

app.get('/', async (req, res) => {
    let address = 'Dortmund';
    try {
        let geoCoords = await geo.getGeoLocationCoord('Dortmund');
        let weatherData = await weather.getWeather(geoCoords.lat, geoCoords.lng);
        let weatherCurr = weatherData.currently;
        let weatherDaily = weatherData.daily.data;
        res.render('index.hbs', {
            today: {
                name: 'weather-today',
                time: new Date(weatherCurr.time*1000),
                timeDay: new Date(weatherDaily[1].time*1000),
                temp: `${Math.floor(weather.celsius(weatherCurr.temperature))}°C`,
                tempMax: `${Math.floor(weather.celsius(weatherDaily[0].temperatureHigh))}°C`,
                tempMin: `${Math.floor(weather.celsius(weatherDaily[0].temperatureLow))}°C`,
                icon: weatherCurr.icon,
                precipProbability: `${weatherCurr.precipProbability}%`
            }
        });
    } catch (err) {
        console.log(err);
        res.render('index.hbs');
    }
});

app.get('/:input', async (req, res) => {
    let input = req.params.input;
    try {
        let geoCoords = await geo.getGeoLocationCoord(input);
        let weatherData = await weather.getWeather(geoCoords.lat, geoCoords.lng);
        let weatherCurr = weatherData.currently;
        let weatherDaily = weatherData.daily.data;
        let newWeather = {
            today: {
                name: 'weather-today',
                time: new Date(weatherCurr.time*1000),
                timeDay: new Date(weatherDaily[1].time*1000),
                temp: `${Math.floor(weather.celsius(weatherCurr.temperature))}°C`,
                tempMax: `${Math.floor(weather.celsius(weatherDaily[0].temperatureHigh))}°C`,
                tempMin: `${Math.floor(weather.celsius(weatherDaily[0].temperatureLow))}°C`,
                icon: weatherCurr.icon,
                precipProbability: `${weatherCurr.precipProbability}%`
            }
        };
        res.status(200).send(newWeather);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Essential weather server started on port: ${process.env.PORT}\n`);
});
