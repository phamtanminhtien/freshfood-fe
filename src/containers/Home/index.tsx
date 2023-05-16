import { Switch } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import RegisterModal from "../../components/RegisterModal";
import TopBar from "../../components/Topbar";
import Device from "../Device";
import Product from "../Product";
import ProductDetail from "../Product/ProductDetail";

function Home() {
  return (
    <div className="flex">
      <RegisterModal />

      <div className="relative">
        <TopBar />
        <div className="flex gap-2 items-start relative min-h-[calc(100vh-60px)]">
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
    </div>
  );
}

export default Home;
