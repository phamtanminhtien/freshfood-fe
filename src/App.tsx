import { ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import {
  setEthState,
  useEth,
  getContract,
  overrideEthState,
} from "./stores/eth/ethSlice";
import Tracking from "./containers/Tracking";
import { socket } from "./socket";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);

function App() {
  const dispatch = useDispatch();
  const eth = useEth();

  useEffect(() => {
    initContract();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [eth.account]);

  const getUserInfo = async () => {
    try {
      if (!eth.account) return;
      const contract = getContract();
      const owner = await contract.getOwner({
        from: eth.account as string,
      });

      dispatch(
        setEthState({
          ownerInfo: owner,
        })
      );
    } catch (error: any) {
      console.error(error);
    }

    dispatch(setEthState({ isLoading: false }));
  };

  const initContract = async () => {
    if (window.ethereum) {
      try {
        // get list of accounts
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          dispatch(
            setEthState({
              account: accounts[0],
            })
          );
          localStorage.setItem("account", accounts[0]);
        }
        // update account when user changes it
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          dispatch(
            setEthState({
              account: accounts[0],
            })
          );
          localStorage.setItem("account", accounts[0]);
        });
      } catch (error: any) {
        console.error(error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>

        <Route exact path="/tracking/:id">
          <Tracking />
        </Route>

        <Route path="/v1">
          <Home />
        </Route>

        <Route path="/404">
          <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-9xl font-bold">404</h1>
            <h2 className="text-3xl font-bold">Page not found</h2>
          </div>
        </Route>

        <Route path="*">
          <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-9xl font-bold">404</h1>
            <h2 className="text-3xl font-bold">Page not found</h2>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
