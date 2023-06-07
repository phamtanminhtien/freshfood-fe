import React, {
  StyleHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getContract, useEth } from "../../../stores/eth/ethSlice";
import { ProductStruct } from "../../../types/contracts/FreshFood";
import { objectStoreService } from "../../../services/objectStoreService";
import dayjs from "dayjs";
import {
  SENSOR_BACKGROUND_COLOR,
  SENSOR_BORDER_COLOR,
  SENSOR_KEY,
} from "../../../constant";
import { readableMapper } from "../../../utils/readable-mapper";
import { Skeleton } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  productId?: string;
  reload?: number;
  className?: string;
};

type Dataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

function LineChart({ productId, reload, className }: Props) {
  if (!productId) return null;
  const [product, setProduct] = useState<ProductStruct | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const eth = useEth();

  useEffect(() => {
    if (eth && productId) {
      getProduct();
    }
  }, [eth, productId, reload]);

  const getLogs = async () => {
    if (product?.logList) {
      const arr = [];
      const labels = [];
      for (let i = 0; i < product.logList.length; i++) {
        if (
          ["create", "delivery", "transfer"].includes(
            product.logList[i].objectId.toString()
          )
        )
          continue;
        arr.push(product.logList[i].objectId.toString());
        labels.push(
          dayjs
            .unix(+product.logList[i].timestamp.toString())
            .format("DD/MM/YYYY")
        );
      }
      const res = await objectStoreService.getByIds(arr);
      const data = res.data;

      setLabels(labels);
      const _datasets = Object.keys(SENSOR_KEY).map((key) => ({
        label: readableMapper(SENSOR_KEY[key as keyof typeof SENSOR_KEY]),
        data: data.map((item) => {
          const sensor = item?.table.find(
            (i) => i.name === SENSOR_KEY[key as keyof typeof SENSOR_KEY]
          );
          return parseInt(sensor?.value || "0");
        }),
        borderWidth: fullScreen ? 3 : 1,
        borderColor: SENSOR_BORDER_COLOR[key as keyof typeof SENSOR_KEY] || "",
        backgroundColor:
          SENSOR_BACKGROUND_COLOR[key as keyof typeof SENSOR_KEY] || "",
      }));
      setDatasets(_datasets);
    }
  };

  useEffect(() => {
    if (product?.logList) {
      getLogs();
      setLoading(false);
    }
  }, [product?.logList, fullScreen]);

  const getProduct = async () => {
    try {
      const contract = getContract();
      const product = await contract.getProduct(productId);
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${product?.name.toString() || "Loading"} - #${
          product?.productId.toString() || "Loading"
        }`,
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  if (loading) return <Skeleton />;

  return (
    <div
      className={`group ${
        fullScreen
          ? "w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-50 bg-white p-10"
          : "relative"
      }`}
    >
      <div
        className={`text-gray-600 absolute opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50 hover:scale-110 ${
          fullScreen ? "right-5 top-5" : "right-0 top-0"
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setFullScreen(!fullScreen);
        }}
      >
        {fullScreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={"w-5 h-5"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
        )}
      </div>
      <div className="relative w-full h-full">
        <Line className={className} options={options} data={data} />
      </div>
    </div>
  );
}

export default React.memo(LineChart);
