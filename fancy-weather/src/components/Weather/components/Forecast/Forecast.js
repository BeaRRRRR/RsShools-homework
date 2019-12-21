import React from 'react';
import './Forecast.scss';
import Day from './Day';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Forecast({ forecast }) {
  const dayIndex = new Date(Date.now() + forecast.timezone).getDay() + 1;
  console.log(forecast);
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
