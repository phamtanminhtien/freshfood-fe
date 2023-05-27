import { Avatar } from "antd";
import React from "react";
import { useEth } from "../../stores/eth/ethSlice";
import { UserOutlined } from "@ant-design/icons";
import Menu from "../Menu";
import logo from "../../assets/logo.png";

function TopBar() {
  const eth = useEth();

  return (
    <div className="bg-white w-screen shadow-md h-[60px] flex justify-center items-center sticky top-0 z-10">
      <div className="container flex mx-auto justify-between items-center">
        <div className="flex gap-11 ">
          <div className="flex justify-center items-center px-2">
            <img className="object-cover w-[40px]" src={logo} alt="logo" />
          </div>
          {/* <h1 className="text-4xl font-thin py-2">Logo</h1> */}
          <Menu />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Avatar
            size={40}
            className="bg-[#4ABF78] flex justify-center items-center"
          >
            <UserOutlined className="flex justify-center items-center" />
          </Avatar>
          <h2 className="text-lg font-thin py-2">{eth.ownerInfo?.name}</h2>
        </div>
      </div>
    </div >
  );
}

export default TopBar;
