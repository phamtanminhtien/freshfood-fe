import React from "react";
import { Marker } from "react-leaflet";

type Props = {
  station: {
    latitude: number;
    longitude: number;
  };
  setStation: (station: { latitude: number; longitude: number }) => void;
};

function MarkerCustom({ station, setStation }: Props) {
  return (
    <Marker
      draggable={true}
      position={[station.latitude, station.longitude]}
      eventHandlers={{
        dragend: (e) => {
          setStation({
            latitude: e.target.getLatLng().lat,
            longitude: e.target.getLatLng().lng,
          });
        },
      }}
    ></Marker>
  );
}

export default MarkerCustom;
