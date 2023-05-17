import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

function BarChart() {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Dataset 3",
        data: labels.map(() => Math.floor(Math.random() * 1000)),
        backgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };

  return <Bar className="w-full" options={options} data={data} />;
}

export default BarChart;
