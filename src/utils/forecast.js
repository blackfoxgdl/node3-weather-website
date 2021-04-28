const request = require('request');

const forescast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=9ad9c51d2b42494fdb02cf0b9e35442c&query=' +
                long + ',' + lat + '&units=m';
    
    request({ url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback('Unable to find location. Try another search!', undefined);
        } else {
            const message = "It is currently " + body.current.temperature  + " degress out. " +
                         "It feels like " + body.current.feelslike + " degress out." +
                         "There is a " + body.current.precip + "% change of rain." +
                         "The humidity is " + body.current.humidity + "% and the " +
                         "wind speed is " + body.current.wind_speed + " KM per hour.";
            callback(undefined, message);
        }
    });
};

module.exports = forescast;