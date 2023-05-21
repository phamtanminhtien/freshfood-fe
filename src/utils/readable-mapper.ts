import { SENSOR_NAME } from "../constant";

export const readableMapper = (value: string) => {
  switch (value) {
    case "temperature":
      return SENSOR_NAME.TEMPERATURE;
    case "humidity":
      return SENSOR_NAME.HUMIDITY;
    case "light":
      return SENSOR_NAME.LIGHT;
    case "soilMoisture":
      return SENSOR_NAME.SOIL_MOISTURE;
    default:
      return value;
  }
};

export const nameToKey = (name: string) => {
  switch (name) {
    case SENSOR_NAME.TEMPERATURE:
      return "temperature";
    case SENSOR_NAME.HUMIDITY:
      return "humidity";
    case SENSOR_NAME.LIGHT:
      return "light";
    case SENSOR_NAME.SOIL_MOISTURE:
      return "soilMoisture";
    default:
      return name;
  }
};
