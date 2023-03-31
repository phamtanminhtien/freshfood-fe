import React, { useEffect, useState } from "react";
import { LogStruct } from "../../../types/contracts/FreshFood";
import Lottie, { useLottie } from "lottie-react";
import axios from "axios";
import Down from "./Down";
import LogWithLottie from "./LogWithLottie";
import LogCreate from "./LogCreate";

function Log({ data, showCreate }: { data: LogStruct; showCreate: boolean }) {
  if (data.hash.toString() === "finish")
    return (
      <LogWithLottie url="https://assets7.lottiefiles.com/packages/lf20_0nssneim.json" />
    );

  if (data.hash.toString() === "create")
    return (
      <>
        <LogWithLottie url="https://assets7.lottiefiles.com/packages/lf20_ksulo5gx.json" />
        {showCreate && <LogCreate />}
      </>
    );

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
          <div className="text-lg font-bold">ABC</div>
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

            {new Date().toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis ea,
            ipsam recusandae dolore consectetur itaque dolorem similique qui
            assumenda ducimus. Repudiandae expedita alias sed iusto! Aut
            deleniti ipsum inventore nostrum!
          </div>
        </div>
        <div className="col-span-4">
          <div className="grid grid-cols-5">
            <div className="col-span-1 border px-2">as:</div>
            <div className="col-span-4 border px-2">as</div>
          </div>
          <div className="grid grid-cols-5">
            <div className="col-span-1 border px-2">as:</div>
            <div className="col-span-4 border px-2">as</div>
          </div>
          <div className="grid grid-cols-5">
            <div className="col-span-1 border px-2">as:</div>
            <div className="col-span-4 border px-2">as</div>
          </div>
        </div>
      </div>
      {showCreate && <LogCreate />}
    </>
  );
}

export default Log;
