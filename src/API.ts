const API = {
  OBJECT_STORE: {
    GET: (id: string) => `/object-stores/${id}`,
    GET_BY_IDS: "/object-stores/",
    POST: `/object-stores`,
    DELETE: (id: string) => `/object-stores/${id}`,
    GET_ALL: `/object-stores`,
  },

  DEVICE: {
    GET: (id: string) => `/devices/${id}`,
    GET_BY_SERIAL: (serial: string) => `/devices/serial/${serial}`,
    GET_BY_OWNER_ADDRESS: (ownerAddress: string) =>
      `/devices/owner-address/${ownerAddress}`,
    POST: `/devices`,
    PUT: (id: string) => `/devices/${id}`,
    DELETE: (id: string) => `/devices/${id}`,
    GET_ALL: `/devices`,
  },
};

export default API;
