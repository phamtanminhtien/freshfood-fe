import { ethers } from "ethers";
import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import {
  connectNetwork,
  connectWallet,
  setLoading,
  useEth,
} from "./stores/eth/ethSlice";
import { useDispatch, useSelector } from "react-redux";
import { EthState } from "./stores/eth/eth.type";
import PrivateRoute from "./components/PrivateRoute";
import SideBar from "./components/SideBar";
import TopBar from "./components/Topbar";
import { Modal, Steps } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";

function App() {
  const dispatch = useDispatch();
  const eth = useEth();

  useEffect(() => {
    initContract();
  }, []);

  useEffect(() => {
    getAccountInfo();
  }, [eth.account]);

  const getAccountInfo = async () => {
    if (!eth.account || !ethers.utils.isAddress(eth.account)) return;
    //client side code
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
  };

  const initContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          dispatch(connectWallet(accounts[0]));
        } else {
          dispatch(connectWallet(null));
        }
      });

      dispatch(
        connectNetwork({
          network,
        })
      );

      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        dispatch(connectWallet(accounts[0]));
      }
      dispatch(setLoading(false));
    } else {
      console.log("No ethereum object found");
    }
  };

  return (
    <Router>
      {!eth.isLoading && (
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>

          <div className="flex">
            <Modal open={true} width={1000} title="Verification is in progress">
              <Steps
                items={[
                  {
                    title: "Connect",
                    status: "finish",
                    icon: <UserOutlined />,
                  },
                  {
                    title: "Login",
                    status: "finish",
                    icon: <SolutionOutlined />,
                  },
                  {
                    title: "Verification",
                    status: "process",
                    icon: <LoadingOutlined />,
                  },
                  {
                    title: "Done",
                    status: "wait",
                    icon: <SmileOutlined />,
                  },
                ]}
              />
            </Modal>

            <SideBar />
            <div className="">
              <TopBar />
              <div className="">
                <Switch>
                  <PrivateRoute exact path="/home">
                    <Home />
                  </PrivateRoute>
                </Switch>
              </div>
            </div>
          </div>
        </Switch>
      )}
    </Router>
  );
}

export default App;
