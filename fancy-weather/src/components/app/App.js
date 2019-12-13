import React, { useEffect, useState } from 'react';
import './App.scss';
import Form from '../form/Form';
import Weather from '../weather/Weather';
import { getWeatherByAddress, getWeatherByCords } from '../../utils/getWeatherData';
import { cordsToAddress } from '../../utils/api/geocoding';
import { getRandomImage } from '../../utils/api/unsplash';

const bgGradient = 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) )';

function App() {
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState({});

  async function fetchData(e) {
    e.preventDefault();
    const address = e.target.elements.address.value;
    console.log(address);
    getWeatherByAddress(address);
  }

  async function fetchBgImage() {
    setBackground({ background: `${bgGradient},url(${await getRandomImage()})` });
  }

  useEffect(() => console.log(weather), [weather]);

  useEffect(() => {
    fetchBgImage();
    navigator.geolocation.getCurrentPosition(async (position) => {
      let { latitude, longitude } = position.coords;
      const data = await getWeatherByCords(latitude, longitude);
      console.log('setting weather');
      setWeather(data);
      let address = await cordsToAddress(latitude, longitude);
    });
  }, []);


  return (
    <div className="App" style={background}>
      {console.log(getRandomImage())}
      <h3>Weather App</h3>
      <Form getWeather={fetchData}/>
      <Weather
        data={weather}
      />
    </div>
  );
}

export default App;
