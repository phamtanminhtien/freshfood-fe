import { Switch } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import RegisterModal from "../../components/RegisterModal";
import TopBar from "../../components/Topbar";
import Device from "../Device";
import Product from "../Product";
import ProductDetail from "../Product/ProductDetail";
import Dashboard from "../Dashboard";
import Welcome from "../Welcome";
import { useCallback, useEffect, useState } from "react";
import { useEth } from "../../stores/eth/ethSlice";
import { socket } from "../../socket";
import RequestTransferModal from "../../components/RequestTransferModal/RequestTransferModal";

function Home() {
  const eth = useEth();
  const [to, setTo] = useState<string | null>();
  const [productId, setProductId] = useState<string | null>();

  const connectSocket = useCallback(() => {
    if (!eth.account) return;
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [eth.account]);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const handleRequestTransfer = useCallback(
    async (data: { to: string; productId: string }) => {
      console.log("request transfer", data);
      setTo(data.to);
      setProductId(data.productId);
    },
    []
  );

  useEffect(() => {
    socket.on("request_transfer", handleRequestTransfer);
    return () => {
      socket.off("request_transfer", handleRequestTransfer);
    };
  }, []);

  return (
    <div className="flex">
      <RegisterModal />
      {to && productId && (
        <RequestTransferModal
          visible={!!to}
          to={to}
          productId={productId}
          setVisible={() => {
            setTo(null);
          }}
        />
      )}
      <div className="relative">
        <TopBar />
        {/* <div className="flex gap-2 items-start relative min-h-[calc(100vh-60px)]"> */}
        <Switch>
          <PrivateRoute path={"/v1/home"}>
            <Welcome />
          </PrivateRoute>
          <PrivateRoute exact path={"/v1/product"}>
            <Product />
          </PrivateRoute>

          <PrivateRoute path={"/v1/product/:id"}>
            <ProductDetail />
          </PrivateRoute>

          <PrivateRoute path={"/v1/dashboard"}>
            <Dashboard />
          </PrivateRoute>

          <PrivateRoute path={"/v1/device"}>
            <Device />
          </PrivateRoute>
        </Switch>
        {/* </div> */}
      </div>
    </div>
  );
}

export default Home;
