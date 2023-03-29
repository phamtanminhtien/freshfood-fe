import React from "react";
import { motion } from "framer-motion";

function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto container bg-white/90 rounded-lg shadow  backdrop-filter backdrop-blur-[20px]"
    >
      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-thin">Card Title</h1>
          <div className="flex gap-2">
            <button className="bg-gray-200 rounded-lg p-2 hover:bg-gray-300">
              Edit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Home() {
  return (
    <div className="mx-auto container">
      <div className="flex gap-2 mt-10">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

export default Home;
