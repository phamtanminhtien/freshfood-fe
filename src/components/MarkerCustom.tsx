import React from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import icon from "../assets/location.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [35, 41],
  iconAnchor: [17, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
  log: {
    latitude: number;
    longitude: number;
  };
};

function MarkerCustom({ log }: Props) {
  return (
    <Marker draggable={true} position={[log.latitude, log.longitude]}></Marker>
  );
}

export default MarkerCustom;
