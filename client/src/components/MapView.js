import React, { Component, useState } from 'react';
import { MapContainer, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data';
import Markers from './VenueMarkers';
import points from '../assets/points.json';
import byState from '../assets/orgByState.json';


const MapView = () => {
  const [currentLocation, setCurrentLocation] = useState([44.81, -121]);
  const [zoom, setZoom] = useState(4);

  const [multiPolyline, setMultiPolyline] = useState(byState); 

  function MyComponent() {
    const map = useMapEvents({
      
      click: (e) => {
        console.log(e.latlng);
        let updated = [...multiPolyline];
        updated[0].push([e.latlng.lat, e.latlng.lng]);
        setMultiPolyline(updated);
      },
      
    });
    return null;
  }
  
  return (
    <MapContainer center={currentLocation} zoom={zoom} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />

      <Polyline pathOptions={{ color: 'green' }} positions={multiPolyline} />
      <MyComponent />
      {/* <Markers venues={data.venues}/> */}
    </MapContainer>
  );
}

export default MapView;
