import React from 'react';
import './Weather.scss';
import ReactAnimatedWeather from 'react-animated-weather';
import Forecast from './components/Forecast/Forecast';
import iconsMap from '../../utils/iconsMap';

function Weather({ data }) {
  let time;
  if(data.weather && data.dt) {
    time = new Date(Date.now() + data.timezone).toLocaleDateString(undefined, {
      month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric',
    });
  }
  return data && data.main ? (
    <div className="Weather">
      <p className="address">{data.address}</p>
      <p className="time">{time}</p>
      <div className="wrapper">
        <p className="temperature">{Math.round(data.main.temp)}</p>
        <div className="icon">
          <ReactAnimatedWeather
            icon={iconsMap(data.weather[0].id)}
            color="#FFFFFF"
            size={200}
            animate
          />
        </div>
        <div className="info">
          <p>{data.weather[0].description}</p>
          <p>Feels like: {data.main.feels_like}° </p>
          <p>Wind: {data.wind.speed} m/s</p>
          <p>Humidity: {data.main.humidity}</p>
        </div>
      </div>
      <Forecast forecast={{ ...data.forecast, timezone: data.timezone }} />
    </div>
  ) : (<div />);
}

export default Weather;
