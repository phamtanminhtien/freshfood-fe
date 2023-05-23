import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import icon from "../../assets/location.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [35, 41],
  iconAnchor: [17, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

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
