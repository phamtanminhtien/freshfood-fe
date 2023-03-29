import { ethers } from "ethers";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import RegisterModal from "./components/RegisterModal";
import SideBar from "./components/SideBar";
import TopBar from "./components/Topbar";
import Home from "./containers/Home";
import Login from "./containers/Login";
import {
  connectNetwork,
  connectWallet,
  getContract,
  setLoading,
  setState,
  signOut,
  useEth,
} from "./stores/eth/ethSlice";
import { FreshFood__factory } from "./types";

function App() {
  const dispatch = useDispatch();
  const eth = useEth();
  const contract = getContract();
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  useEffect(() => {
    initContract();
  }, []);

  useEffect(() => {
    if (eth.account) {
      getInfo(eth.account);
    }
  }, [eth.account]);

  console.log(eth);

  const getInfo = async (account: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (account) {
      const owner = await FreshFood__factory.connect(
        eth.contractAddress,
        provider.getSigner()
      ).getOwner({
        from: account,
      });

      if (owner && owner.name != "") {
        dispatch(
          setState({
            isOwnerRegistered: true,
            ownerInfo: owner,
            account: account,
            isLoading: false,
          })
        );
        return;
      }

      setShowRegisterModal(true);
    }
  };

  const initContract = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const network = await provider.getNetwork();

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          getInfo(accounts[0]);
        } else {
          dispatch(signOut());
        }
      });

      dispatch(
        connectNetwork({
          network,
        })
      );

      const accounts = await provider.listAccounts();
      dispatch(connectWallet(accounts[0]));
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
            <RegisterModal
              open={showRegisterModal}
              setOpen={setShowRegisterModal}
            />

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
