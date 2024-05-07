import MapElement from './MapElement';
import { MarkerListProps } from '../interfaces';

const MarkerList = ({
  layers,
  setActiveMarker,
  setFormVisible,
  searchParams,
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
              const layerIds = searchParams.get('layers') || '';
                if (layerIds.length > 0) {
                  setSearchParams({layers: layerIds, marker: `${marker.id}`})
                } else {
                  setSearchParams({marker: `${marker.id}`})
                }
              }}
              disabled={modal !== ''}
            />
          ))
        )}
    </>
  );
};

export default MarkerList;