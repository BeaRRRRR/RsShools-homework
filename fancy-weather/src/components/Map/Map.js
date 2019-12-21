import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhcnJycnIiLCJhIjoiY2s0OGx0MjB6MTNjcjNscGdqMmNidTk2MSJ9.hW27hvtvVkugJetaHNPKtg';

function Map({ setWeather, latitude = 0, longitude = 0 }) {
  const [lng, setLng] = useState(latitude);
  const [lat, setLat] = useState(longitude);
  const [map, setMap] = useState({});
  let mapContainer;

  useEffect(() => {
    if (!map.on) return;
    map.on('click', () => {
      console.log('cki');
      setWeather(map.getCenter().lat.toFixed(4), map.getCenter().lng.toFixed(4));
    });
    map.on('move', () => {
      setLat(map.getCenter().lat.toFixed(4));
      setLng(map.getCenter().lng.toFixed(4));
    });
  }, [map]);

  useEffect(() => {
    setMap(new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 8,
    }));
  }, []);

  useEffect(() => {
    if (!map.flyTo) return;
    map.flyTo({
      center: [longitude, latitude],
    });
  }, [latitude, longitude]);

  return (
    <div className="Map">
      <div ref={(el) => mapContainer = el} className="mapContainer" />
      <p>Latitude :{lat}</p>
      <p>Longitude :{lng}</p>
    </div>
  );
}

export default Map;
