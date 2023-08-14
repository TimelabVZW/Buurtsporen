import React from 'react';
import { MapElementProps } from '../interfaces';
import { Marker, Polygon, Polyline, Popup } from 'react-leaflet';
import Button from './Button';
import { Icon, LatLngExpression } from 'leaflet';

import MarkerIconImage from '../assets/images/normal-marker.png';
import InfoIcon from '@mui/icons-material/Info';


const markerIcon = new Icon({
    iconUrl: MarkerIconImage,
    iconSize: [32, 32]
  })

//   disabled === modal !== ''
const MapElement: React.FC<MapElementProps> = ({marker, onClick, disabled}: MapElementProps) => {
    const coordsForSort= [...marker.coordinates]

    let sortedCoordinates = coordsForSort.sort((a, b) => {
        return a.id - b.id;
    });
    
    
    let coordinates: LatLngExpression[] = sortedCoordinates.map((coordinate) => [coordinate.latitude, coordinate.longitude]);
    switch (marker.type) {
        case 'Point':
            return (
                <Marker  icon={markerIcon} position={[marker.coordinates[0].latitude , marker.coordinates[0].longitude]}>
                  <Popup>
                    <Button 
                      className='button button--form' 
                      disabled={disabled} 
                      type='button' 
                      onClick={onClick}
                    >
                      <InfoIcon color='secondary'/>
                    </Button>
                  </Popup>
                </Marker>
            );
        case 'LineString':
            return (
                <Polyline positions={coordinates} color="red" >
                    <Popup>
                    <Button 
                        className='button button--form' 
                        disabled={disabled} 
                        type='button'
                        onClick={onClick}
                    >
                        <InfoIcon color='secondary'/>
                    </Button>
                    </Popup>
                </Polyline>
            );
        case 'Polygon':
            return (
                <Polygon positions={coordinates} color="blue" >
                    <Popup>
                    <Button 
                        className='button button--form' 
                        disabled={disabled} 
                        type='button'
                        onClick={onClick}
                    >
                        <InfoIcon color='secondary'/>
                    </Button>
                    </Popup>
                </Polygon>
            );
        default:
            return;
    }
};

export default MapElement;