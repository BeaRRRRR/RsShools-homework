import ReactAnimatedWeather from 'react-animated-weather';
import React from 'react';
import iconsMap from '../../../../utils/iconsMap';

export default function Day({ temp, day, iconId }) {
  return (
    <div className="day">
      <p className="day-of-week">{day}</p>
      <div className="wrapper">
        <p>{temp}</p>
        <div className="icon">
          <ReactAnimatedWeather
            icon={iconsMap(iconId, true)}
            color="#FFFFFF"
            size={85}
            animate
          />
        </div>
      </div>
    </div>
  );
}
