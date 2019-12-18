import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmVhcnJycnIiLCJhIjoiY2s0OGx0MjB6MTNjcjNscGdqMmNidTk2MSJ9.hW27hvtvVkugJetaHNPKtg';

function Map() {
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(4);
  let mapContainer;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom,
    });
  }, [lat, lng, mapContainer, zoom]);

  return (
    <div>
      <div ref={(el) => mapContainer = el} className="mapContainer"/>
    </div>
  );
}

export default Map;
