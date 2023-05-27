import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const menu_items = [
  {
    name: "Home",
    path: "/v1/home",
  },
  {
    name: "Product",
    path: "/v1/product",
  },
  {
    name: "Dashboard",
    path: "/v1/dashboard",
  },
  {
    name: "Device",
    path: "/v1/device",
  },
];
function Menu() {
  const [selected, setSelected] = React.useState(0);
  const location = useLocation();

  useEffect(() => {
    const index = menu_items.findIndex(
      (item) => location.pathname.indexOf(item.path) !== -1
    );
    setSelected(index);
  }, []);

  return (
    <div className="flex">
      {menu_items.map((item, index) => {
        return (
          <Link to={item.path} key={index}>
            <div
              className="h-[60px] flex justify-center items-center px-4 cursor-pointer"
              onClick={() => {
                setSelected(index);
              }}
            >
              <div className="">
                <div
                  className={`font-extralight ${selected === index ? "text-[#4ABF78]" : "text-gray-700"
                    } `}
                >
                  <div className="">{item.name}</div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Menu;
