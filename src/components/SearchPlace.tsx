import axios from "axios";
import React, { useEffect, useState } from "react";
import { Device } from "../services/deviceService";

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
};

function SearchPlace({ setDevice }: Props) {
  const [list, setList] = useState<SearchResponse[]>([]);
  const [query, setQuery] = useState("");

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
      const response = await axios.request(options);
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
    }
  }, [query]);

  return (
    <div className="mb-4 mt-2 relative z-[10000000]">
      <input
        className="border focus:outline-none w-full rounded px-2 py-2 text-lg"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        value={query}
      ></input>
      <div className="absolute top-full z-50 bg-white w-full border rounded border-t-0 rounded-t-none">
        {list.map((item) => (
          <div
            key={item.id}
            className="px-2 py-2 hover:bg-gray-100 cursor-pointer"
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