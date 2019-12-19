import React, { useEffect, useState } from 'react';
import './App.scss';
import Form from '../Form/Form';
import Map from '../Map/Map';
import Weather from '../Weather/Weather';
import Control from '../Control/Control';
import {
  getWeatherByAddress, getWeatherByCords, getForecastByAddress, getForecastByCords,
} from '../../utils/api/getWeatherData';
import { addressToCords, cordsToAddress } from '../../utils/api/geocoding';
import { getRandomImage } from '../../utils/api/unsplash';


function App() {
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState({});
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  async function fetchData(e) {
    e.preventDefault();
    const address = e.target.elements.address.value;
    const [data, forecast, cords] = await Promise.all([
      getWeatherByAddress(address),
      getForecastByAddress(address),
      addressToCords(address),
    ]);
    const newWeather = { ...data, address, forecast };
    setWeather(newWeather);
    setLat(cords.lat, cords.lon);
  }

  async function changeLang(e) {
    e.preventDefault();
  }

  function changeUnits(toFahrenheit) {
    const newWeather = { ...weather };
    let { temp, feels_like } = newWeather.main;
    temp = Math.round(temp);
    let feelsLike = Math.round(feels_like);
    if (toFahrenheit) {
      temp = (temp * (9 / 5)) + 32;
      feelsLike = (feelsLike * (9 / 5)) + 32;
    } else {
      temp = (temp - 32) * (5 / 9);
      feelsLike = (feelsLike - 32) * (5 / 9);
    }
    newWeather.main.temp = temp;
    newWeather.main.feelsLike = feelsLike;
    setWeather(newWeather);
  }

  async function fetchBgImage() {
    setBackground(await getRandomImage());
  }

  async function setWeatherByCords(latitude, longitude) {
    console.log(arguments);
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
  }

  useEffect(() => {
    fetchBgImage();
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setWeatherByCords(latitude, longitude);
      setLat(latitude);
      setLon(longitude);
    }, () => alert('You must have geolocation enabled'), { enableHighAccuracy: true });
  }, []);


  return (
    <div className="App">
      <div className="wrapper">
        <div className="first-column">
          <Control
            changeLang={changeLang}
            changeBg={fetchBgImage}
            changeUnits={changeUnits}
          />
          <Weather
            data={weather}
          />
        </div>
        <div className="second-column">
          <Form
            getWeather={fetchData}
          />
          <Map
            setWeather={setWeatherByCords}
            latitude={lat}
            longitude={lon}
          />
        </div>
      </div>
      <img src={background} alt="background image" />
    </div>
  );
}

export default App;
