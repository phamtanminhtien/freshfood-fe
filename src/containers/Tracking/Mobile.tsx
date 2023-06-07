import React from "react";
import { OwnerStruct, ProductStruct } from "../../types/contracts/FreshFood";
import { LogExtra } from ".";
import dayjs from "dayjs";
import { hashObject } from "../../utils/hash-object";
import { readableMapper } from "../../utils/readable-mapper";
import { convertToDMS } from "../../utils/convert-to-DMS";

type Props = {
  product: ProductStruct;
  logs: LogExtra[];
  owner: OwnerStruct[];
};

function Mobile({ product, logs, owner }: Props) {
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
        className={`h-screen w-screen flex flex-col gap-4  overflow-hidden`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.446)",
          backdropFilter: "blur(10px)",
          color: "white",
        }}
      >
        <h1 className="text-2xl font-bold text-center pt-2 flex gap-2 justify-center items-center flex-col">
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
        <div className="flex flex-col gap-2 p-2 flex-1 overflow-auto">
          {logs.map((log, index) => {
            const safe = hashObject(log.object) === log.hash;
            const [latitude, longitude] = log.location.toString().split(",");
            return (
              <div
                className="bg-white bg-opacity-80 p-2 rounded-md text-black shadow"
                key={index}
              >
                <div className="flex gap-2 items-center text-sm">
                  {dayjs
                    .unix(+log.timestamp.toString())
                    .format("DD/MM/YYYY HH:mm:ss")}
                </div>
                <h2 className="text-lg font-medium flex gap-2 items-center">
                  {log.objectId.toString() === "create" && (
                    <>
                      <span className="text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>Create product</span>
                    </>
                  )}
                  {log.objectId.toString() === "transfer" && (
                    <>
                      <span className="text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                          <path
                            fillRule="evenodd"
                            d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                            clipRule="evenodd"
                          />
                          <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                        </svg>
                      </span>
                      <span>Transfer product</span>
                    </>
                  )}
                  {log.objectId.toString() === "delivery" && (
                    <>
                      <span className="text-yellow-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>Location Updated</span>
                    </>
                  )}
                  {!["create", "transfer", "delivery"].includes(
                    log.objectId.toString()
                  ) && (
                    <>
                      <span
                        style={{ color: safe ? "#10B981" : "#EF4444" }}
                        className="justify-center flex"
                      >
                        {safe ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                      {log.object.title}
                    </>
                  )}
                </h2>
                {log?.object?.table?.map((item, index) => {
                  return (
                    <div
                      className="flex gap-2 items-center text-sm"
                      key={index}
                    >
                      <span className="font-medium">
                        {readableMapper(item.name)}:{" "}
                      </span>
                      <span>{item.value}</span>
                    </div>
                  );
                })}
                {log.objectId === "delivery" && (
                  <a
                    className="flex items-center gap-2 cursor-pointer"
                    href={`https://www.google.com/maps/place/${convertToDMS(
                      +latitude,
                      +longitude
                    )}/@${latitude},${longitude},17z`}
                    target="_blank"
                  >
                    <div className="text-sm">{log.location.toString()}</div>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Mobile;
