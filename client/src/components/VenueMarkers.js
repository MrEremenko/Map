import React, { Fragment } from 'react'
import {Marker} from 'react-leaflet';
import { Icon } from 'leaflet';
import icon from "../assets/dot.png";

import {Popup} from 'react-leaflet';

const VenueMarkers = ({counties}) => {

  const markers = counties.map((county, index) => (
    <Marker key={index} position={[county[1][1], county[1][0]]} icon={new Icon({iconUrl: icon, iconSize: [10, 10] })}  >
      <Popup>
        <div className='poup-text'>{county[0]}</div>
      </Popup>
    </Marker>
  ));

  return <Fragment>{markers}</Fragment>
};

export default VenueMarkers;
