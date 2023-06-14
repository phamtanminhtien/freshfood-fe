import axios from "axios";
import React, { useEffect, useState } from "react";
import { Device } from "../services/deviceService";
import { Input, Spin } from "antd";

let timeout: NodeJS.Timeout;

export interface SearchResponse {
  id: string;
  name: string;
  address: string;
  website: string;
  location: Location;
  types: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

type Props = {
  setDevice: React.Dispatch<React.SetStateAction<Partial<Device>>>;
  map: any;
};

function SearchPlace({ setDevice, map }: Props) {
  const [list, setList] = useState<SearchResponse[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const getList = async () => {
    const options = {
      method: "GET",
      url: "https://trueway-places.p.rapidapi.com/FindPlaceByText",
      params: {
        text: query,
        language: "vn",
      },
      headers: {
        "X-RapidAPI-Key": "beb7118b32mshbf02dfd492c9a14p14be66jsna2a2e7dcc037",
        "X-RapidAPI-Host": "trueway-places.p.rapidapi.com",
      },
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      setLoading(false);
      setList(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (query) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getList();
      }, 1000);
    } else {
      setList([]);
    }
  }, [query]);

  return (
    <div className=" z-[1000] absolute top-3 left-[50%] w-[300px] -translate-x-1/2">
      <div className="relative">
        <Input
          allowClear
          className="border focus:outline-none w-full rounded px-3 py-1 text-base"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
          placeholder="Search place"
        />
        {loading && (
          <div
            className={`z-[1000] absolute top-0 right-0 h-full flex items-center px-2 ${
              query ? "cursor-pointer" : "cursor-default"
            }`}
          >
            loading
          </div>
        )}
      </div>
      <div className="absolute top-full z-50 bg-white w-full border rounded border-t-0 rounded-t-none">
        {list.map((item) => (
          <div
            key={item.id}
            className="px-2 py-2 hover:bg-gray-100 cursor-pointer overflow-hidden"
            onClick={() => {
              setDevice((device) => ({
                ...device,
                stations: [
                  ...(device.stations || []),
                  {
                    latitude: item.location.lat,
                    longitude: item.location.lng,
                    name: item.name,
                  },
                ],
              }));
              map.panTo({
                lat: item.location.lat,
                lng: item.location.lng,
              });

              setQuery("");
              setList([]);
            }}
          >
            {item.name}
            <div className="text-sm text-gray-500">{item.address}</div>
            <div className="text-sm text-gray-500">{item.website}</div>
            <div className="text-sm text-gray-500">{item.types.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPlace;
