const geoApiKey = process.env.REACT_APP_GOOGLE_GEOCODING_API_KEY;

export async function addressToCords(address) {
  const geolocation = await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geoApiKey}`)).json();
  return geolocation.results[0].geometry.location;
}

export async function cordsToAddress(lat, lon) {
  const address = await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${`${lat},${lon}`}&result_type=country|locality&key=${geoApiKey}`)).json();
  return address;
}
