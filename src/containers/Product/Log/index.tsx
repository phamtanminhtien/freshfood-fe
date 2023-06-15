import React, { useEffect, useState } from "react";
import { LogStruct, ProductStruct } from "../../../types/contracts/FreshFood";
import Lottie, { useLottie } from "lottie-react";
import axios from "axios";
import LogWithLottie from "./LogWithLottie";
import LogCreate from "./LogCreate";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { ethers } from "ethers";
import {
  ObjectData,
  objectStoreService,
} from "../../../services/objectStoreService";
import { hashObject } from "../../../utils/hash-object";
import dayjs from "dayjs";
import { Table } from "antd";
import { readableMapper } from "../../../utils/readable-mapper";
import LogDelivery from "./LogDelivery";

function Log({
  data,
  showCreate,
  id,
  getProduct,
}: {
  data: LogStruct;
  showCreate: boolean;
  id: string;
  getProduct: () => void;
}) {
  const [objectData, setObjectData] = useState<ObjectData | null>(null);
  const [verify, setVerify] = useState<boolean | null>(null);
  const eth = useEth();

  if (data.hash.toString() === "finish")
    return (
      <LogWithLottie url="https://assets7.lottiefiles.com/packages/lf20_0nssneim.json" />
    );

  if (data.hash.toString() === "create")
    return (
      <>
        <LogWithLottie url="https://assets7.lottiefiles.com/packages/lf20_ksulo5gx.json" />
        {showCreate && <LogCreate getProduct={getProduct} id={id} />}
      </>
    );

  if (data.hash.toString() === "delivery")
    return (
      <>
        <LogDelivery id={id} data={data} />
        {showCreate && <LogCreate getProduct={getProduct} id={id} />}
      </>
    );
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => readableMapper(text),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];
  useEffect(() => {
    getLog();
  }, [id]);
  const getLog = async () => {
    try {
      if (["create", "transfer", "delivery"].includes(data.objectId.toString()))
        return;
      const res = await objectStoreService.get(data.objectId.toString());
      setObjectData(res.data);
      setVerify(data.hash === hashObject(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  if (data.objectId.toString() === "transfer") return null;

  return (
    <>
      <div className="flex gap-4 p-4 border-[1px] rounded-lg border-gray-300">
        <div className="max-w-[30%]">
          <div className="text-lg font-semibold flex items-center gap-1">
            {`${objectData?.title}`}

            {verify === null && <span className="text-sm"> Loading...</span>}
            {verify ? (
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
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {dayjs(objectData?.timestamp).format("HH:mm DD/MM/YYYY")}
          </div>
          <div className="text-sm text-gray-500]">
            {objectData?.description}
          </div>
        </div>
        <div className="col-span-4 flex-1">
          <Table
            className="w-full border-[1px] rounded-lg border-gray-300"
            size="small"
            dataSource={objectData?.table}
            columns={columns}
            pagination={false}
          ></Table>
        </div>
      </div>
      {showCreate && <LogCreate id={id} getProduct={getProduct} />}
    </>
  );
}

export default Log;
