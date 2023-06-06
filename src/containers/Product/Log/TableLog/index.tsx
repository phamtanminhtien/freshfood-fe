import React, { useEffect, useState } from "react";
import { LogStruct } from "../../../../types/contracts/FreshFood";
import Table, { ColumnsType } from "antd/es/table";
import {
  ObjectData,
  objectStoreService,
} from "../../../../services/objectStoreService";
import dayjs from "dayjs";
import { Popover, Tooltip } from "antd";
import { readableMapper } from "../../../../utils/readable-mapper";
import objectHash from "object-hash";
import { hashObject } from "../../../../utils/hash-object";
import { convertToDMS } from "../../../../utils/convert-to-DMS";

type Props = {
  data?: LogStruct[];
};

type LogData = LogStruct & { object: ObjectData; verify: boolean };
function TableLog({ data }: Props) {
  const [logs, setLogs] = useState<LogData[]>([]);

  useEffect(() => {
    getLogs();
  }, [data]);

  const getLog = async (objectId: string) => {
    try {
      const res = await objectStoreService.get(objectId.toString());
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getLogs = async () => {
    try {
      const arr = [];
      if (!data) return;
      for (let i = 0; i < data.length; i++) {
        if (
          ["create", "transfer", "delivery"].includes(
            data[i].objectId.toString()
          )
        ) {
          arr.push({
            title: data[i].objectId.toString(),
          });
          continue;
        }
        arr.push(getLog(data[i].objectId.toString()));
      }
      const logs = await Promise.all(arr);
      const logsWithExtra = logs.map((log, index) => {
        if (["create", "transfer", "delivery"].includes(log?.title as string))
          return {
            ...data[index],
            object: null as any,
            verify: false,
          };
        return {
          ...data[index],
          object: log as ObjectData,
          verify: data[index].hash === hashObject(log),
        };
      });
      setLogs(logsWithExtra);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnsType<LogData> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as "center",
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (_: any, record: LogData) => {
        return dayjs
          .unix(+record.timestamp.toString())
          .format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: LogData) => {
        if (record.objectId === "create") return "Create product";
        if (record.objectId === "transfer") return "Transfer product";
        if (record.objectId === "delivery")
          return <span>Location Updated</span>;
        if (!record.object) return "";
        return (
          <span className="flex gap-1">
            {record.verify ? (
              <span className="text-green-600 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : (
              <span className="text-red-800 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            {record.object.title}
          </span>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (_: any, record: LogData) => {
        if (record.objectId === "create") return "Successfully";
        if (record.objectId === "transfer") return "Successfully";
        if (record.objectId === "delivery") return "Successfully";
        if (!record.object) return "";
        return (
          <Tooltip placement="topLeft" title={record.object.description}>
            {record.object.description}
          </Tooltip>
        );
      },
    },
    {
      align: "center" as "center",
      width: 50,
      render: (_: any, record: LogData) => {
        if (record.objectId === "create") return "0";
        if (record.objectId === "transfer") return "0";

        if (record.objectId === "delivery") {
          const [longitude, latitude] = record.location.toString().split(",");
          return (
            <Popover
              placement="right"
              content={
                <div className="flex flex-col">
                  <div className="flex justify-between gap-2">
                    <span>Longitude:</span>
                    <span>{longitude}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span>Latitude:</span>
                    <span>{latitude}</span>
                  </div>
                </div>
              }
            >
              <a
                href={`https://www.google.com/maps/place/${convertToDMS(
                  +latitude,
                  +longitude
                )}/@${latitude},${longitude},17z`}
                target="_blank"
                className="cursor-pointer"
              >
                2
              </a>
            </Popover>
          );
        }

        if (!record.object) return "";
        return (
          <Popover
            placement="right"
            content={
              <div className="flex flex-col">
                {record.object?.table.map((item) => (
                  <div className="flex justify-between gap-2">
                    <span>{readableMapper(item.name)}:</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            }
          >
            <span className="cursor-pointer">{record.object.table.length}</span>
          </Popover>
        );
      },
    },
  ];

  if (!data) return null;

  return (
    <Table<LogData>
      className="border border-gray-100 rounded-md"
      size="small"
      pagination={false}
      columns={columns}
      dataSource={logs}
      rowClassName={(record, index) => {
        if (["create", "transfer"].includes(record.objectId.toString()))
          return "bg-green-100 font-semibold";
        if (!record.verify) return "bg-red-100 font-semibold";
        return "";
      }}
    />
  );
}

export default TableLog;
