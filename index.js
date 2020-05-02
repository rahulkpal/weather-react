const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/text', (req, res) => {
  let { location } = req.body;
  let weatherData = {};
  location = encodeURIComponent(location);
  request({
    url: `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ}&q=${location}&format=json`,
    json: true,
  },(error, response, body) => {
    if (error) {
      res.status(500).json({
        title: 'Location API Error!',
        message: 'Unable to connect to Location API, please go back and try again!'
      });
    } else if (body.error === 'Unable to geocode') {
      res.status(500).json({
        title: 'Unable to get Geocode!',
        message: 'Sorry, we could not locate the textual address. Please try the locate me option to get accurate results!'
      });
    } else if (response.statusCode === 200) {
      results = {
        lat: body[0].lat,
        lon: body[0].lon,
        loc: body[0].display_name,
      }
      request({
        url: `https://api.darksky.net/forecast/${process.env.DARKSKY}/${results.lat},${results.lon}`,
        json: true,
      }, (error, response, body) => {
        weatherData.displayName = results.loc;
        weatherData.temperature = Math.round((body.currently.temperature - 32) * (5/9)) + ' °C';
        weatherData.apparentTemperature = Math.round((body.currently.apparentTemperature - 32) * (5/9)) + ' °C';
        weatherData.summary = body.currently.summary;
        weatherData.humidity = (Math.round(body.currently.humidity*100) + '%');
        weatherData.forecast = body.hourly.summary;
        weatherData.windSpeed = (Math.round((body.currently.windSpeed * 1.7)) + ' KPh');
        weatherData.icon = body.currently.icon;
        weatherData.hourly = body.hourly.data.slice(0, 13).map(({ time, temperature }) => ({ time, temperature: Math.round((temperature - 32) * (5/9)) }));
        weatherData.daily = body.daily.data.slice(0, 3).map(({ time, sunriseTime, sunsetTime, temperatureHigh, temperatureHighTime, temperatureLow, temperatureLowTime, icon }) => ({ time, sunriseTime, sunsetTime, temperatureHigh: Math.round((temperatureHigh - 32) * (5/9)), temperatureHighTime, temperatureLow: Math.round((temperatureLow - 32) * (5/9)), temperatureLowTime, icon }));
        res.status(200).json(weatherData);
      });
    }
  });
});

app.post('/coords', (req, res) => {
  const { lat, lon } = req.body;
  let weatherData = {};
  request({
      url: `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ}&lat=${lat}&lon=${lon}&format=json`,
      json: true,
    }, (error, response, body) => {
      if (error) {
        res.status(500).json({
          title: 'Location API Error!',
          message: 'Unable to connect to Location API, please go back and try again!'
        })
      } else if (body.error === 'Unable to get Geocode') {
        res.status(500).json({
          title: 'Unable to get Geocode!',
          message: 'Please check the address that you have entered and try again!'
        })
      } else if (response.statusCode === 200) {
        weatherData.displayName = body.display_name;
        request({
          url: `https://api.darksky.net/forecast/${process.env.DARKSKY}/${lat},${lon}`,
          json: true,
        }, (error, response, body) => {
          if (error) {
            res.status(500).json({
              title: 'Location API Error!',
              message: 'Unable to connect to Location API, please go back and try again!'
            })
          } else if (response) {
            weatherData.icon = body.currently.icon;
            weatherData.temperature = Math.round((body.currently.temperature - 32) * (5/9)) + ' °C';
            weatherData.apparentTemperature = Math.round((body.currently.apparentTemperature - 32) * (5/9)) + ' °C';
            weatherData.summary = body.currently.summary;
            weatherData.humidity = (Math.round(body.currently.humidity*100) + '%');
            weatherData.forecast = body.hourly.summary;
            weatherData.windSpeed = (Math.round((body.currently.windSpeed * 1.7)) + ' KPh');
            weatherData.hourly = body.hourly.data.slice(0, 13).map(({ time, temperature }) => ({ time, temperature: Math.round((temperature - 32) * (5/9)) }));
            weatherData.daily = body.daily.data.slice(0, 3).map(({ time, sunriseTime, sunsetTime, temperatureHigh, temperatureHighTime, temperatureLow, temperatureLowTime, icon }) => ({ time, sunriseTime, sunsetTime, temperatureHigh: Math.round((temperatureHigh - 32) * (5/9)), temperatureHighTime, temperatureLow: Math.round((temperatureLow - 32) * (5/9)), temperatureLowTime, icon }));
            res.status(200).json(weatherData);
          }
        })
      }
  });
});

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
