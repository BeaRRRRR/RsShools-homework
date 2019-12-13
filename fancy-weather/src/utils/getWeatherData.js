import {addressToCords} from './api/geocoding';
const weatherApiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';


export async function getWeatherByAddress(address) {
  let cords = addressToCords(address);
  return await getWeatherByCords(...cords);
}

export async function getWeatherByCords(lat, lon) {
  const res = await fetch(`${proxyUrl}https://api.darksky.net/forecast/67ed3ca871f67366bc25a2324d8901b1/${lat},${lon}`);
  const json = await res.json();
  return json;
}
