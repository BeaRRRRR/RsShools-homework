import React from 'react';
import './Weather.scss';
import CloudIcon from '@material-ui/icons/Cloud';

function Weather({ data }) {
  const time = new Date().toLocaleDateString(undefined, {
    month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric',
  });
  console.log(data);
  return data && data.main ? (
    <div className="Weather">
      <p className="address">{data.address}</p>
      <p className="time">{time}</p>
      <div className="wrapper">
        <p className="temperature">{Math.round(data.main.temp)}</p>
        <div className="icon">
          <CloudIcon className="icon_svg" />
        </div>
        <div className="info">
          <p>{data.weather[0].description}</p>
          <p>Feels like: {data.main.feels_like}°</p>
          <p>Wind: {data.wind.speed} m/s</p>
          <p>Humidity: {data.main.humidity}</p>
        </div>
      </div>
    </div>
  ) : (<div>Hello wtf</div>);
}

export default Weather;
