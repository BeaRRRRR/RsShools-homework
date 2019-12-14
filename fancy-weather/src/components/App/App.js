import React, { useEffect, useState } from 'react';
import './App.scss';
import Grid from '@material-ui/core/Grid';
import Form from '../Form/Form';
import Weather from '../Weather/Weather';
import Control from '../Control/Control';
import { getWeatherByAddress, getWeatherByCords } from '../../utils/getWeatherData';
import { cordsToAddress } from '../../utils/api/geocoding';
import { getRandomImage } from '../../utils/api/unsplash';


function App() {
  const [weather, setWeather] = useState({});
  const [background, setBackground] = useState({});

  async function fetchData(e) {
    e.preventDefault();
    const address = e.target.elements.address.value;
    let data = await getWeatherByAddress(address);
    data = { ...data, address };
    setWeather(data);
  }

  async function changeLang(e) {
    e.preventDefault();
    console.log(e.target);
  }

  async function fetchBgImage() {
    setBackground(await getRandomImage());
  }


  useEffect(() => {
    fetchBgImage();
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      let data = await getWeatherByCords(latitude, longitude);
      const addressJson = await cordsToAddress(latitude, longitude);
      data = { ...data, address: addressJson.results[0].formatted_address };
      setWeather(data);
      console.log('rerender');
    });
  }, []);


  return (
    <div className="App">
      <div className="wrapper">
        <div className="first-column">
          <Control changeLang={changeLang} />
          <Weather
            data={weather}
          />
        </div>
        <div className="second-column">
          <Form getWeather={fetchData} />
          <div>Map</div>
        </div>
      </div>
      <img src={background} alt="background image" />
    </div>
  );
}

export default App;
