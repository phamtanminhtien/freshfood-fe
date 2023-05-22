import React from "react";
import { LogExtra } from ".";
import { Table } from "antd";
import { SENSOR_NAME } from "../../constant";
import dayjs from "dayjs";
import { hashObject } from "../../utils/hash-object";
import { ColumnsType } from "antd/es/table";

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
};

const columns: ColumnsType<LogData> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (title: string) => {
      if (title === "create") return <span>Create product</span>;
      if (title === "transfer") return <span>Transfer product</span>;
      return <>{title}</>;
    },
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render: (time: number) => dayjs.unix(time).format("DD/MM/YYYY HH:mm"),
  },
  {
    title: SENSOR_NAME["TEMPERATURE"],
    dataIndex: "temperature",
    key: "temperature",
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
  },
  {
    title: "Safe",
    dataIndex: "safe",
    key: "safe",
    render: (safe: boolean, record: LogData) => {
      console.log(record);
      if (["create", "transfer"].includes(record.title as string)) return <></>;
      return (
        <span style={{ color: safe ? "#10B981" : "#EF4444" }}>
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
  const data: LogData[] = logs.map((log, index) =>
    log.objectId === "create"
      ? {
          stt: index + 1,
          title: log.objectId,
          time: +log.timestamp.toString(),
          temperature: "",
          humidity: "",
          light: "",
          soilMoisture: "",
          safe: hashObject(log.object) === log.hash,
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
        }
  );

  return (
    <div className="table-transparent">
      <Table<LogData>
        style={{
          backgroundColor: "transparent",
          width: "1000px",
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
  );
}

export default TablePerForm;
