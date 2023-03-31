import React from "react";

function Down() {
  return (
    <div className="flex justify-center items-center flex-col py-4 gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
      <div className="text-gray-500 -translate-y-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  );
}

export default Down;
