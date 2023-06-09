import {
  Circle,
  CircleF,
  GoogleMap,
  Marker,
  MarkerF,
  Polygon,
  Polyline,
  PolylineF,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Select,
} from "antd";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Device,
  deviceService,
  Station,
} from "../../../services/deviceService";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { ProductStruct } from "../../../types/contracts/FreshFood";
import SearchPlace from "../../../components/SearchPlace";

type Props = {
  id?: string;
  reload?: () => void;
};

function DeviceDetail({ id: idFromProps, reload }: Props) {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const id = idFromProps || params.id;
  const eth = useEth();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [products, setProducts] = useState<ProductStruct[]>([]);

  const getProducts = useCallback(async () => {
    try {
      const contract = getContract();
      const products = await contract.getProductByOwner(eth.account as string);
      setProducts(products);
    } catch (error) {
      console.log(error);
    }
  }, [eth]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const [device, setDevice] = useState<Partial<Device>>({
    stations: [
      {
        name: "HCMC University of Technology and Education",
        longitude: 106.771906,
        latitude: 10.850613,
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
      form.setFieldsValue(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      const value: Partial<Device> = {
        serial: device.serial,
        active: device.active,
        nextAddress: device.nextAddress,
        stations: device.stations,
        productId: device.productId,
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
      reload && reload();
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

  const polyline = useMemo(() => {
    if (device.stations) {
      return device.stations.map((station) => ({
        lat: station.latitude,
        lng: station.longitude,
      }));
    }
    return [];
  }, [device, device.stations]);

  const disableSubmit = useMemo(() => {
    return (
      !device.serial ||
      !device.stations ||
      device.stations.length === 0 ||
      !device.nextAddress
    );
  }, [device]);

  const [map, setMap] = useState<any>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  const onLoad = useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds({
    //   lat: 10.850613,
    //   lng: 106.771906,
    // });
    // map.fitBounds(bounds);
    map.setCenter({ lat: 10.850613, lng: 106.771906 });
    map.setZoom(16);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleOnDragEnd = (e: any, index: any) => {
    const newStations = device.stations?.map((s, i) => {
      if (i === index) {
        return {
          ...s,
          longitude: e.latLng.lng(),
          latitude: e.latLng.lat(),
        };
      }
      return s;
    });
    setDevice({ ...device, stations: newStations });
  };

  return (
    <div className="bg-white container mx-auto rounded-md p-2 min-h-[calc(100vh-60px)]">
      <div className="grid grid-cols-12">
        <div className="col-span-8 mr-4">
          <div className="w-full pb-2 h-[calc(100vh-60px)] relative">
            <SearchPlace setDevice={setDevice} map={map}></SearchPlace>
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                zoom={16}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={(e: any) => {
                  setDevice({
                    ...device,
                    stations: [
                      ...(device.stations ? device.stations : []),
                      {
                        name: "",
                        longitude: e.latLng.lng(),
                        latitude: e.latLng.lat(),
                      },
                    ],
                  });
                  map?.panTo(e.latLng);
                }}
              >
                <>
                  {polyline.length > 0 && (
                    <PolylineF
                      path={polyline as any}
                      options={{
                        strokeColor: "#0989ad",
                        strokeOpacity: 1,
                        strokeWeight: 3,
                        icons: [
                          {
                            icon: {
                              path: window.google.maps.SymbolPath
                                .FORWARD_CLOSED_ARROW,
                            },
                            offset: "100%",
                          },
                        ],
                      }}
                    />
                  )}

                  {device?.stations?.map((station, index) => (
                    <MarkerF
                      animation={window.google.maps.Animation.DROP}
                      onDragEnd={(e: any) => {
                        handleOnDragEnd(e, index);
                      }}
                      draggable
                      key={index}
                      position={{
                        lat: station.latitude,
                        lng: station.longitude,
                      }}
                    />
                  ))}

                  {device.stations?.map((station, index) => (
                    <>
                      <CircleF
                        key={index}
                        center={{
                          lat: station.latitude,
                          lng: station.longitude,
                        }}
                        radius={100}
                        options={{
                          strokeColor: "#0989ad",
                          strokeOpacity: 0.8,
                          strokeWeight: 1,
                          fillColor: "#0989ad6b",
                          fillOpacity: 0.35,
                        }}
                      />
                    </>
                  ))}
                </>
              </GoogleMap>
            )}
            {/* <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[51.505, -0.09]}
              zoom={13}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Polyline
                pathOptions={{
                  color: "red",
                }}
                positions={polyline as any}
              />
              <LocationMarker device={device} setDevice={setDevice} />
            </MapContainer> */}
          </div>
        </div>
        <div className="col-span-4  h-[calc(100vh-60px)] overflow-auto pb-3 pr-3">
          <h2 className="text-lg font-bold text-center py-5">
            {id ? `Update Device` : "Add Device"}
          </h2>
          <Form form={form} className="flex flex-col" layout="vertical">
            <div className="flex flex-col gap-1">
              <Form.Item
                label="Address"
                name="serial"
                rules={[
                  {
                    required: true,
                    message: "Please input serial",
                  },
                ]}
              >
                <Input
                  type="text"
                  name="serial"
                  id="serial"
                  value={device.serial}
                  onChange={(e) =>
                    setDevice({ ...device, serial: e.target.value })
                  }
                />
              </Form.Item>
            </div>
            {/* <div className="flex flex-col gap-1">
              <Form.Item label="Active" name="active">
                <div className="">
                  <Switch
                    checked={device.active}
                    onChange={(e) => setDevice({ ...device, active: e })}
                  />
                </div>
              </Form.Item>
            </div> */}
            <div className="flex flex-col gap-1">
              <Form.Item
                label="Next address at the last station"
                name="nextAddress"
                rules={[
                  {
                    required: true,
                    message: "Please input next address",
                  },
                ]}
              >
                <div className="">
                  <Input
                    type="text"
                    name="nextAddress"
                    id="nextAddress"
                    value={device.nextAddress}
                    onChange={(e) =>
                      setDevice({ ...device, nextAddress: e.target.value })
                    }
                  />
                </div>
              </Form.Item>
            </div>

            <div className="flex flex-col gap-1">
              <Form.Item label="Product" name="productId">
                <div className="">
                  <Select
                    allowClear
                    placeholder="Select product"
                    showSearch
                    options={products.map((product) => ({
                      label: product.name,
                      value: +product.productId.toString(),
                    }))}
                    value={device.productId}
                    onChange={(productId) =>
                      setDevice({ ...device, productId })
                    }
                  />
                </div>
              </Form.Item>
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
                        {
                          name: "HCMC University of Technology and Education",
                          longitude: 106.771906,
                          latitude: 10.850613,
                        },
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
                        if (
                          !device.stations?.length ||
                          device.stations?.length === 1
                        ) {
                          message.error("You must have at least one station");
                          return;
                        }
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
                    disabled={loading || disableSubmit}
                    onClick={onSubmit}
                    type="primary"
                  >
                    {id ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default DeviceDetail;
