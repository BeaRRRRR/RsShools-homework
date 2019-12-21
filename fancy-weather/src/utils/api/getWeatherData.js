import { addressToCords } from './geocoding';

export async function getWeatherByCords(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=en&units=metric&APPID=3a8ab49bbd117bd6b66e163bbaa0f196`);
  const json = await res.json();
  return json;
}

export async function getWeatherByAddress(address) {
  const cords = await addressToCords(address);
  return await getWeatherByCords(cords.lat, cords.lng);
}

export async function getForecastByCords(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=en&units=metric&APPID=3a8ab49bbd117bd6b66e163bbaa0f196`);
  const json = await res.json();
  const { list } = json;
  const hours = Math.floor((new Date().getHours() - 12) / 3);
  return [list[8 - hours], list[16 - hours], list[25 - hours]];
}

export async function getForecastByAddress(address) {
  const cords = await addressToCords(address);
  return await getForecastByCords(cords.lat, cords.lng);
}
