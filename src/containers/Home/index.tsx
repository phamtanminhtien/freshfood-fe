import React from "react";
import { motion } from "framer-motion";
import RegisterModal from "../../components/RegisterModal";
import TopBar from "../../components/Topbar";
import { Switch, useLocation, useParams } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import { useEth } from "../../stores/eth/ethSlice";
import Menu from "../../components/Menu";
import Product from "../Product";

function Home() {
  return (
    <div className="flex">
      <RegisterModal />

      {
        <>
          <div className="">
            <TopBar />
            <div className="flex gap-2 p-2 items-start">
              <Menu />
              <Switch>
                <PrivateRoute path={"/v1/dashboard"}>dashboard</PrivateRoute>
                <PrivateRoute path={"/v1/product"}>
                  <Product />
                </PrivateRoute>
              </Switch>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default Home;
