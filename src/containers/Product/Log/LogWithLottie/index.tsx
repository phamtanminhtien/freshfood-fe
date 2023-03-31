import axios from "axios";
import React, { useEffect, useState } from "react";
import Down from "../Down";
import Lottie, { useLottie } from "lottie-react";

function LogWithLottie({ url }: { url: string }) {
  const [animation, setAnimation] = useState();

  useEffect(() => {
    axios.get(url).then((res) => {
      setAnimation(res.data);
    });
  }, []);

  return (
    <>
      <div className="gap-4 border-dashed p-4 border-[3px] rounded-lg border-gray-500 flex justify-center items-center">
        <div className="w-40">
          <Lottie animationData={animation} />
        </div>
      </div>
      <Down />
    </>
  );
}

export default LogWithLottie;
