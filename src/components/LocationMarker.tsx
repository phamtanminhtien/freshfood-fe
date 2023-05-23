import { useEffect, useMemo, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { Device, Station } from "../services/deviceService";
import MarkerCustom from "./MarkerCustom";
import { LogStruct } from "../types/contracts/FreshFood";
import L from "leaflet";

type Props = {
  locations: [number, number][];
};

const LocationMarker = ({ locations }: Props) => {
  const map = useMapEvents({
    // click(e) {
    //   map.locate();
    //   map.flyTo(e.latlng, 14, {
    //     duration: 2,
    //   });
    // },
    // locationfound(e) {
    //   map.flyTo(e.latlng, map.getZoom());
    // },
  });

  useEffect(() => {
    // if (!device?.stations) return;
    // const last = device?.stations[device?.stations.length - 1] as Station;
    // if (last) {
    //   map.flyTo([last.latitude, last.longitude], 14, {
    //     duration: 2,
    //   });
    // }
    if (locations.length === 0) return;
    const polygon = new L.Polygon(locations).addTo(map);

    // Get bounds object
    const bounds = polygon.getBounds();
    console.log(bounds);
    // Fit the map to the polygon bounds
    map.fitBounds(bounds);

    // Or center on the polygon
    const center = bounds.getCenter();
    map.panTo(center);
  }, [locations, map]);

  return (
    <>
      {locations &&
        locations.map((locations, index) => {
          const [latitude, longitude] = locations;

          return (
            <MarkerCustom
              key={index}
              log={{
                latitude: +latitude,
                longitude: +longitude,
              }}
            ></MarkerCustom>
          );
        })}
    </>
  );
};

export default LocationMarker;
