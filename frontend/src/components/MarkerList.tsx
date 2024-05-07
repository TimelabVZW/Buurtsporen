import MapElement from './MapElement';
import { MarkerListProps } from '../interfaces';

const MarkerList = ({
  layers,
  setActiveMarker,
  setFormVisible,
  setSearchParams,
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
                setSearchParams({marker: `${marker.id}`})
              }}
              disabled={modal !== ''}
            />
          ))
        )}
    </>
  );
};

export default MarkerList;