import React, { StyleHTMLAttributes, useEffect } from "react";
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
  const [product, setProduct] = React.useState<ProductStruct | null>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [datasets, setDatasets] = React.useState<Dataset[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);

  const eth = useEth();

  useEffect(() => {
    if (eth && productId) {
      getProduct();
    }
  }, [eth, productId, reload]);

  useEffect(() => {
    getLogs();
  }, [product?.logList]);

  const getLogs = async () => {
    if (product?.logList) {
      const arr = [];
      for (let i = 0; i < product.logList.length; i++) {
        if (["create"].includes(product.logList[i].objectId.toString()))
          continue;
        arr.push(getLog(product.logList[i].objectId.toString()));
      }
      const res = await Promise.all(arr);
      const labels = res.map((item) => dayjs(item?.date).format("DD/MM/YYYY"));
      setLabels(labels);
      const _datasets = Object.keys(SENSOR_KEY).map((key) => ({
        label: key,
        data: res.map((item) => {
          const sensor = item?.table.find(
            (i) => i.name === SENSOR_KEY[key as keyof typeof SENSOR_KEY]
          );
          return parseInt(sensor?.value || "0");
        }),
        borderColor: SENSOR_BORDER_COLOR[key as keyof typeof SENSOR_KEY] || "",
        backgroundColor:
          SENSOR_BACKGROUND_COLOR[key as keyof typeof SENSOR_KEY] || "",
      }));
      setDatasets(_datasets);
    }
  };

  const getProduct = async () => {
    try {
      setLoading(true);
      const contract = getContract();
      const product = await contract.getProduct(productId);
      setProduct(product);
      setLoading(false);
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
        text: product?.name.toString(),
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  return <Line className={className} options={options} data={data} />;
}

export default LineChart;
