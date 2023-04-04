import axios, { AxiosResponse } from "axios";

type METHOD = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function requestAPI<T>(
  method: METHOD,
  url: string,
  headers = {} as any,
  dataBody: any,
  config = {} as any
): Promise<AxiosResponse<T, any>> {
  const baseConfig = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    url: url,
    headers: headers,
    method: method,
  };

  if (method === "GET") {
    config.params = dataBody;
  } else {
    config.data = dataBody;
  }

  const account = localStorage.getItem("account");

  if (account) {
    baseConfig.headers["Account"] = `${account}`;
  }

  return axios<T>({
    ...baseConfig,
    ...config,
  })
    .then(async (res) => {
      return res;
    })
    .catch((err) => {
      return new Promise(function (resolve, reject) {
        if (err.response) {
          return reject(err.response);
        }
        return reject(err);
      });
    });
}

const configuredAxios = {
  get<T>(url: string, dataBody?: any, headers = {}, config = {}) {
    return requestAPI<T>("GET", url, headers, dataBody, config);
  },

  post<T>(url: string, dataBody?: any, headers = {}) {
    return requestAPI<T>("POST", url, headers, dataBody);
  },

  put<T>(url: string, dataBody?: any, headers = {}) {
    return requestAPI<T>("PUT", url, headers, dataBody);
  },
  patch<T>(url: string, dataBody?: any, headers = {}) {
    return requestAPI<T>("PATCH", url, headers, dataBody);
  },

  delete<T>(url: string, dataBody?: any, headers = {}) {
    return requestAPI<T>("DELETE", url, headers, dataBody);
  },
};

export default configuredAxios;
