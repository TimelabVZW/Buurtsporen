import React from 'react';
import { MapElementProps } from '../interfaces';
import { Marker, Polygon, Polyline, Popup } from 'react-leaflet';
import Button from './Button';
import { Icon, LatLngExpression } from 'leaflet';

import MarkerIconImage from '../assets/images/normal-marker.png';
import InfoIcon from '@mui/icons-material/Info';

import BackupMarkerIconImage from '../assets/svg/BS_backup_icon.svg';

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
                <Marker  
                    icon={ new Icon({
                        iconUrl: marker.icon? `http://localhost:3000/icon/icon-file/${marker.icon.fileName}` : BackupMarkerIconImage,
                        iconSize: [32, 32]
                      })
                    }
                    position={[marker.coordinates[0].latitude , marker.coordinates[0].longitude]}
                    eventHandlers={{
                        click: () => {
                            onClick();
                        }
                    }}
                >
                </Marker>
            );
        case 'LineString':
            return (
                <Polyline 
                    positions={coordinates} 
                    color={marker.color}
                    eventHandlers={{
                        click: () => {
                            onClick();
                        }
                    }}
                >
                </Polyline>
            );
        case 'MultiLineString':
            return (
                <Polyline 
                    positions={coordinates} 
                    color={marker.color}
                    eventHandlers={{
                        click: () => {
                            onClick();
                        }
                    }}
                >
                </Polyline>
            );
        case 'Polygon':
            return (
                <Polygon 
                    positions={coordinates} 
                    color={marker.color}
                    eventHandlers={{
                        click: () => {
                            onClick();
                        }
                    }}
                >
                </Polygon>
            );
        default:
            return;
    }
};

export default MapElement;