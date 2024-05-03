import MapElement from './MapElement';
import { MarkerListProps } from '../interfaces';

const MarkerList = ({
  layers,
  setActiveMarker,
  setFormVisible,
  modal,
}: MarkerListProps) => {
  return (
    <>
      {layers
        .map((layer) =>
          layer.markers.map((marker) => (
            <MapElement
              key={marker.id}
              marker={marker}
              onClick={() => {
                setActiveMarker(marker.id);
                setFormVisible('timestamp-list');
              }}
              disabled={modal !== ''}
            />
          ))
        )}
    </>
  );
};

export default MarkerList;