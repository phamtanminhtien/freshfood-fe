import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeviceCard from "../../../components/DeviceCard";
import { Device, deviceService } from "../../../services/deviceService";
import { useEth } from "../../../stores/eth/ethSlice";

function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const eth = useEth();
  const [idsLoading, setIdsLoading] = useState<string[]>([]);

  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    try {
      const res = await deviceService.getByOwnerAddress(eth.account as string);
      // const res = await deviceService.getAll();
      setDevices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      setIdsLoading([...idsLoading, id]);
      await deviceService.put(id, {
        active: !devices.find((device) => device._id === id)?.active,
      });
      await getDevices();
      setIdsLoading(idsLoading.filter((loadingId) => loadingId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-5 w-full gap-2">
      <Link
        to="/v1/device/create"
        className="bg-gray-50/40 p-3 rounded-2xl shadow-lg flex justify-center items-center border-4 border-dashed text-white cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-14 h-14"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          ></path>
        </svg>
      </Link>
      {devices.map((device) => (
        <DeviceCard
          key={device._id}
          isToggleLoading={idsLoading.includes(device._id as string)}
          {...device}
          handleToggleActive={() => handleToggleActive(device._id as string)}
        />
      ))}
    </div>
  );
}

export default DeviceList;
