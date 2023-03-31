import React, { useEffect, useState } from "react";
import { LogStruct } from "../../../types/contracts/FreshFood";
import Lottie, { useLottie } from "lottie-react";
import axios from "axios";
import Down from "./Down";
import LogWithLottie from "./LogWithLottie";
import LogCreate from "./LogCreate";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { ethers } from "ethers";
import {
  ObjectData,
  objectStoreService,
} from "../../../services/objectStoreService";
import * as hash from "object-hash";

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

  useEffect(() => {
    getLog();
  }, [id]);
  const getLog = async () => {
    try {
      const res = await objectStoreService.get(data.objectId.toString());
      setObjectData(res.data);
      setVerify(data.hash === hash(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4 border-dashed p-4 border-[3px] rounded-lg border-gray-500">
        <div className="col-span-2">
          <img
            className="rounded-lg"
            src="https://cdn.mos.cms.futurecdn.net/sKbruCKdeZpKnNpcwf35fc-1200-80.jpg"
          ></img>
        </div>
        <div className="col-span-6">
          <div className="text-lg font-bold">
            {`${objectData?.title}`}

            {verify === null && <span className="text-sm"> Loading...</span>}
            {verify === true && (
              <span className="text-green-800 text-sm"> Safe</span>
            )}
            {verify === false && (
              <span className="text-red-800 text-sm"> Not Safe</span>
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

            {objectData?.date}
          </div>
          <div className="text-sm text-gray-500">{objectData?.description}</div>
        </div>
        <div className="col-span-4">
          {objectData?.table.map((item, index) => (
            <div className="grid grid-cols-5">
              <div className="col-span-1 border px-2">{item.name}:</div>
              <div className="col-span-4 border px-2">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <Down />
      {showCreate && <LogCreate id={id} getProduct={getProduct} />}
    </>
  );
}

export default Log;
