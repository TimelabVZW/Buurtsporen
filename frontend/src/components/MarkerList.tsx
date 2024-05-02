import React, { useState, useEffect } from 'react';
import MapElement from './MapElement';
import { MarkerInterface, MarkerListProps } from '../interfaces';

const MarkerList = ({
  layers,
  layersToShow,
  filterMarkers,
  setActiveMarker,
  setFormVisible,
  modal,
}: MarkerListProps) => {
  return (
    <>
      {layers
        .filter((layer) => layersToShow.includes(layer.name))
        .map((layer) =>
          filterMarkers(layer.markers).map((marker) => (
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