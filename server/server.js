console.log('');
require('./config/config');

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

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
        let weatherData = await weather.getWeatherData(address);
        res.render('index.hbs', weatherData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.get('/:input', async (req, res) => {
    let input = req.params.input;
    try {
        let weatherData = await weather.getWeatherData(input);
        res.status(200).send(weatherData);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Essential weather server started on port: ${process.env.PORT}\n`);
});
