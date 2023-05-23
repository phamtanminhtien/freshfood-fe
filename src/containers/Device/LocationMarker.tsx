import { useEffect, useMemo, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { Device, Station } from "../../services/deviceService";
import MarkerCustom from "./MarkerCustom";

type Props = {
  device: Partial<Device>;
  setDevice: (device: Partial<Device>) => void;
};

const LocationMarker = ({ device, setDevice }: Props) => {
  const map = useMapEvents({
    click(e) {
      map.locate();
      map.flyTo(e.latlng, 14, {
        duration: 2,
      });
      setDevice({
        ...device,
        stations: [
          ...(device.stations as Station[]),
          {
            name: "",
            longitude: e.latlng.lng,
            latitude: e.latlng.lat,
          },
        ],
      });
    },

    // locationfound(e) {
    //   map.flyTo(e.latlng, map.getZoom());
    // },
  });

  useEffect(() => {
    if (!device?.stations) return;
    const last = device?.stations[device?.stations.length - 1] as Station;
    if (last) {
      map.flyTo([last.latitude, last.longitude], 14, {
        duration: 2,
      });
    }
  }, [device.stations]);

  return (
    <>
      {device.stations &&
        device.stations.map((station, index) => {
          return (
            <MarkerCustom
              key={index}
              station={station}
              setStation={(station) => {
                const stations = device.stations as Station[];
                stations[index] = station as Station;
                setDevice({
                  ...device,
                  stations,
                });
              }}
            ></MarkerCustom>
          );
        })}
    </>
  );
};

export default LocationMarker;
