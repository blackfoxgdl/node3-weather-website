const express = require('express');
const path = require('path');
const hbs = require('hbs');
const { ppid } = require('process');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partials = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partials);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ruben Cortes',
        title_page: 'Weather'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ruben Cortes',
        title_page: 'About'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text.',
        name: 'Ruben Cortes',
        title_page: 'Help'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address term'
        });
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {} ) => {
        if (error) {
            return res.send({
                error
            });
        }
    
        forecast(latitude, longitude, (errorForecast, forecastData) => {
            if (errorForecast) {
                return res.send({
                    errorForecast
                });
            } 
            
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        }); 
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ruben Cortes',
        errorMessage: 'Help article not found.',
        title_page: '404'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ruben Cortes',
        errorMessage: 'Page not found.',
        title_page: '404'
    });
});

// Starting Server!
app.listen(port, () => {
    console.log('Server is up on port ' + port + '!');
});