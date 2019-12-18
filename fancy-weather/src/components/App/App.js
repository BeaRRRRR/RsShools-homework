import React, { useEffect, useState } from 'react';
import './App.scss';
import Form from '../Form/Form';
import Map from '../Map/Map';
import Weather from '../Weather/Weather';
import Control from '../Control/Control';
import {
  getWeatherByAddress, getWeatherByCords, getForecastByAddress, getForecastByCords,
} from '../../utils/api/getWeatherData';
import { cordsToAddress } from '../../utils/api/geocoding';
import { getRandomImage } from '../../utils/api/unsplash';


function App() {
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState({});

  async function fetchData(e) {
    e.preventDefault();
    const address = e.target.elements.address.value;
    const [data, forecast] = await Promise.all([
      getWeatherByAddress(address),
      getForecastByAddress(address),
    ]);
    const newWeather = { ...data, address, forecast };
    setWeather(newWeather);
  }

  async function changeLang(e) {
    e.preventDefault();
  }

  async function fetchBgImage() {
    setBackground(await getRandomImage());
  }


  useEffect(() => {
    fetchBgImage();
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const [data, forecast, addressJson] = await Promise.all([
        getWeatherByCords(latitude, longitude),
        getForecastByCords(latitude, longitude),
        cordsToAddress(latitude, longitude),
      ]);
      const newWeather = {
        ...data,
        address: addressJson.results[0].formatted_address,
        forecast,
        timezone: data.timezone,
      };
      setWeather(newWeather);
    }, () => alert('You must have geolocation enabled'), { enableHighAccuracy: true });
  }, []);


  return (
    <div className="App">
      <div className="wrapper">
        <div className="first-column">
          <Control
            changeLang={changeLang}
            changeBg={fetchBgImage}
          />
          <Weather
            data={weather}
          />
        </div>
        <div className="second-column">
          <Form getWeather={fetchData} />
          <Map />
        </div>
      </div>
      <img src={background} alt="background image" />
    </div>
  );
}

export default App;
