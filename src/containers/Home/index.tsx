import React from "react";
import { motion } from "framer-motion";
import RegisterModal from "../../components/RegisterModal";
import TopBar from "../../components/Topbar";
import { Switch, useLocation, useParams } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import { useEth } from "../../stores/eth/ethSlice";
import Menu from "../../components/Menu";
import Product from "../Product";
import ProductDetail from "../Product/ProductDetail";
import Device from "../Device";

function Home() {
  return (
    <div className="flex">
      <RegisterModal />

      {
        <div className="relative">
          <TopBar />
          <div className="flex gap-2 p-2 items-start relative">
            <Menu />
            <Switch>
              <PrivateRoute path={"/v1/dashboard"}>dashboard</PrivateRoute>
              <PrivateRoute exact path={"/v1/product"}>
                <Product />
              </PrivateRoute>

              <PrivateRoute path={"/v1/product/:id"}>
                <ProductDetail />
              </PrivateRoute>

              <PrivateRoute path={"/v1/device"}>
                <Device />
              </PrivateRoute>
            </Switch>
          </div>
        </div>
      }
    </div>
  );
}

export default Home;
