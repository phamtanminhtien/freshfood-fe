import React from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

function Dashboard() {
  return (
    <div className="container mx-auto flex gap-5 mt-5">
      <div className="flex-1">
        <BarChart />
      </div>
      <div className="flex-1">
        <LineChart />
      </div>
    </div>
  );
}

export default Dashboard;
