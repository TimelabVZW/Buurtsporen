import React, { useState, useEffect } from 'react';
import MapElement from './MapElement';
import { MarkerInterface, MarkerListProps } from '../interfaces';

const MarkerList = ({
  layers,
  filterMarkers,
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