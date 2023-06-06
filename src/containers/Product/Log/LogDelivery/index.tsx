import React, { useMemo } from "react";
import { LogStruct } from "../../../../types/contracts/FreshFood";
import { Table } from "antd";
import { convertToDMS } from "../../../../utils/convert-to-DMS";

type Props = {
  data: LogStruct;
  id: string;
};

function LogDelivery({ data }: Props) {
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (value: any, record: any, index: number) => index + 1,
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];
  const [latitude, longitude] = data.location.toString().split(",");

  const dataSource = useMemo(() => {
    return [
      {
        key: "Longitude",
        value: longitude,
      },
      {
        key: "Latitude",
        value: latitude,
      },
    ];
  }, [longitude, latitude]);

  return (
    <div className="flex gap-4 p-4 border-[1px] rounded-lg border-gray-300">
      <div className="w-[30%]">
        <a
          className="text-lg font-semibold flex items-center gap-1"
          href={`https://www.google.com/maps/place/${convertToDMS(
            +latitude,
            +longitude
          )}/@${latitude},${longitude},17z`}
          target="_blank"
        >
          Location Update
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
      </div>
      <div className="flex-1">
        <Table
          className="w-full border-[1px] rounded-lg border-gray-300"
          size="small"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        ></Table>
      </div>
    </div>
  );
}

export default LogDelivery;
