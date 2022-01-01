import React, { Component, useEffect, useState } from 'react';
import { MapContainer, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Markers from './VenueMarkers';
import countyLines from '../states/ME/CountyBorders.json';
// import countyLines from '../assets/path.json';
import countyPoints from '../states/ME/CountyPoints.json';
import { getPointInfo } from '../helpers/ReverseGeocoding.js'
import axios from 'axios';

//the main component...it takes in an array of state objects containing the state abbr. and yeah 
const MapView = ({
  states
}) => {
  const [currentLocation, setCurrentLocation] = useState([44.81, -121]);
  const [zoom, setZoom] = useState(4);
  const [multiPolyline, setMultiPolyline] = useState(countyLines); 
  const [waPath, setWaPath] = useState([]); 
  const [point, setPoint] = useState({lat: "", lng: ""}); 
  
  const [addingPoints, setAddingPoints] = useState(false); 
  const [startPoint, setStartPoint] = useState(false); 
  const [endPoint, setEndPoint] = useState(false); 


  useEffect(() => {
    axios.get("http://localhost:5000/api/get-points/WA");
    let newArr = [];
    for(let i = 0; i < countyLines.length; i++) {
      let val = countyLines[i]["fields"]["geo_shape"]["coordinates"][0];
      let swap = val.map(pair => {
        return [pair[1], pair[0]];
      })
      newArr.push(swap)
    }
    // console.log(newArr);
    setMultiPolyline(newArr);
    setWaPath(countyPoints.map(county => [county[1][1], county[1][0]]));
  }, []);

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        setPoint(e.latlng);
        if(addingPoints) {
          getPointInfo(e.latlng, (res) => {
            let props = res["features"][0]["properties"];
            
            console.log("State: " + props["region"])
            console.log("State: " + props["region_a"])
            console.log("County: " + props["county"])
            console.log(res);
  
  
            axios.post("http://localhost:5000/api/update", { ...e.latlng, county: props["county"], state: props["region_a"] })
            .then(res => {
              console.log("Yeah boissss!");
              
            })
            .catch(err => {
  
            })
  
  
          });
        }
        
        // let updated = [...multiPolyline];
        // updated[0].push([e.latlng.lat, e.latlng.lng]);
        // setMultiPolyline(updated);
      },
      
    });
    return null;
  }
  
  return (
    <div>
      <button onClick= {e => setAddingPoints(!addingPoints)}>{addingPoints ? "Stop Adding" : "Add Fixed Points"}</button>
      <button onClick= {e => setStartPoint(!startPoint)}>{startPoint ? "Stop setting Start Point" : "Add start Point"}</button>
      <button onClick= {e => setEndPoint(!endPoint)}>{endPoint ? "Stop setting End Point" : "Add end Point"}</button>
      <div>Chosen point (long, lat): {point["lng"]}, {point["lat"]}</div>
      <MapContainer center={currentLocation} zoom={zoom} >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        <Polyline pathOptions={{ color: 'green' }} positions={multiPolyline} />
        <Polyline pathOptions={{ color: 'red' }} positions={waPath} />
        <MyComponent />
        <Markers counties={countyPoints}/>
      </MapContainer>
    </div>
  );
}

export default MapView;
