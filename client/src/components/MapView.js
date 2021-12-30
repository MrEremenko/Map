import React, { Component, useEffect, useState } from 'react';
import { MapContainer, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../assets/data';
import Markers from './VenueMarkers';
import points from '../assets/points.json';
import byState from '../assets/orgByState.json';
import test from '../states/WA/countyLines.json';

//the main component...it takes in an array of state objects containing the state abbr. and yeah 
const MapView = ({
  states
}) => {
  const [currentLocation, setCurrentLocation] = useState([44.81, -121]);
  const [zoom, setZoom] = useState(4);
  const [multiPolyline, setMultiPolyline] = useState(byState); 
  const [waPath, setWaPath] = useState(byState); 


  useEffect(() => {
    let newArr = [];
    for(let i = 0; i < test.length; i++) {
      let val = test[i]["fields"]["geo_shape"]["coordinates"][0];
      let swap = val.map(pair => {
        return [pair[1], pair[0]];
      })
      newArr.push(swap)
    }
    console.log(newArr);
    setMultiPolyline(newArr);
  }, []);

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        console.log(e.latlng);
        // let updated = [...multiPolyline];
        // updated[0].push([e.latlng.lat, e.latlng.lng]);
        // setMultiPolyline(updated);
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
      <Polyline pathOptions={{ color: 'red' }} positions={waPath} />
      <MyComponent />
      {/* <Markers venues={data.venues}/> */}
    </MapContainer>
  );
}

export default MapView;
