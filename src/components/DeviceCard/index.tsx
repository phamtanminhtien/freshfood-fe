import React from "react";
import { Device } from "../../services/deviceService";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = Device & {
  handleToggleActive: () => void;
  isToggleLoading: boolean;
  onSelected: (id: string) => void;
  id: string;
};

function DeviceCard({
  serial,
  active,
  id,
  handleToggleActive,
  isToggleLoading,
  onSelected,
}: Props) {
  return (
    <div className="shadow-lg bg-white rounded-lg py-3 flex flex-col gap-5">
      <div
        onClick={() => onSelected(id)}
        className="cursor-pointer justify-center items-center flex"
      >
        <h2 className="text-base font-bold text-center  truncate max-w-[40%]">
          #{serial}
        </h2>
      </div>
      <div className="flex justify-center items-center">
        <div
          className={`status ${active ? "active" : ""} ${
            isToggleLoading ? "blink-faster" : ""
          }`}
        ></div>
      </div>

      <div className="flex justify-center items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 flex justify-center items-center border rounded-full shadow-xl cursor-pointer select-none"
          onClick={handleToggleActive}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-14 h-14"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export default DeviceCard;
