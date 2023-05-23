import React, { useMemo, useState } from "react";
import { LogExtra } from ".";
import { Table } from "antd";
import { SENSOR_NAME } from "../../constant";
import dayjs from "dayjs";
import { hashObject } from "../../utils/hash-object";
import { ColumnsType } from "antd/es/table";
import { Circle, MapContainer, Polyline, TileLayer } from "react-leaflet";
import LocationMarker from "../../components/LocationMarker";

type Props = {
  logs: LogExtra[];
};

type LogData = {
  stt: number;
  title: string;
  time: number;
  temperature: string | undefined;
  humidity: string | undefined;
  light: string | undefined;
  soilMoisture: string | undefined;
  safe: boolean;
  location: string;
};

const columns: ColumnsType<LogData> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    width: 90,
    align: "center",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 200,
    render: (title: string) => {
      if (title === "create") return <span>Create product</span>;
      if (title === "transfer") return <span>Transfer product</span>;
      if (title === "delivery") return <span>Location Updated</span>;
      return <>{title}</>;
    },
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render: (time: number) => dayjs.unix(time).format("DD/MM/YYYY HH:mm"),
    width: 160,
  },
  {
    title: SENSOR_NAME["TEMPERATURE"],
    dataIndex: "temperature",
    key: "temperature",
    width: 150,
  },
  {
    title: SENSOR_NAME["HUMIDITY"],
    dataIndex: "humidity",
    key: "humidity",
  },
  {
    title: SENSOR_NAME["LIGHT"],
    dataIndex: "light",
    key: "light",
  },
  {
    title: SENSOR_NAME["SOIL_MOISTURE"],
    dataIndex: "soilMoisture",
    key: "soilMoisture",
    width: 150,
  },
  {
    title: "Latitude",
    dataIndex: "location",
    key: "location",
    render: (location: string, record: LogData) => {
      if (record.title !== "delivery") return <></>;
      const [latitude, longitude] = location?.split(",");
      return (
        <a
          className="flex items-center gap-2 cursor-pointer"
          href={`https://www.google.com/maps/@${latitude},${longitude},19z`}
          target="_blank"
        >
          {latitude.slice(0, 7)}
          <span>
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
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </span>
        </a>
      );
    },
  },
  {
    title: "Longitude",
    dataIndex: "location",
    key: "location",
    render: (location: string, record: LogData) => {
      if (record.title !== "delivery") return <></>;
      const [latitude, longitude] = location?.split(",");
      return (
        <a
          className="flex items-center gap-2 cursor-pointer"
          href={`https://www.google.com/maps/@${latitude},${longitude},19z`}
          target="_blank"
        >
          {longitude.slice(0, 7)}
          <span>
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
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </span>
        </a>
      );
    },
  },
  {
    title: "Safe",
    dataIndex: "safe",
    key: "safe",
    width: 90,
    align: "center",
    render: (safe: boolean, record: LogData) => {
      if (["create", "transfer"].includes(record.title as string)) return <></>;
      return (
        <span
          style={{ color: safe ? "#10B981" : "#EF4444" }}
          className="justify-center flex"
        >
          {safe ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      );
    },
  },
];

function TablePerForm({ logs }: Props) {
  const [isShowMap, setIsShowMap] = useState(false);

  const data: LogData[] = logs.map((log, index) =>
    ["create", "delivery", "transfer"].includes(
      log.objectId.toString() as string
    )
      ? {
          stt: index + 1,
          title: log.objectId.toString(),
          time: +log.timestamp.toString(),
          temperature: "",
          humidity: "",
          light: "",
          soilMoisture: "",
          safe: true,
          location: log.location.toString(),
        }
      : {
          stt: index + 1,
          title: log.object.title,
          time: +log.timestamp.toString(),
          temperature: log.object.table.find(
            (item) => item.name === "temperature"
          )?.value,
          humidity: log.object.table.find((item) => item.name === "humidity")
            ?.value,
          light: log.object.table.find((item) => item.name === "light")?.value,
          soilMoisture: log.object.table.find(
            (item) => item.name === "soilMoisture"
          )?.value,
          safe: hashObject(log.object) === log.hash,
          location: log.location.toString(),
        }
  );

  const polyline = useMemo(() => {
    return logs
      .filter((i) => i.objectId === "delivery")
      .map((i) => {
        return i.location.toString().split(",");
      });
  }, [logs]);

  return (
    <div className="table-transparent flex w-screen px-4 gap-2">
      <div className="mx-auto">
        <Table<LogData>
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                if (record.title === "delivery") {
                  setIsShowMap(!isShowMap);
                }
              },
            };
          }}
          style={{
            backgroundColor: "transparent",
            width: isShowMap ? "calc(100vw - 500px)" : "90vw",
            transition: "all .5s",
          }}
          scroll={{
            y: "calc(100vh - 300px)",
            x: "300px",
          }}
          rowClassName={(record, index) => {
            if (["create", "transfer"].includes(record.title))
              return "font-semibold bg-green-100 bg-opacity-20";
            return "";
          }}
          columns={columns}
          dataSource={data}
          pagination={false}
        ></Table>
      </div>
      {isShowMap && (
        <div className="w-[500px] rounded overflow-hidden">
          <MapContainer
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
            {/* 
            {polyline.map((i) => (
              <Circle
                center={{
                  lat: +i[0],
                  lng: +i[1],
                }}
                radius={10}
                color="#9a111139"
              />
            ))} */}
            <LocationMarker locations={polyline as any} />
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default TablePerForm;
