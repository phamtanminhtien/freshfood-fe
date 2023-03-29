import { Avatar } from "antd";
import React from "react";
import { useEth } from "../../stores/eth/ethSlice";

function TopBar() {
  const eth = useEth();

  return (
    <div className="bg-white w-screen shadow-md">
      <div className="container flex mx-auto justify-between items-center">
        <div className="">
          <h1 className="text-4xl font-thin py-2">Logo</h1>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Avatar size={40}>U</Avatar>
          <h2 className="text-lg font-thin py-2">{eth.ownerInfo?.name}</h2>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
