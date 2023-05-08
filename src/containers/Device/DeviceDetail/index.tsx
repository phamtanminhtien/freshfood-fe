import { Button, Form, Input, InputNumber, notification, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Device,
  deviceService,
  Station,
} from "../../../services/deviceService";
import { AnimatePresence, motion } from "framer-motion";
import { useEth } from "../../../stores/eth/ethSlice";

type Props = {
  id?: string;
};

function DeviceDetail({ id: idFromProps }: Props) {
  const params = useParams<{ id: string }>();
  const id = idFromProps || params.id;
  const eth = useEth();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [device, setDevice] = useState<Partial<Device>>({
    stations: [
      {
        name: "",
        longitude: 0,
        latitude: 0,
      },
    ],
    active: false,
    serial: "",
  });

  useEffect(() => {
    if (id) {
      getDevice();
    }
  }, [id]);

  const getDevice = async () => {
    try {
      const res = await deviceService.get(id);
      setDevice(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      const value: Partial<Device> = {
        serial: device.serial,
        active: device.active,
        stations: device.stations,
      };
      setLoading(true);
      if (id) {
        await deviceService.put(id, value);
      } else {
        await deviceService.post({
          ...value,
          ownerAddress: eth.account as string,
        });
      }
      setLoading(false);

      notification.success({
        message: "Success",
        description: "Device saved successfully",
      });
      history.push("/v1/device");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white w-full rounded-md p-2">
      <div className="grid grid-cols-12">
        <div className="col-span-8">
          <div className="w-full h-full flex justify-center items-center">
            Map
          </div>
        </div>
        <div className="col-span-4">
          <h2 className="text-lg font-bold text-center py-5">
            {id ? `Update Device` : "Add Device"}
          </h2>
          <form className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="serial" className="text-sm">
                Serial:
              </label>
              <Input
                type="text"
                name="serial"
                id="serial"
                value={device.serial}
                onChange={(e) =>
                  setDevice({ ...device, serial: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="active" className="text-sm">
                Active:
              </label>
              <div className="">
                <Switch
                  checked={device.active}
                  onChange={(e) => setDevice({ ...device, active: e })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="active" className="text-sm">
                  Station:
                </label>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDevice({
                      ...device,
                      stations: [
                        ...(device.stations ? device.stations : []),
                        { name: "", longitude: 0, latitude: 0 },
                      ],
                    });
                  }}
                  className="border w-6 h-6 flex justify-center items-center border-gray-400 text-gray-400 hover:border-black hover:text-black cursor-pointer select-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                </motion.div>
              </div>
              <div className="flex flex-col gap-2">
                {device.stations?.map((station: Station, index: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-1"
                    key={index}
                  >
                    <div className="flex-1 flex gap-1">
                      <Input
                        className="flex-1"
                        value={station.name}
                        placeholder="Name"
                        onChange={(e) => {
                          const newStations = device.stations?.map((s, i) => {
                            if (i === index) {
                              return { ...s, name: e.target.value };
                            }
                            return s;
                          });
                          setDevice({ ...device, stations: newStations });
                        }}
                      />
                      <InputNumber
                        className="flex-1"
                        value={station.longitude}
                        placeholder="Longitude"
                        onChange={(value) => {
                          const newStations = device.stations?.map((s, i) => {
                            if (i === index) {
                              return { ...s, longitude: value || 0 };
                            }
                            return s;
                          });
                          setDevice({ ...device, stations: newStations });
                        }}
                      />
                      <InputNumber
                        className="flex-1"
                        value={station.latitude}
                        placeholder="Latitude"
                        onChange={(value) => {
                          const newStations = device.stations?.map((s, i) => {
                            if (i === index) {
                              return { ...s, latitude: value || 0 };
                            }
                            return s;
                          });
                          setDevice({ ...device, stations: newStations });
                        }}
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setDevice({
                          ...device,
                          stations: device.stations?.filter(
                            (s, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-600 flex justify-center items-center cursor-pointer select-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={4}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 12H6"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                ))}
                <div className="flex justify-end">
                  <Button
                    loading={loading}
                    disabled={loading}
                    onClick={onSubmit}
                    type="primary"
                  >
                    {id ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeviceDetail;
