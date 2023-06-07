import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  LogStruct,
  OwnerStruct,
  ProductStruct,
} from "../../types/contracts/FreshFood";
import { getContract } from "../../stores/eth/ethSlice";
import {
  ObjectData,
  objectStoreService,
} from "../../services/objectStoreService";
import TablePerForm from "./TablePerForm";
import DrawLine from "./DrawLine";
import { isMobile } from "react-device-detect";
import Mobile from "./Mobile";

export type LogExtra = LogStruct & {
  object: ObjectData;
};

export type TYPE_PERFORM = "TABLE" | "DRAW_LINE";

function Tracking() {
  const params = useParams<{ id: string }>();
  const id: string = params.id;
  const [product, setProduct] = React.useState<ProductStruct>();
  const [logs, setLogs] = React.useState<LogExtra[]>([]);
  const [typePerform, setTypePerform] = React.useState<TYPE_PERFORM>("TABLE");
  const [owner, setOwner] = React.useState<OwnerStruct[]>();

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (product) {
      getLogs();
    }
  }, [product]);

  const getProduct = async () => {
    try {
      const contract = getContract();
      const product = await contract.getProduct(id);
      const owner = await contract.getOwnersOfProduct(id);
      setOwner(owner);
      setProduct(product);
    } catch (error) {
      console.log(error);
    }
  };

  const getLog = async (objectId: string) => {
    try {
      const res = await objectStoreService.get(objectId.toString());
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getLogs = async () => {
    try {
      const arr = [];
      if (!product?.logList) return;

      for (let i = 0; i < product.logList.length; i++) {
        if (
          ["create", "delivery", "transfer"].includes(
            product.logList[i].objectId.toString()
          )
        ) {
          const virtualLog: LogStruct = {
            hash: "",
            objectId: product.logList[i].objectId,
            timestamp: product.logList[i].timestamp,
            location: "",
          };
          arr.push(virtualLog);
          continue;
        }
        arr.push(getLog(product.logList[i].objectId.toString()));
      }

      const logs = await Promise.all(arr);

      const logsWithExtra = logs.map((log: any, index) => {
        if (["create", "delivery", "transfer"].includes(log?.title as string))
          return {
            ...product?.logList[index],
            object: null as any,
          };
        return {
          ...product?.logList[index],
          object: log as ObjectData,
        };
      });
      console.log(logsWithExtra);
      setLogs(logsWithExtra);
    } catch (error) {
      console.log(error);
    }
  };

  const getPerform = () => {
    const props = {
      logs,
      image: product?.image.toString(),
    };

    switch (typePerform) {
      case "TABLE":
        return <TablePerForm {...props} />;
      case "DRAW_LINE":
        return <DrawLine {...props} />;
    }
  };

  if (isMobile)
    return (
      <Mobile
        product={product as ProductStruct}
        logs={logs as LogExtra[]}
        owner={owner as OwnerStruct[]}
      />
    );

  return (
    <div
      style={{
        backgroundImage: `url(${product?.image.toString()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`h-screen w-screen`}
    >
      <div
        className={`h-screen w-screen justify-center items-center flex flex-col gap-4 `}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.446)",
          backdropFilter: "blur(40px)",
          color: "white",
        }}
      >
        <div className="border absolute top-4 right-4 flex gap-3 py-1 px-1 rounded">
          <div
            className={`cursor-pointer`}
            onClick={() => setTypePerform("TABLE")}
          >
            {typePerform === "TABLE" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                />
              </svg>
            )}
          </div>
          <div
            className={`cursor-pointer`}
            onClick={() => setTypePerform("DRAW_LINE")}
          >
            {typePerform === "DRAW_LINE" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center pt-2 flex gap-2 justify-center items-center">
          #{product?.productId.toString()} {product?.name.toString()}
          {product?.verified ? (
            <span className="flex gap-2 justify-center items-center text-base font-normal bg-green-100 text-green-700 px-2 rounded py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>
              Verified by{" "}
              <span className="font-bold">{owner?.[0].name.toString()}</span>
            </span>
          ) : (
            <span className="flex gap-2 justify-center items-center text-base font-normal bg-yellow-100 text-yellow-700 px-2 rounded py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" />
              </svg>
              Processing
            </span>
          )}
        </h1>

        {getPerform()}
      </div>
    </div>
  );
}

export default Tracking;
