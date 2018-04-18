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
        res.render('index.hbs', {
            currentTemp: weatherCurr.temperature,
            currentIcon: weatherCurr.icon,
            currentPrecipProbability: weatherCurr.precipProbability
        });
    } catch (err) {
        console.log(err);
        res.render('index.hbs');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Essential server started on port: ${process.env.PORT}\n`);
});
