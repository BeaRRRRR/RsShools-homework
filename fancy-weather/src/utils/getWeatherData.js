import { addressToCords } from './api/geocoding';

// const weatherApiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
// const proxyUrl = 'https://cors-anywhere.herokuapp.com/';


export async function getWeatherByAddress(address) {
  const cords = await addressToCords(address);
  console.log(cords);
  return await getWeatherByCords(cords.lat, cords.lng);
}

export async function getWeatherByCords(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=en&units=metric&APPID=3a8ab49bbd117bd6b66e163bbaa0f196`);
  const json = await res.json();
  return json;
}
