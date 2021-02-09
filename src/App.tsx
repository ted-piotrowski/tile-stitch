import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';
import Cropper from './components/Cropper';
import Tools from './components/Tools';

function App() {
  const position = [51.505, -0.09] as LatLngTuple;

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} maxZoom={20} style={{ height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Tools />
      <Cropper />
    </MapContainer>
  )
}

export default App;
