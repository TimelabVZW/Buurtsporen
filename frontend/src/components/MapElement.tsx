import React from 'react';
import { MapElementProps } from '../interfaces';
import { Marker, Polygon, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';

import BackupMarkerIconImage from '../assets/svg/BS_backup_icon.svg';


//   disabled === modal !== ''
const MapElement: React.FC<MapElementProps> = ({marker, onClick}: MapElementProps): JSX.Element | null => {
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
                        iconUrl: marker.icon? marker.icon.url : '',
                        emptyUrl: BackupMarkerIconImage,
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
                    pathOptions={{interactive: true}}
                    eventHandlers={{
                        click: () => {
                            onClick();
                        }
                    }}
                >
                </Polygon>
            );
        default:
            return null;
    }
};

export default MapElement;