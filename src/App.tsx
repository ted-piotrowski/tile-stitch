import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';
import Cropper from './components/Cropper';
import Tools from './components/Tools';

function App() {
  const position = [47.61, -122.48] as LatLngTuple;

  return (
    <MapContainer
      center={position}
      zoom={11}
      maxZoom={20}
      maxBounds={[[-90, -360], [90, 360]]}
      maxBoundsViscosity={1}
      style={{ height: '100%' }}
    >
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
