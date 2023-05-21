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

type Props = {
  data?: LogStruct[];
};

function TableLog({ data }: Props) {
  const [logs, setLogs] = useState<(LogStruct & { object: ObjectData })[]>([]);

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
        if (["create"].includes(data[i].objectId.toString())) {
          arr.push({
            title: "create",
          });
          continue;
        }
        arr.push(getLog(data[i].objectId.toString()));
      }
      const logs = await Promise.all(arr);
      const logsWithExtra = logs.map((log, index) => {
        if (log?.title == "create")
          return {
            ...data[index],
            object: null as any,
          };
        return {
          ...data[index],
          object: log as ObjectData,
        };
      });
      setLogs(logsWithExtra);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnsType<LogStruct & { object: ObjectData }> = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (_: any, record: LogStruct & { object: ObjectData }) => {
        console.log(record.timestamp.toString());
        return dayjs
          .unix(+record.timestamp.toString())
          .format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: LogStruct & { object: ObjectData }) => {
        console.log(record);
        if (record.objectId === "create") return "Create product";
        if (record.objectId === "transfer") return "Transfer product";
        if (!record.object) return "";
        return record.object.title;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (_: any, record: LogStruct & { object: ObjectData }) => {
        if (record.objectId === "create") return "Successfully";
        if (record.objectId === "transfer") return "Successfully";
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
      render: (_: any, record: LogStruct & { object: ObjectData }) => {
        if (record.objectId === "create") return "0";
        if (record.objectId === "transfer") return "0";
        if (!record.object) return "";
        return (
          <Popover
            placement="right"
            content={
              <div className="flex flex-col">
                {record.object.table.map((item) => (
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
    <Table<LogStruct & { object: ObjectData }>
      className="border border-gray-200 rounded-md"
      size="small"
      pagination={false}
      columns={columns}
      dataSource={logs}
      rowClassName={(record, index) => {
        if (["create", "transfer"].includes(record.objectId.toString()))
          return "bg-green-200 font-semibold";
        return "";
      }}
    />
  );
}

export default TableLog;
