import API from "../API";
import configuredAxios from "../configured-axios";

export type Station = {
  _id?: string;
  name: string;
  longitude: number;
  latitude: number;
};

export type Device = {
  _id?: string;
  ownerAddress: string;
  serial: string;
  stations: Station[];
  active: boolean;
  nextAddress: string;
  productId?: string;
};

export const deviceService = {
  get: (id: string) => configuredAxios.get<Device>(API.DEVICE.GET(id)),
  getBySerial: (serial: string) =>
    configuredAxios.get<Device>(API.DEVICE.GET_BY_SERIAL(serial)),
  getByOwnerAddress: (ownerAddress: string) =>
    configuredAxios.get<Device[]>(
      API.DEVICE.GET_BY_OWNER_ADDRESS(ownerAddress)
    ),
  post: (data: any) => configuredAxios.post<Device>(API.DEVICE.POST, data),
  put: (id: string, data: any) =>
    configuredAxios.put<Device>(API.DEVICE.PUT(id), data),
  delete: (id: string) => configuredAxios.delete(API.DEVICE.DELETE(id)),
  getAll: () => configuredAxios.get<Device[]>(API.DEVICE.GET_ALL),
};
