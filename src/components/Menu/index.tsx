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
    name: "Log",
    path: "/v1/log",
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
      (item) => item.path === location.pathname
    );
    setSelected(index);
  }, []);

  return (
    <div className="w-60 flex gap-2 flex-col">
      {menu_items.map((item, index) => {
        return (
          <Link to={item.path} key={index}>
            <motion.div
              className=""
              onClick={() => {
                setSelected(index);
              }}
            >
              <motion.div
                animate={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className=""
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${
                    selected === index ? "bg-[#4ABF78] text-white" : "bg-white"
                  } p-4 rounded-md flex justify-between items-center cursor-pointer select-none`}
                >
                  <div className="">{item.name}</div>
                  <div>
                    <DoubleRightOutlined className="flex justify-center items-center" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

export default Menu;
