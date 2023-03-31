import API from "../API";
import configuredAxios from "../configured-axios";

type ObjectStore = {
  _id: string;
  hash: string;
};
export type Row = {
  stt: string;
  name: string;
  value: string;
};
export type ObjectData = {
  title: string;
  description: string;
  date: string;
  table: Row[];
};

export const objectStoreService = {
  get: (id: string) =>
    configuredAxios.get<ObjectData>(API.OBJECT_STORE.GET(id)),
  post: (data: any) =>
    configuredAxios.post<ObjectStore>(API.OBJECT_STORE.POST, data),
  delete: (id: string) => configuredAxios.delete(API.OBJECT_STORE.DELETE(id)),
  getAll: (id?: string) =>
    configuredAxios.get(API.OBJECT_STORE.GET_ALL, {
      id,
    }),
};
