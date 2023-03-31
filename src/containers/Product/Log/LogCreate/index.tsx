import React from "react";
import CreateModal from "../CreateModal";

function LogCreate() {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  return (
    <div
      onClick={() => setShowModal(true)}
      className="gap-4 border-dashed p-4 border-[3px] rounded-lg border-gray-200 text-gray-200 flex justify-center items-center hover:border-gray-500 hover:text-gray-500 transition cursor-pointer py-10"
    >
      <CreateModal showModal={showModal} setShowModal={setShowModal} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-10 h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </div>
  );
}

export default LogCreate;
