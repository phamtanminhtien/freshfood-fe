import axios from "axios";
import React, { useEffect, useState } from "react";
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
      <div className="gap-4 p-4 border-[1px] rounded-lg border-gray-300 flex justify-center items-center">
        <div className="w-40">
          <Lottie animationData={animation} />
        </div>
      </div>
    </>
  );
}

export default LogWithLottie;
