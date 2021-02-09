import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';

function App() {
  const position = [51.505, -0.09] as LatLngTuple;

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}

export default App;
