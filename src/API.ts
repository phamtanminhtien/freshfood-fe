const API = {
  OBJECT_STORE: {
    GET: (id: string) => `/object-stores/${id}`,
    POST: `/object-stores`,
    DELETE: (id: string) => `/object-stores/${id}`,
    GET_ALL: `/object-stores`,
  },
};

export default API;
