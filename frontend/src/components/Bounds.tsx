import React from 'react';
import { MapContainer, Polygon, Rectangle, TileLayer } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import bounds from '../utils/bounds';

const Bounds = () => {
  // Create a bounding box covering the entire map
  const fullBounds = new LatLngBounds([
    [90, -180], // Top-left corner
    [-90, 180], // Bottom-right corner
  ]);

  return (
    <>
        <Rectangle bounds={fullBounds} pathOptions={{color: '#000', fillOpacity: 0.2}} />
        <Polygon positions={bounds} pathOptions={{ color: '#fff', fillOpacity: 0.2 }} />
    </>
  );
};

export default Bounds;