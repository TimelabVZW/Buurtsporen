import { Polygon, Rectangle } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import bounds from '../utils/bounds';

const Bounds = () => {
  const fullBounds = new LatLngBounds([
    [90, -180],
    [-90, 180], 
  ]);

  return (
    <>
        <Rectangle bounds={fullBounds} pathOptions={{color: '#000', fillOpacity: 0.2}} />
        <Polygon positions={bounds} pathOptions={{ color: '#fff', fillOpacity: 0.4 }} />
    </>
  );
};

export default Bounds;