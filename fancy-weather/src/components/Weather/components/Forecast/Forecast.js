import React from 'react';
import CloudIcon from '@material-ui/icons/Cloud';
import ReactAnimatedWeather from 'react-animated-weather';
import './Forecast.scss';
import iconsMap from '../../../../utils/iconsMap';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Day({ temp, day, iconId }) {
  return (
    <div className="day">
      <p className="day-of-week">{day}</p>
      <div className="wrapper">
        <p>{temp}</p>
        <div className="icon">
          <ReactAnimatedWeather
            icon={iconsMap(iconId)}
            color="#FFFFFF"
            size={85}
            animate
          />
        </div>
      </div>
    </div>
  );
}

function Forecast({ forecast }) {
  const dayIndex = new Date(Date.now() + forecast.timezone).getDay();
  return (
    <div className="Forecast">
      <Day
        temp={Math.round(forecast[0].main.temp)}
        day={days[dayIndex]}
        iconId={forecast[0].weather[0].id}
      />
      <Day
        temp={Math.round(forecast[1].main.temp)}
        day={days[dayIndex + 1]}
        iconId={forecast[1].weather[0].id}
      />
      <Day
        temp={Math.round(forecast[2].main.temp)}
        day={days[dayIndex + 2]}
        iconId={forecast[2].weather[0].id}
      />
    </div>
  );
}

export default Forecast;
